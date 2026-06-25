import "server-only"
import { get, list, put } from "@vercel/blob"
import * as OTPAuth from "otpauth"
import QRCode from "qrcode"

// The TOTP secret is sensitive, so it lives in PRIVATE Blob storage and is
// only ever read server-side (mirrors how driver's licences are stored).
const SECRET_PATH = "admin/mfa-secret.json"
const ISSUER = "Asherion Automotive"
const LABEL = "Admin"

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
    const { blobs } = await list({ prefix: SECRET_PATH })
    if (!blobs.some((b) => b.pathname === SECRET_PATH)) return null
    const res = await get(SECRET_PATH, { access: "private" })
    if (!res || res.statusCode === 304) return null
    const text = await new Response(res.stream).text()
    const data = JSON.parse(text) as { secret?: string }
    return data.secret ?? null
  } catch (error) {
    console.error("[v0] Failed to read MFA secret:", error)
    return null
  }
}

export async function setMfaSecret(secretBase32: string): Promise<void> {
  await put(SECRET_PATH, JSON.stringify({ secret: secretBase32, createdAt: new Date().toISOString() }), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function isMfaEnrolled(): Promise<boolean> {
  return (await getMfaSecret()) !== null
}
