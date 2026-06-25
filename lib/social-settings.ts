import "server-only"
import { list, put } from "@vercel/blob"
import crypto from "crypto"

// Social / reviews configuration is stored in Blob. The connected Blob store is
// public, so the Facebook access token (a sensitive credential) is AES-256-GCM
// encrypted with a key derived from ADMIN_PASSWORD. Non-secret fields (profile
// URLs, page id) are stored in clear. The token is only decrypted server-side.
const SETTINGS_PATH = "admin/social-settings.json"
const SETTINGS_PREFIX = "admin/social-settings"
const ALGO = "aes-256-gcm"

export type SocialSettings = {
  instagramUrl: string
  facebookUrl: string
  facebookPageId: string
  facebookAccessToken: string
  updatedAt: string | null
}

const EMPTY: SocialSettings = {
  instagramUrl: "",
  facebookUrl: "",
  facebookPageId: "",
  facebookAccessToken: "",
  updatedAt: null,
}

type EncBlob = { iv: string; tag: string; data: string }

type StoredSettings = {
  instagramUrl: string
  facebookUrl: string
  facebookPageId: string
  tokenEnc: EncBlob | null
  updatedAt: string
}

function encryptionKey(): Buffer {
  const pw = process.env.ADMIN_PASSWORD ?? ""
  return crypto.scryptSync(pw, "asherion-social-salt-v1", 32)
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

export async function getSocialSettings(): Promise<SocialSettings> {
  try {
    const { blobs } = await list({ prefix: SETTINGS_PREFIX })
    if (blobs.length === 0) return { ...EMPTY }
    const latest = blobs.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))[0]
    const res = await fetch(latest.url, { cache: "no-store" })
    if (!res.ok) return { ...EMPTY }
    const stored = (await res.json()) as StoredSettings
    return {
      instagramUrl: stored.instagramUrl ?? "",
      facebookUrl: stored.facebookUrl ?? "",
      facebookPageId: stored.facebookPageId ?? "",
      facebookAccessToken: stored.tokenEnc ? decrypt(stored.tokenEnc) : "",
      updatedAt: stored.updatedAt ?? null,
    }
  } catch (error) {
    console.error("[v0] Failed to read social settings:", error)
    return { ...EMPTY }
  }
}

type SaveInput = {
  instagramUrl: string
  facebookUrl: string
  facebookPageId: string
  // When undefined, the existing token is preserved (admin left the field blank).
  facebookAccessToken?: string
}

export async function saveSocialSettings(input: SaveInput): Promise<void> {
  const current = await getSocialSettings()
  const token =
    input.facebookAccessToken === undefined || input.facebookAccessToken === ""
      ? current.facebookAccessToken
      : input.facebookAccessToken

  const stored: StoredSettings = {
    instagramUrl: input.instagramUrl,
    facebookUrl: input.facebookUrl,
    facebookPageId: input.facebookPageId,
    tokenEnc: token ? encrypt(token) : null,
    updatedAt: new Date().toISOString(),
  }

  await put(SETTINGS_PATH, JSON.stringify(stored), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}
