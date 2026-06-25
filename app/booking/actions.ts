"use server"

import { saveBooking } from "@/lib/bookings"

export type BookingFormState = {
  status: "idle" | "success" | "error"
  message?: string
}

export async function submitBooking(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const vehicle = String(formData.get("vehicle") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const phone = String(formData.get("phone") || "").trim()
  const preferredDate = String(formData.get("preferredDate") || "").trim()
  const notes = String(formData.get("notes") || "").trim()

  if (!vehicle || !name || !email || !phone) {
    return { status: "error", message: "Please fill in your name, email, phone, and vehicle." }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { status: "error", message: "Please enter a valid email address." }
  }

  try {
    await saveBooking({ vehicle, name, email, phone, preferredDate, notes })
    return {
      status: "success",
      message: "Thanks! Your booking request has been received. Our team will be in touch shortly.",
    }
  } catch {
    return { status: "error", message: "Something went wrong. Please try again or call us." }
  }
}
