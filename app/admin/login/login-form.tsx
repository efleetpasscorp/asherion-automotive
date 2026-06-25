"use client"

import { useActionState } from "react"
import { loginAction, type ActionState } from "../actions"

const initialState: ActionState = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="admin-form" noValidate>
      <label htmlFor="password" className="admin-label">
        Admin password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        className="admin-input"
        placeholder="Enter password"
        required
      />
      {state.error ? (
        <p className="admin-msg admin-msg-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  )
}
