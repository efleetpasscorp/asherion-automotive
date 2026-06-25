import Link from "next/link"
import { headers } from "next/headers"
import QRCode from "qrcode"

export async function TestDriveCta() {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000"
  const proto = h.get("x-forwarded-proto") || "https"
  const url = `${proto}://${host}/test-drive`
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 240,
    color: { dark: "#0f0f0f", light: "#ffffff" },
  })

  return (
    <div className="card td-cta">
      <div className="td-cta-copy">
        <span className="eyebrow">No paperwork</span>
        <h2 className="h-md">Book a Test Drive</h2>
        <p>
          Upload your licence, let our AI fill in the details, accept the disclaimer, and you&apos;re
          booked. Scan the code to do it all from your phone.
        </p>
        <Link href="/test-drive" className="btn btn-primary">
          Book Test Drive
        </Link>
      </div>
      <div className="td-cta-qr">
        <div className="qr-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl || "/placeholder.svg"} alt="QR code to book a test drive" />
        </div>
        <span className="qr-hint">Scan to start</span>
      </div>
    </div>
  )
}
