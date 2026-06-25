"use client"

import { useActionState, useRef, useState } from "react"
import { uploadImageAction, type ActionState } from "./actions"

const initialState: ActionState = {}

type Slot = { key: string; label: string; currentImage: string }

export function ImageEditor({ slot }: { slot: Slot }) {
  const [state, formAction, pending] = useActionState(uploadImageAction, initialState)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <article className="card admin-slot">
      <div className="admin-slot-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview || slot.currentImage || "/placeholder.svg"} alt={slot.label} />
      </div>
      <div className="admin-slot-body">
        <h3>{slot.label}</h3>
        <form action={formAction} className="admin-slot-form">
          <input type="hidden" name="slot" value={slot.key} />
          <input
            ref={fileRef}
            type="file"
            name="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="admin-file"
            onChange={handleFileChange}
            required
          />
          {state.error ? (
            <p className="admin-msg admin-msg-error" role="alert">
              {state.error}
            </p>
          ) : null}
          {state.success ? (
            <p className="admin-msg admin-msg-success" role="status">
              {state.success}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Uploading…" : "Replace image"}
          </button>
        </form>
      </div>
    </article>
  )
}
