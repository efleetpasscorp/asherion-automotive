"use server"

import { put } from "@vercel/blob"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  clearEnrollmentSecret,
  establishSession,
  getEnrollmentSecret,
  isAuthed,
  isMfaPending,
  logout,
  setEnrollmentSecret,
  startMfaChallenge,
  verifyPassword,
} from "@/lib/auth"
import { generateSecret, getMfaSecret, isMfaEnrolled, setMfaSecret, verifyToken } from "@/lib/mfa"
import { deleteVehicle, getVehicleById, upsertVehicle } from "@/lib/catalog"
import { saveSocialSettings } from "@/lib/social-settings"
import { testFacebookConnection } from "@/lib/meta-reviews"
import type { RentalCar, SaleCar, VehicleStatus } from "@/lib/cars"

export type ActionState = { error?: string; success?: string }

// Step 1 — verify the password, then hand off to the MFA step. A new admin
// (no authenticator enrolled yet) is sent into enrollment; otherwise they are
// prompted for the 6-digit code from Google Authenticator.
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "")
  if (!password) return { error: "Please enter the password." }
  if (!verifyPassword(password)) return { error: "Incorrect password. Please try again." }

  await startMfaChallenge()
  if (!(await isMfaEnrolled())) {
    // Hold a candidate secret in a short-lived cookie until the first code confirms
    // it. Reuse any secret already issued this enrollment so a re-submitted password
    // doesn't invalidate a QR the admin may have just scanned.
    const existing = await getEnrollmentSecret()
    if (!existing) await setEnrollmentSecret(generateSecret())
  } else {
    // Already enrolled — make sure no stale enrollment secret lingers so we ask for
    // the real authenticator code, not a fresh QR.
    await clearEnrollmentSecret()
  }
  redirect("/admin/login")
}

// Step 2 — verify the 6-digit authenticator code. Handles both first-time
// enrollment (confirming the new secret) and normal sign-in.
export async function verifyMfaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isMfaPending())) return { error: "Your sign-in session expired. Please start again." }
  const code = String(formData.get("code") ?? "").trim()
  if (!code) return { error: "Enter the 6-digit code from your authenticator app." }

  const enrollSecret = await getEnrollmentSecret()
  if (enrollSecret) {
    if (!verifyToken(enrollSecret, code)) {
      return { error: "That code didn't match. Make sure you scanned the QR, then try again." }
    }
    await setMfaSecret(enrollSecret)
  } else {
    const secret = await getMfaSecret()
    if (!secret) return { error: "Two-factor authentication isn't set up. Please start again." }
    if (!verifyToken(secret, code)) return { error: "Incorrect or expired code. Please try again." }
  }

  await establishSession()
  redirect("/admin")
}

// Abandon an in-progress MFA step and return to the password screen.
export async function cancelMfaAction(): Promise<void> {
  await logout()
  redirect("/admin/login")
}

export async function logoutAction(): Promise<void> {
  await logout()
  redirect("/admin/login")
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"]
const MAX_BYTES = 8 * 1024 * 1024 // 8MB

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim()
}

// Revalidate every surface that renders the catalog.
function revalidateCatalog() {
  revalidatePath("/")
  revalidatePath("/stock")
  revalidatePath("/admin")
}

