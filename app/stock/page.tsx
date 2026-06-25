import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CtaBand } from "@/components/cta-band"
import { RentalCarCard, SaleCarCard } from "@/components/car-card"
import { rentalCars, saleCars } from "@/lib/cars"
import { applyOverrides, getImageOverrides } from "@/lib/image-store"

export const metadata: Metadata = {
  title: "Our Stock — Asherion Automotive",
  description: "Browse the Asherion Automotive range. Quality cars, transparent pricing.",
}

export default async function StockPage() {
  const overrides = await getImageOverrides()
  const rentals = applyOverrides(rentalCars, overrides)
  const sales = applyOverrides(saleCars, overrides)

  return (
    <>
      <SiteHeader />

      <section className="page-banner">
        <div className="container">
          <h1 className="h-xl">Our Stock</h1>
          <p className="crumbs">
            <Link href="/">Home</Link> · <span className="text-red">Our Stock</span>
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Collection</span>
              <h2 className="h-lg">Our rental car collection</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {rentals.map((car, i) => (
              <RentalCarCard key={i} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">For Sale</span>
              <h2 className="h-lg">Cars We Sell</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {sales.map((car, i) => (
              <SaleCarCard key={i} car={car} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
      <SiteFooter />
    </>
  )
}
