import type { Metadata } from "next"
import { Suspense } from "react"
import { headers } from "next/headers"
import QRCode from "qrcode"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TestDriveForm } from "@/components/test-drive-form"
import { ShieldIcon, BoltIcon, CheckIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Book a Test Drive — Asherion Automotive",
  description:
    "Scan your driver's licence, complete the form, and book a test drive in minutes. Scan the QR code to start on your phone.",
}

async function getTestDriveUrl() {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000"
  const proto = h.get("x-forwarded-proto") || "https"
  return `${proto}://${host}/test-drive`
}

export default async function TestDrivePage() {
  const url = await getTestDriveUrl()
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    color: { dark: "#0f0f0f", light: "#ffffff" },
  })

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Test Drive</span>
            <h1 className="h-xl text-balance">Book Your Test Drive</h1>
            <nav className="crumbs" aria-label="Breadcrumb">
              <span>Home</span> <span aria-hidden="true">/</span> <span>Test Drive</span>
            </nav>
          </div>
        </section>

        <section className="section">
          <div className="container td-layout">
            {/* QR + how it works */}
            <aside className="td-aside">
              <div className="card qr-card">
                <h2 className="h-md">Scan to start on your phone</h2>
                <p>
                  Scan this QR code with your phone&apos;s camera to open this form, snap a photo of
                  your licence, and book your test drive on the spot.
                </p>
                <div className="qr-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl || "/placeholder.svg"} alt="QR code to open the test drive booking form" />
                </div>
                <span className="qr-hint">Point your camera here</span>
              </div>

              <ul className="td-steps">
                <li>
                  <span className="td-step-ic" aria-hidden="true">
                    <BoltIcon />
                  </span>
                  <div>
                    <b>1. Upload your licence</b>
                    <p>Take or upload a clear photo of your driver&apos;s licence.</p>
                  </div>
                </li>
                <li>
                  <span className="td-step-ic" aria-hidden="true">
                    <CheckIcon />
                  </span>
                  <div>
                    <b>2. We scan it for you</b>
                    <p>AI reads your details and fills in the form automatically.</p>
                  </div>
                </li>
                <li>
                  <span className="td-step-ic" aria-hidden="true">
                    <ShieldIcon />
                  </span>
                  <div>
                    <b>3. Accept &amp; submit</b>
                    <p>Confirm the disclaimer and send your request securely.</p>
                  </div>
                </li>
              </ul>
            </aside>

            {/* Form */}
            <div className="td-form-col">
              <Suspense fallback={<div className="form">Loading form...</div>}>
                <TestDriveForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
