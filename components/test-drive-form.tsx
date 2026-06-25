"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import { submitTestDrive, type TestDriveFormState } from "@/app/test-drive/actions"
import { bookingVehicles } from "@/lib/cars"
import { CheckIcon } from "./icons"

const initialState: TestDriveFormState = { status: "idle" }

type ScanState = "idle" | "scanning" | "done" | "error"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={pending}>
      {pending ? "Submitting..." : "Submit Test Drive Request"}
    </button>
  )
}

export function TestDriveForm() {
  const params = useSearchParams()
  const preselected = params.get("vehicle") ?? ""
  const [state, formAction] = useActionState(submitTestDrive, initialState)

  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [scan, setScan] = useState<ScanState>("idle")
  const [scanMsg, setScanMsg] = useState<string>("")

  const [vehicle, setVehicle] = useState(preselected || bookingVehicles[0])
  const [name, setName] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [licenseExpiry, setLicenseExpiry] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")

  useEffect(() => {
    if (preselected) setVehicle(preselected)
  }, [preselected])

  const today = new Date().toISOString().split("T")[0]

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setScan("idle")
    setScanMsg("")
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  async function scanLicense() {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setScan("error")
      setScanMsg("Please choose a licence photo first.")
      return
    }
    setScan("scanning")
    setScanMsg("Reading your licence...")
    try {
      const body = new FormData()
      body.append("file", file)
      const res = await fetch("/api/scan-license", { method: "POST", body })
      const json = await res.json()
      if (!res.ok) {
        setScan("error")
        setScanMsg(json.error || "Could not scan the licence.")
        return
      }
      const d = json.data
      if (d.fullName) setName(d.fullName)
      if (d.licenseNumber) setLicenseNumber(d.licenseNumber)
      if (d.expiryDate) setLicenseExpiry(d.expiryDate)
      if (d.dateOfBirth) setDateOfBirth(d.dateOfBirth)
      setScan("done")
      setScanMsg("Licence scanned. Please double-check the details below.")
    } catch {
      setScan("error")
      setScanMsg("Could not scan the licence. You can still fill in the form manually.")
    }
  }

  if (state.status === "success") {
    return (
      <div className="form booking-success">
        <span className="success-icon" aria-hidden="true">
          <CheckIcon />
        </span>
        <h3 className="h-md">Test drive request received</h3>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>{state.message}</p>
      </div>
    )
  }

  return (
    <form className="form" action={formAction}>
      <h3 className="h-md" style={{ marginBottom: 6 }}>
        Book a test drive
      </h3>
      <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.92rem" }}>
        Upload your driver&apos;s licence and we&apos;ll scan it to fill in your details. Review,
        accept the disclaimer, and submit.
      </p>

      {/* License upload + scan */}
      <div className="field">
        <label htmlFor="license">Driver&apos;s Licence Photo</label>
        <input
          ref={fileRef}
          id="license"
          name="license"
          type="file"
          accept="image/*"
          capture="environment"
          className="admin-file"
          onChange={onFileChange}
          required
        />
      </div>

      {preview && (
        <div className="license-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview || "/placeholder.svg"} alt="Licence preview" />
        </div>
      )}

      <button
        type="button"
        className="btn btn-outline"
        style={{ width: "100%" }}
        onClick={scanLicense}
        disabled={scan === "scanning"}
      >
        {scan === "scanning" ? "Scanning licence..." : "Scan licence with AI"}
      </button>
      {scanMsg && (
        <p
          className={scan === "error" ? "scan-msg scan-msg-error" : "scan-msg scan-msg-ok"}
          role="status"
        >
          {scanMsg}
        </p>
      )}

      <div className="field" style={{ marginTop: 8 }}>
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
        <input
          id="name"
          name="name"
          type="text"
          placeholder="As shown on licence"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="licenseNumber">Licence Number</label>
          <input
            id="licenseNumber"
            name="licenseNumber"
            type="text"
            placeholder="Licence no."
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="licenseExpiry">Licence Expiry</label>
          <input
            id="licenseExpiry"
            name="licenseExpiry"
            type="date"
            value={licenseExpiry}
            onChange={(e) => setLicenseExpiry(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="preferredDate">Preferred Date</label>
          <input id="preferredDate" name="preferredDate" type="date" min={today} />
        </div>
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
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" placeholder="Anything we should know? (optional)" />
      </div>

      {/* Disclaimer */}
      <label className="disclaimer">
        <input type="checkbox" name="disclaimer" required />
        <span>
          I confirm I hold a current, valid driver&apos;s licence and the details above are correct.
          I consent to Asherion Automotive securely storing my licence for verification, and I accept
          that I am responsible for the vehicle during the test drive and agree to the test drive
          terms.
        </span>
      </label>

      <SubmitButton />

      {state.status === "error" && (
        <p style={{ color: "#ff6b6b", marginTop: 16, textAlign: "center" }}>{state.message}</p>
      )}
    </form>
  )
}
