import "server-only"
import { cookies } from "next/headers"
import crypto from "crypto"

const SESSION_COOKIE = "admin_session"
const PENDING_COOKIE = "admin_mfa_pending"
const ENROLL_COOKIE = "admin_mfa_enroll"

const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const PENDING_MAX_AGE = 60 * 10 // 10 minutes to complete the MFA step

// Derive a deterministic, tamper-proof token from the admin secret + purpose.
function tokenFor(purpose: string): string {
  const secret = process.env.ADMIN_PASSWORD ?? ""
  return crypto.createHmac("sha256", secret).update(purpose).digest("hex")
}

function safeEqual(a: string | undefined, b: string): boolean {
  if (!a || a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

// ---- Step 1: password ----------------------------------------------------

export function verifyPassword(password: string): boolean {
  const secret = process.env.ADMIN_PASSWORD
  return Boolean(secret) && password === secret
}

// ---- MFA pending state (password OK, awaiting 6-digit code) ---------------

export async function startMfaChallenge(): Promise<void> {
  const store = await cookies()
  store.set(PENDING_COOKIE, tokenFor("asherion-mfa-pending"), { ...baseCookie, maxAge: PENDING_MAX_AGE })
}

export async function isMfaPending(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false
  const store = await cookies()
  return safeEqual(store.get(PENDING_COOKIE)?.value, tokenFor("asherion-mfa-pending"))
}

// ---- Enrollment secret (held only until the first code is confirmed) ------

export async function setEnrollmentSecret(secret: string): Promise<void> {
  const store = await cookies()
  store.set(ENROLL_COOKIE, secret, { ...baseCookie, maxAge: PENDING_MAX_AGE })
}

export async function getEnrollmentSecret(): Promise<string | null> {
  const store = await cookies()
  return store.get(ENROLL_COOKIE)?.value ?? null
}

export async function clearEnrollmentSecret(): Promise<void> {
  const store = await cookies()
  store.delete(ENROLL_COOKIE)
}

// ---- Step 2 complete: establish the full session --------------------------

export async function establishSession(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, tokenFor("asherion-admin-session"), { ...baseCookie, maxAge: SESSION_MAX_AGE })
  store.delete(PENDING_COOKIE)
  store.delete(ENROLL_COOKIE)
}

export async function logout(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  store.delete(PENDING_COOKIE)
  store.delete(ENROLL_COOKIE)
}

export async function isAuthed(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false
  const store = await cookies()
  return safeEqual(store.get(SESSION_COOKIE)?.value, tokenFor("asherion-admin-session"))
}
