import "server-only"
import { list, put } from "@vercel/blob"
import crypto from "crypto"
import * as OTPAuth from "otpauth"
import QRCode from "qrcode"

// The TOTP secret is stored in Blob, but AES-256-GCM encrypted with a key
// derived from ADMIN_PASSWORD. The connected Blob store is public, so the
// ciphertext may be fetchable by URL — encryption makes it useless without
// the server-only admin secret. The secret is only ever decrypted server-side.
const SECRET_PREFIX = "admin/mfa-secret"
const ISSUER = "Asherion Automotive"
const LABEL = "Admin"
const ALGO = "aes-256-gcm"

type EncBlob = { iv: string; tag: string; data: string }

function encryptionKey(): Buffer {
  const pw = process.env.ADMIN_PASSWORD ?? ""
  return crypto.scryptSync(pw, "asherion-mfa-salt-v1", 32)
}

function encrypt(plain: string): EncBlob {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGO, encryptionKey(), iv)
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  return { iv: iv.toString("hex"), tag: cipher.getAuthTag().toString("hex"), data: data.toString("hex") }
}

function decrypt(enc: EncBlob): string {
  const decipher = crypto.createDecipheriv(ALGO, encryptionKey(), Buffer.from(enc.iv, "hex"))
  decipher.setAuthTag(Buffer.from(enc.tag, "hex"))
  return Buffer.concat([decipher.update(Buffer.from(enc.data, "hex")), decipher.final()]).toString("utf8")
}

function buildTotp(secretBase32: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: LABEL,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  })
}

// Generate a fresh base32 secret for a new enrollment.
export function generateSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32
}

// otpauth:// URI that Google Authenticator understands.
export function otpauthUri(secretBase32: string): string {
  return buildTotp(secretBase32).toString()
}

// Data URL for the enrollment QR code (rendered in an <img>).
export async function qrDataUrl(secretBase32: string): Promise<string> {
  return QRCode.toDataURL(otpauthUri(secretBase32), { margin: 1, width: 224 })
}

// Validate a 6-digit code against a given secret (±1 time-step tolerance).
export function verifyToken(secretBase32: string, token: string): boolean {
  const cleaned = (token || "").replace(/\s+/g, "")
  if (!/^\d{6}$/.test(cleaned)) return false
  const delta = buildTotp(secretBase32).validate({ token: cleaned, window: 1 })
  return delta !== null
}

export async function getMfaSecret(): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: SECRET_PREFIX })
    if (blobs.length === 0) return null
    // Use the most recently uploaded secret blob.
    const latest = blobs.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))[0]
    const res = await fetch(latest.url, { cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json()) as { enc?: EncBlob }
    if (!data.enc) return null
    return decrypt(data.enc)
  } catch (error) {
    console.error("[v0] Failed to read MFA secret:", error)
    return null
  }
}

export async function setMfaSecret(secretBase32: string): Promise<void> {
  const payload = JSON.stringify({ enc: encrypt(secretBase32), createdAt: new Date().toISOString() })
  await put(`${SECRET_PREFIX}.json`, payload, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function isMfaEnrolled(): Promise<boolean> {
  return (await getMfaSecret()) !== null
}
