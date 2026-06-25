import "server-only"
import { cookies } from "next/headers"
import crypto from "crypto"

const COOKIE_NAME = "admin_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Derive a deterministic session token from the admin password secret.
function expectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? ""
  return crypto.createHmac("sha256", secret).update("asherion-admin-session").digest("hex")
}

export async function login(password: string): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret || password !== secret) return false
  const store = await cookies()
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
  return true
}

export async function logout(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAuthed(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  const expected = expectedToken()
  if (token.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}
