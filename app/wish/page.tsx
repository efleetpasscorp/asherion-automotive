import type { Metadata } from "next"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WishForm } from "@/components/wish-form"
import { CheckIcon, SparkleIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Make a Wish Order — Asherion Automotive",
  description:
    "Can't find your dream car on our floor? Tell us what you want and we'll source it for you. Make a wish order with Asherion Automotive.",
}

const points = [
  "We tap our dealer network and auctions to find your exact match",
  "Transparent pricing with no surprise fees",
  "Full inspection and history check before you commit",
  "No obligation — we only present cars that fit your brief",
]

export default function WishPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Wish Order</span>
            <h1 className="h-xl text-balance">Make a Wish Order</h1>
            <nav className="crumbs" aria-label="Breadcrumb">
              <span>Home</span> <span aria-hidden="true">/</span> <span>Wish Order</span>
            </nav>
          </div>
        </section>

        <section className="section">
          <div className="container td-layout">
            <aside className="td-aside">
              <div className="wish-hero-media">
                <span className="tag">Coming Soon</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/covered-car.png" alt="A mystery car waiting to be revealed under a cover" />
              </div>

              <h2 className="h-md" style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 10 }}>
                <SparkleIcon />
                Your dream car, sourced for you
              </h2>
              <p style={{ color: "var(--muted)", marginTop: 8, lineHeight: 1.7 }}>
                Tell us the make, model, and budget you have in mind. Our team does the hunting and
                brings the surprise to your driveway.
              </p>

              <ul className="wish-points">
                {points.map((p) => (
                  <li key={p}>
                    <CheckIcon />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="td-form-col">
              <Suspense fallback={<div className="form">Loading form...</div>}>
                <WishForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
