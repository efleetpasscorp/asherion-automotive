"use client"

import { useState } from "react"

export function CheckoutButton({
  carId,
  label = "Book Now & Pay",
}: {
  carId: string
  label?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: carId }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error ?? "Checkout failed.")
      }

      // If embedded in an iframe (e.g. preview), open in a new tab; otherwise redirect.
      if (window.self !== window.top) {
        window.open(data.url, "_blank", "noopener,noreferrer")
      } else {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-wrap">
      <button type="button" className="btn btn-primary" onClick={startCheckout} disabled={loading} aria-busy={loading}>
        {loading ? "Starting checkout…" : label}
      </button>
      {error ? (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