async function maybeUpload(formData: FormData, id: string, fallback: string): Promise<ActionState | string> {
  const file = formData.get("image")
  if (!(file instanceof File) || file.size === 0) {
    return fallback || "/placeholder.svg"
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Unsupported image type. Use PNG, JPG, WEBP, or AVIF." }
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image is too large. Maximum size is 8MB." }
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "png"
  const blob = await put(`stock-images/${id}-${Date.now()}.${ext}`, file, { access: "public" })
  return blob.url
}

export async function saveVehicleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Your session expired. Please log in again." }

  const editingId = str(formData, "id")
  const kind = str(formData, "kind") === "rental" ? "rental" : "sale"
  const name = str(formData, "name")
  const status = (str(formData, "status") === "coming-soon" ? "coming-soon" : "available") as VehicleStatus

  if (!name) return { error: "Please enter a vehicle name." }

  // Stable id: keep when editing, generate from the name when adding.
  const id = editingId || `${kind}-${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`
  const existing = editingId ? await getVehicleById(editingId) : undefined

  const dollars = Number(str(formData, "amount").replace(/[^0-9.]/g, ""))
  const amountCents = Number.isFinite(dollars) && dollars > 0 ? Math.round(dollars * 100) : 0

  const features = str(formData, "features")
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)

  const imageResult = await maybeUpload(formData, id, existing?.image ?? "")
  if (typeof imageResult !== "string") return imageResult
  const image = imageResult

  try {
    if (kind === "rental") {
      const vehicle: RentalCar = {
        id,
        kind: "rental",
        status,
        slot: id,
        name,
        price: str(formData, "price"),
        amountCents,
        image,
        trans: str(formData, "trans"),
        seats: str(formData, "seats"),
        doors: str(formData, "doors"),
        fuel: str(formData, "fuel"),
        bags: str(formData, "bags"),
        deposit: str(formData, "deposit"),
        description: str(formData, "description"),
        features,
      }
      await upsertVehicle(vehicle)
    } else {
      const vehicle: SaleCar = {
        id,
        kind: "sale",
        status,
        slot: id,
        name,
        price: str(formData, "price"),
        amountCents,
        trans: str(formData, "trans"),
        engine: str(formData, "engine"),
        doors: str(formData, "doors"),
        seats: str(formData, "seats"),
        image,
        year: str(formData, "year"),
        odometer: str(formData, "odometer"),
        fuel: str(formData, "fuel"),
        body: str(formData, "body"),
        color: str(formData, "color"),
        drivetrain: str(formData, "drivetrain"),
        rego: str(formData, "rego"),
        description: str(formData, "description"),
        features,
      }
      await upsertVehicle(vehicle)
    }
  } catch (error) {
    console.error("[v0] Save vehicle failed:", error)
    return { error: "Could not save the vehicle. Please try again." }
  }

  revalidateCatalog()
  return { success: `Saved "${name}" successfully.` }
}

// ---- Reviews & Social (Instagram / Facebook) ----

function isValidUrl(value: string): boolean {
  if (!value) return true // optional
  try {
    const u = new URL(value)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export async function saveSocialSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Your session expired. Please log in again." }

  const instagramUrl = str(formData, "instagramUrl")
  const facebookUrl = str(formData, "facebookUrl")
  const facebookPageId = str(formData, "facebookPageId")
  // Blank token means "keep the existing one" — handled in the store.
  const facebookAccessToken = str(formData, "facebookAccessToken")

  if (!isValidUrl(instagramUrl)) return { error: "Instagram URL must be a valid http(s) link." }
  if (!isValidUrl(facebookUrl)) return { error: "Facebook URL must be a valid http(s) link." }

  try {
    await saveSocialSettings({
      instagramUrl,
      facebookUrl,
      facebookPageId,
      facebookAccessToken: facebookAccessToken || undefined,
    })
  } catch (error) {
    console.error("[v0] Save social settings failed:", error)
    return { error: "Could not save settings. Please try again." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: "Reviews & social settings saved." }
}

export async function testMetaConnectionAction(_prev: ActionState): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Your session expired. Please log in again." }
  const result = await testFacebookConnection()
  return result.ok ? { success: result.message } : { error: result.message }
}

export async function deleteVehicleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Your session expired. Please log in again." }
  const id = str(formData, "id")
  if (!id) return { error: "Missing vehicle id." }
  try {
    await deleteVehicle(id)
  } catch (error) {
    console.error("[v0] Delete vehicle failed:", error)
    return { error: "Could not delete the vehicle. Please try again." }
  }
  revalidateCatalog()
  return { success: "Vehicle removed." }
}
