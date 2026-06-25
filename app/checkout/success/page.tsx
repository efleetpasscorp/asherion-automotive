import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CheckIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Payment Successful — Asherion Automotive",
  description: "Your payment has been received.",
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string }>
}) {
  const { vehicle } = await searchParams

  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="container">
          <div className="success-card">
            <span className="success-icon" aria-hidden="true">
              <CheckIcon />
            </span>
            <h1 className="h-lg">Payment successful</h1>
            <p className="success-sub">
              {vehicle
                ? `Thanks for your order. Your payment for the ${vehicle} has been received.`
                : "Thanks for your order. Your payment has been received."}
            </p>
            <p className="success-note">
              A confirmation has been sent to your email via Square. Our team will be in touch shortly to arrange
              handover or pickup details.
            </p>
            <div className="success-actions">
              <Link href="/stock" className="btn btn-primary">
                Back to stock
              </Link>
              <Link href="/" className="btn btn-ghost">
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
