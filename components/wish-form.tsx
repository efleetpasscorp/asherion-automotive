"use client"

import { useActionState, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import { submitWish, type WishFormState } from "@/app/wish/actions"
import { CheckIcon } from "./icons"

const initialState: WishFormState = { status: "idle" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={pending}>
      {pending ? "Sending your wish..." : "Submit Wish Order"}
    </button>
  )
}

export function WishForm() {
  const params = useSearchParams()
  const preselected = params.get("vehicle") ?? ""
  const [state, formAction] = useActionState(submitWish, initialState)
  const [make, setMake] = useState("")

  // Pre-fill the make field from a coming-soon vehicle name (e.g. "Make Model").
  useEffect(() => {
    if (preselected) setMake(preselected)
  }, [preselected])

  if (state.status === "success") {
    return (
      <div className="form booking-success">
        <span className="success-icon" aria-hidden="true">
          <CheckIcon />
        </span>
        <h3 className="h-md">Wish order received</h3>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>{state.message}</p>
      </div>
    )
  }

  return (
    <form className="form" action={formAction}>
      <h3 className="h-md" style={{ marginBottom: 6 }}>
        Make a wish order
      </h3>
      <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.92rem" }}>
        Can&apos;t find it on our floor? Tell us your dream car and we&apos;ll source it for you.
      </p>

      <div className="field">
        <label htmlFor="make">Make / Vehicle</label>
        <input
          id="make"
          name="make"
          type="text"
          placeholder="e.g. Toyota, BMW, or a full model name"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          required
        />
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="model">Model</label>
          <input id="model" name="model" type="text" placeholder="e.g. Corolla, M3" />
        </div>
        <div className="field">
          <label htmlFor="year">Year / Range</label>
          <input id="year" name="year" type="text" placeholder="e.g. 2022+" />
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="budget">Budget</label>
          <input id="budget" name="budget" type="text" placeholder="e.g. $30,000 - $40,000" />
        </div>
        <div className="field">
          <label htmlFor="color">Preferred Colour</label>
          <input id="color" name="color" type="text" placeholder="e.g. White, any" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input id="name" name="name" type="text" placeholder="Your name" required />
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="you@email.com" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" placeholder="04xx xxx xxx" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="notes">Anything else?</label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Trim, features, must-haves, deal-breakers... (optional)"
        />
      </div>

      <SubmitButton />

      {state.status === "error" && (
        <p style={{ color: "#ff6b6b", marginTop: 16, textAlign: "center" }}>{state.message}</p>
      )}
    </form>
  )
}
