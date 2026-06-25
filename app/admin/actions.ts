"use server"

import { put } from "@vercel/blob"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { isAuthed, login, logout } from "@/lib/auth"
import { deleteVehicle, getVehicleById, upsertVehicle } from "@/lib/catalog"
import type { RentalCar, SaleCar, VehicleStatus } from "@/lib/cars"

export type ActionState = { error?: string; success?: string }

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "")
  if (!password) return { error: "Please enter the password." }
  const ok = await login(password)
  if (!ok) return { error: "Incorrect password. Please try again." }
  redirect("/admin")
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
