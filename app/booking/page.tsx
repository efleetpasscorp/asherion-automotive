import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingForm } from "@/components/booking-form"
import { TestDriveCta } from "@/components/test-drive-cta"
import { CalendarIcon, ClockIcon, ShieldIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Book a Vehicle — Asherion Automotive",
  description: "Reserve a rental or sale vehicle with Asherion Automotive. Quick, no-obligation booking requests.",
}

const perks = [
  {
    Icon: CalendarIcon,
    title: "Flexible scheduling",
    text: "Pick a date that suits you — we'll confirm availability and work around your plans.",
  },
  {
    Icon: ShieldIcon,
    title: "No obligation",
    text: "Submitting a request doesn't charge you. We confirm details and pricing before anything is final.",
  },
  {
    Icon: ClockIcon,
    title: "Fast response",
    text: "Our team typically replies the same business day to lock in your booking.",
  },
]

export default function BookingPage() {
  return (
    <>
      <SiteHeader />

      <section className="page-banner">
        <div className="container">
          <h1 className="h-xl">Book a Vehicle</h1>
          <p className="crumbs">
            <Link href="/">Home</Link> · <span className="text-red">Book a Vehicle</span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Reserve Your Car</span>
            <h2 className="h-lg text-balance">Tell us what you need</h2>
            <p className="lead" style={{ margin: "16px 0 32px" }}>
              Choose a vehicle, share a few details, and send your request. There&apos;s no payment
              required up front — we&apos;ll confirm availability and arrange the rest with you
              directly.
            </p>

            {perks.map(({ Icon, title, text }) => (
              <div className="info-item" key={title}>
                <div className="ic">
                  <Icon />
                </div>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <Suspense fallback={<div className="form" aria-busy="true" />}>
            <BookingForm />
          </Suspense>
        </div>

        <div className="container" style={{ marginTop: 48 }}>
          <TestDriveCta />
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
