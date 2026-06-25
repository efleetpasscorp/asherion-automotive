"use server"

import { put } from "@vercel/blob"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { isAuthed, login, logout } from "@/lib/auth"
import { setImageOverride } from "@/lib/image-store"
import { imageSlots } from "@/lib/cars"

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

export async function uploadImageAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Your session expired. Please log in again." }

  const slot = String(formData.get("slot") ?? "")
  const file = formData.get("file")

  if (!imageSlots.some((s) => s.key === slot)) {
    return { error: "Unknown image slot." }
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image file to upload." }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Unsupported file type. Use PNG, JPG, WEBP, or AVIF." }
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image is too large. Maximum size is 8MB." }
  }

  try {
    const ext = file.name.split(".").pop()?.toLowerCase() || "png"
    const blob = await put(`stock-images/${slot}-${Date.now()}.${ext}`, file, {
      access: "public",
    })
    await setImageOverride(slot, blob.url)
  } catch (error) {
    console.error("[v0] Upload failed:", error)
    return { error: "Upload failed. Please try again." }
  }

  // Refresh every surface that renders stock images.
  revalidatePath("/")
  revalidatePath("/stock")
  revalidatePath("/admin")

  const label = imageSlots.find((s) => s.key === slot)?.label ?? slot
  return { success: `Updated "${label}" successfully.` }
}
