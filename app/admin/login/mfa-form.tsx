"use client"

import { useActionState } from "react"
import { cancelMfaAction, verifyMfaAction, type ActionState } from "../actions"

const initialState: ActionState = {}

export function MfaForm({ enrolling }: { enrolling: boolean }) {
  const [state, formAction, pending] = useActionState(verifyMfaAction, initialState)

  return (
    <form action={formAction} className="admin-form" noValidate>
      <label htmlFor="code" className="admin-label">
        Authentication code
      </label>
      <input
        id="code"
        name="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        className="admin-input otp-input"
        placeholder="000000"
        autoFocus
        required
      />
      {state.error ? (
        <p className="admin-msg admin-msg-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Verifying…" : enrolling ? "Confirm & finish setup" : "Verify"}
      </button>
      <button type="submit" formAction={cancelMfaAction} className="btn btn-ghost mfa-cancel">
        Start over
      </button>
    </form>
  )
}
