"use client"

import { useState } from "react"

export function ContactForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.currentTarget.reset()
    setSent(true)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3 className="h-md" style={{ marginBottom: 6 }}>
        How can we help you?
      </h3>
      <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.92rem" }}>
        Fill out the form and we&apos;ll contact you shortly.
      </p>
      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input id="name" type="text" placeholder="Your name" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" placeholder="you@email.com" required />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input id="phone" type="tel" placeholder="04xx xxx xxx" />
      </div>
      <div className="field">
        <label htmlFor="interest">Interested In</label>
        <select id="interest" defaultValue="Buying a car">
          <option>Buying a car</option>
          <option>Renting a car</option>
          <option>Booking a test drive</option>
          <option>General enquiry</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" placeholder="Tell us what you're looking for..." />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
        Submit
      </button>
      {sent && (
        <p style={{ color: "#4ade80", marginTop: 16, textAlign: "center" }}>
          Thanks! We&apos;ll contact you shortly.
        </p>
      )}
    </form>
  )
}
