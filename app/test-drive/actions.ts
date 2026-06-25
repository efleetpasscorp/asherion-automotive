"use server"

import { saveLicenseImage, saveTestDrive } from "@/lib/test-drives"

export type TestDriveFormState = {
  status: "idle" | "success" | "error"
  message?: string
}

export async function submitTestDrive(
  _prev: TestDriveFormState,
  formData: FormData,
): Promise<TestDriveFormState> {
  const vehicle = String(formData.get("vehicle") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const phone = String(formData.get("phone") || "").trim()
  const licenseNumber = String(formData.get("licenseNumber") || "").trim()
  const licenseExpiry = String(formData.get("licenseExpiry") || "").trim()
  const dateOfBirth = String(formData.get("dateOfBirth") || "").trim()
  const preferredDate = String(formData.get("preferredDate") || "").trim()
  const notes = String(formData.get("notes") || "").trim()
  const disclaimer = formData.get("disclaimer") === "on"
  const license = formData.get("license") as File | null

  if (!vehicle || !name || !email || !phone) {
    return { status: "error", message: "Please fill in your name, email, phone, and vehicle." }
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { status: "error", message: "Please enter a valid email address." }
  }
  if (!license || license.size === 0) {
    return { status: "error", message: "Please upload a photo of your driver's licence." }
  }
  if (!license.type.startsWith("image/")) {
    return { status: "error", message: "The licence must be an image file." }
  }
  if (license.size > 8 * 1024 * 1024) {
    return { status: "error", message: "Licence image must be under 8MB." }
  }
  if (!disclaimer) {
    return { status: "error", message: "Please accept the test drive disclaimer to continue." }
  }

  try {
    const licensePathname = await saveLicenseImage(license)
    await saveTestDrive({
      vehicle,
      name,
      email,
      phone,
      licenseNumber,
      licenseExpiry,
      dateOfBirth,
      preferredDate,
      notes,
      licensePathname,
      disclaimerAccepted: true,
    })
    return {
      status: "success",
      message:
        "Thanks! Your test drive request and licence have been received securely. Our team will confirm a time with you shortly.",
    }
  } catch (error) {
    console.error("[v0] test drive submit error:", error)
    return { status: "error", message: "Something went wrong. Please try again or call us." }
  }
}
