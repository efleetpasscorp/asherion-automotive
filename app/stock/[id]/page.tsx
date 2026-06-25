import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CtaBand } from "@/components/cta-band"
import { CheckoutButton } from "@/components/checkout-button"
import { SaleCarCard, RentalCarCard } from "@/components/car-card"
import { CheckIcon, DoorIcon, EngineIcon, GearIcon, SeatIcon, ShieldIcon, SparkleIcon } from "@/components/icons"
import { getCatalog, getVehicleById } from "@/lib/catalog"

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const car = await getVehicleById(id)
  if (!car) return { title: "Vehicle Not Found — Asherion Automotive" }
  return {
    title: `${car.name} — ${car.price} | Asherion Automotive`,
    description:
      car.kind === "sale"
        ? `${car.year} ${car.name} for sale at ${car.price}. ${car.odometer}, ${car.fuel}, ${car.trans}. Quality cars, transparent pricing.`
        : `Rent the ${car.name} — ${car.price}. ${car.seats}, ${car.trans}. Book online with Asherion Automotive.`,
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params
  const car = await getVehicleById(id)
  if (!car) notFound()

  const isSale = car.kind === "sale"
  const isComingSoon = car.status === "coming-soon"
  const buyLabel = isSale ? "Buy Now & Pay" : "Book Now & Pay"

  // Specs differ by vehicle type.
  const specs: Array<{ label: string; value: string }> = isSale
    ? [
        { label: "Year", value: car.year },
        { label: "Odometer", value: car.odometer },
        { label: "Transmission", value: car.trans },
        { label: "Engine", value: car.engine },
        { label: "Body", value: car.body },
        { label: "Fuel", value: car.fuel },
        { label: "Drivetrain", value: car.drivetrain },
        { label: "Colour", value: car.color },
        { label: "Doors", value: car.doors },
        { label: "Seats", value: car.seats },
        { label: "Registration", value: car.rego },
      ]
    : [
        { label: "Transmission", value: car.trans },
        { label: "Seats", value: car.seats },
        { label: "Doors", value: car.doors },
        { label: "Fuel", value: car.fuel },
        { label: "Luggage", value: car.bags },
        { label: "Deposit", value: car.deposit },
      ]

  // Suggest a few other available vehicles, excluding the current one.
  const catalog = await getCatalog()
  const pool = isSale ? catalog.sales : catalog.rentals
  const related = pool
    .filter((c) => c.id !== car.id && c.status === "available")
    .slice(0, 3)

  return (
    <>
      <SiteHeader />

      <section className="page-banner">
        <div className="container">
          <h1 className="h-xl">{car.name}</h1>
          <p className="crumbs">
            <Link href="/">Home</Link> · <Link href="/stock">Our Stock</Link> ·{" "}
            <span className="text-red">{car.name}</span>
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="vehicle-detail">
            {/* Left: media + narrative */}
            <div className="vehicle-main">
              <div className="vehicle-media">
                <span className={isComingSoon ? "tag tag-soon" : "tag"}>
                  {isComingSoon ? "Coming Soon" : isSale ? "For Sale" : "Rental"}
                </span>
                <img src={car.image || "/placeholder.svg"} alt={car.name} />
              </div>

              <div className="vehicle-block">
                <span className="eyebrow">Overview</span>
                <h2 className="h-md">About this vehicle</h2>
                <p className="vehicle-desc">{car.description}</p>
              </div>

              <div className="vehicle-block">
                <h2 className="h-md">Features &amp; equipment</h2>
                <ul className="feature-list">
                  {car.features.map((f) => (
                    <li key={f}>
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="vehicle-block">
                <h2 className="h-md">Specifications</h2>
                <dl className="spec-table">
                  {specs.map((s) => (
                    <div className="spec-row" key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right: sticky purchase panel */}
            <aside className="vehicle-aside">
              <div className="purchase-card">
                <span className="purchase-tag">{isSale ? "Drive-away price" : "Rental rate"}</span>
                <div className="purchase-price">{car.price}</div>

                <ul className="purchase-specs">
                  <li>
                    <GearIcon />
                    {car.trans}
                  </li>
                  {isSale ? (
                    <li>
                      <EngineIcon />
                      {car.engine}
                    </li>
                  ) : null}
                  <li>
                    <DoorIcon />
                    {car.doors}
                  </li>
                  <li>
                    <SeatIcon />
                    {car.seats}
                  </li>
                </ul>

                {isComingSoon ? (
                  <Link
                    href={`/wish?vehicle=${encodeURIComponent(car.name)}`}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    <SparkleIcon />
                    Make a Wish Order
                  </Link>
                ) : (
                  <CheckoutButton carId={car.id} label={buyLabel} />
                )}

                <div className="purchase-actions">
                  {!isComingSoon && (
                    <Link href="/test-drive" className="btn btn-ghost">
                      Book a Test Drive
                    </Link>
                  )}
                  <Link href="/contact" className="btn btn-ghost">
                    Enquire
                  </Link>
                </div>

                <p className="purchase-assure">
                  <ShieldIcon />
                  Transparent pricing · No hidden fees
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-sm">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Keep looking</span>
                <h2 className="h-lg">You might also like</h2>
              </div>
              <Link href="/stock" className="btn btn-ghost">
                View all stock
              </Link>
            </div>
            <div className="grid grid-3">
              {related.map((c) =>
                c.kind === "sale" ? (
                  <SaleCarCard key={c.id} car={c} />
                ) : (
                  <RentalCarCard key={c.id} car={c} />
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
      <SiteFooter />
    </>
  )
}
