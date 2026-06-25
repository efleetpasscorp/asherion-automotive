import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getEnrollmentSecret, isAuthed, isMfaPending } from "@/lib/auth"
import { qrDataUrl } from "@/lib/mfa"
import { LoginForm } from "./login-form"
import { MfaForm } from "./mfa-form"

export const metadata: Metadata = {
  title: "Admin Login — Asherion Automotive",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin")

  const pending = await isMfaPending()

  // Step 2: the password was accepted — collect the authenticator code.
  if (pending) {
    const enrollSecret = await getEnrollmentSecret()
    const enrolling = Boolean(enrollSecret)
    const qr = enrollSecret ? await qrDataUrl(enrollSecret) : null
    const manualKey = enrollSecret

    return (
      <main className="admin-auth">
        <div className="admin-card">
          <span className="eyebrow">Asherion Automotive</span>
          <h1 className="h-lg">{enrolling ? "Set up two-factor" : "Two-factor verification"}</h1>
          <p className="admin-sub">
            {enrolling
              ? "Scan this QR code with Google Authenticator, then enter the 6-digit code it shows to finish setup."
              : "Enter the 6-digit code from your Google Authenticator app to continue."}
          </p>
          {enrolling && qr ? (
            <div className="mfa-enroll">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr || "/placeholder.svg"} alt="Google Authenticator setup QR code" className="mfa-qr" />
              <p className="mfa-manual">
                Can&apos;t scan? Enter this key manually:
                <code>{manualKey}</code>
              </p>
            </div>
          ) : null}
          <MfaForm enrolling={enrolling} />
          <Link href="/" className="admin-back">
            ← Back to site
          </Link>
        </div>
      </main>
    )
  }

  // Step 1: password.
  return (
    <main className="admin-auth">
      <div className="admin-card">
        <span className="eyebrow">Asherion Automotive</span>
        <h1 className="h-lg">Admin Login</h1>
        <p className="admin-sub">Sign in to manage the vehicles shown across the site.</p>
        <LoginForm />
        <Link href="/" className="admin-back">
          ← Back to site
        </Link>
      </div>
    </main>
  )
}
