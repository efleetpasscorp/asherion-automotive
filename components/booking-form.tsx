"use client"

import { useActionState, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import { submitBooking, type BookingFormState } from "@/app/booking/actions"
import { bookingVehicles } from "@/lib/cars"
import { CheckIcon } from "./icons"

const initialState: BookingFormState = { status: "idle" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={pending}>
      {pending ? "Sending..." : "Request Booking"}
    </button>
  )
}

export function BookingForm() {
  const params = useSearchParams()
  const preselected = params.get("vehicle") ?? ""
  const [state, formAction] = useActionState(submitBooking, initialState)
  const [vehicle, setVehicle] = useState(preselected || bookingVehicles[0])

  useEffect(() => {
    if (preselected) setVehicle(preselected)
  }, [preselected])

  const today = new Date().toISOString().split("T")[0]

  if (state.status === "success") {
    return (
      <div className="form booking-success">
        <span className="success-icon" aria-hidden="true">
          <CheckIcon />
        </span>
        <h3 className="h-md">Booking request received</h3>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>{state.message}</p>
      </div>
    )
  }

  return (
    <form className="form" action={formAction}>
      <h3 className="h-md" style={{ marginBottom: 6 }}>
        Book your vehicle
      </h3>
      <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.92rem" }}>
        Submit a request and our team will confirm availability and arrange payment with you.
      </p>

      <div className="field">
        <label htmlFor="vehicle">Vehicle</label>
        <select
          id="vehicle"
          name="vehicle"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          required
        >
          {bookingVehicles.map((v) => (
            <option key={v}>{v}</option>
          ))}
          {preselected && !bookingVehicles.includes(preselected) && <option>{preselected}</option>}
        </select>
      </div>

      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input id="name" name="name" type="text" placeholder="Your name" required />
      </div>

      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" placeholder="you@email.com" required />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input id="phone" name="phone" type="tel" placeholder="04xx xxx xxx" required />
      </div>

      <div className="field">
        <label htmlFor="preferredDate">Preferred Date</label>
        <input id="preferredDate" name="preferredDate" type="date" min={today} />
      </div>

      <div className="field">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" placeholder="Anything we should know? (optional)" />
      </div>

      <SubmitButton />

      {state.status === "error" && (
        <p style={{ color: "#ff6b6b", marginTop: 16, textAlign: "center" }}>{state.message}</p>
      )}
    </form>
  )
}
