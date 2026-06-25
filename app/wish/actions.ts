"use server"

import { saveWish } from "@/lib/wishes"

export type WishFormState = {
  status: "idle" | "success" | "error"
  message?: string
}

export async function submitWish(
  _prev: WishFormState,
  formData: FormData,
): Promise<WishFormState> {
  const make = String(formData.get("make") || "").trim()
  const model = String(formData.get("model") || "").trim()
  const year = String(formData.get("year") || "").trim()
  const budget = String(formData.get("budget") || "").trim()
  const color = String(formData.get("color") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const phone = String(formData.get("phone") || "").trim()
  const notes = String(formData.get("notes") || "").trim()

  if (!make || !name || !email || !phone) {
    return {
      status: "error",
      message: "Please tell us the make you're after, plus your name, email, and phone.",
    }
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { status: "error", message: "Please enter a valid email address." }
  }

  try {
    await saveWish({ make, model, year, budget, color, name, email, phone, notes })
    return {
      status: "success",
      message:
        "Your wish order is in! Our team will hunt down your dream car and reach out with options that match.",
    }
  } catch (error) {
    console.error("[v0] wish submit error:", error)
    return { status: "error", message: "Something went wrong. Please try again or call us." }
  }
}
