import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CtaBand } from "@/components/cta-band"
import { Testimonials } from "@/components/testimonials"
import { RentalCarCard, SaleCarCard } from "@/components/car-card"
import { rentalCars, saleCars } from "@/lib/cars"
import { applyOverrides, getImageOverrides } from "@/lib/image-store"
import { BoltIcon, CheckIcon, ShieldIcon, StarIcon, TargetIcon } from "@/components/icons"

const services = [
  {
    Icon: BoltIcon,
    title: "Performance",
    desc: "Every vehicle is road-tested and serviced so it drives as good as it looks.",
  },
  {
    Icon: TargetIcon,
    title: "Precision",
    desc: "Detailed inspections and honest condition reports on every car we list.",
  },
  {
    Icon: ShieldIcon,
    title: "Integrity",
    desc: "Transparent pricing with no hidden fees and no pressure to buy.",
  },
  {
    Icon: StarIcon,
    title: "Modern luxury",
    desc: "A curated range of well-kept vehicles to suit every budget and lifestyle.",
  },
]

const features = [
  {
    num: "01",
    title: "Explore Our Range",
    desc: "Browse our full collection of rental and for-sale vehicles online before you visit.",
  },
  {
    num: "02",
    title: "Offering Competitive Pricing",
    desc: "Fair, upfront rates and sale prices with flexible terms to match your needs.",
  },
  {
    num: "03",
    title: "Many Pickup Locations",
    desc: "Convenient collection points across Melbourne, with delivery available on request.",
  },
]

export default async function HomePage() {
  const overrides = await getImageOverrides()
  const rentals = applyOverrides(rentalCars, overrides)
  const sales = applyOverrides(saleCars, overrides)

  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="container">
          <h1 className="h-xl text-balance">
            <span className="outline-text">Explore The World</span> In A Car You&apos;ll Love
          </h1>
          <p className="lead">
            Quality cars, transparent pricing, and a hassle-free buying experience.
          </p>
          <div className="hero-actions">
            <Link href="/stock" className="btn btn-primary">
              Check out our range
            </Link>
            <Link href="/about" className="btn btn-ghost">
              Learn More
            </Link>
          </div>
          <div className="hero-visual">
            <img src="/images/hero-car.png" alt="Featured vehicle" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container split">
          <div className="split-media">
            <div className="ph">
              <img src="/images/showroom.png" alt="Asherion Automotive showroom" />
            </div>
            <div className="ph" style={{ marginTop: 32 }}>
              <img src="/images/team.png" alt="Our team" />
            </div>
          </div>
          <div>
            <span className="eyebrow">About Us</span>
            <h2 className="h-lg text-balance">Your Trusted Partner In Reliable Car Sales</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              For over 15 years, Asherion Automotive has helped Melbourne drivers find the right car
              without the guesswork. Every vehicle is hand-picked, fully inspected, and priced fairly
              so you can buy with complete confidence.
            </p>
            <div className="tick">
              <CheckIcon />
              <span>Hand-picked, fully inspected vehicles you can rely on.</span>
            </div>
            <div className="tick">
              <CheckIcon />
              <span>Transparent pricing with no hidden fees.</span>
            </div>
            <div className="stats">
              <div className="stat">
                <b>15+</b>
                <span>Years experience</span>
              </div>
              <div className="stat">
                <b>2,400+</b>
                <span>Cars delivered</span>
              </div>
              <div className="stat">
                <b>98%</b>
                <span>Happy customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="section-sm">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Collection</span>
              <h2 className="h-lg">Our rental car collection</h2>
            </div>
            <Link href="/stock" className="btn btn-ghost">
              View all vehicles
            </Link>
          </div>
          <div className="grid grid-3">
            <RentalCarCard car={rentals[0]} tag="Featured" />
            <RentalCarCard car={rentals[1]} />
            <RentalCarCard car={rentals[2]} />
          </div>
        </div>
      </section>

      {/* CARS WE SELL */}
      <section className="section" id="carsforsale">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our Stock</span>
              <h2 className="h-lg">Cars We Sell</h2>
            </div>
            <Link href="/stock" className="btn btn-ghost">
              View all vehicles
            </Link>
          </div>
          <div className="grid grid-3">
            {sales.map((car, i) => (
              <SaleCarCard key={i} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-sm">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our Service</span>
              <h2 className="h-lg">Why drive with Asherion</h2>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Call Us Now!
            </Link>
          </div>
          <div className="grid grid-4">
            {services.map(({ Icon, title, desc }) => (
              <div className="card service-card" key={title}>
                <div className="ic">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="section-sm">
        <div className="container split">
          <div>
            <span className="eyebrow">Rental Services</span>
            <h2 className="h-lg text-balance">Explore Our wide Range Of Rental Services</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              From compact city cars to spacious family vehicles, renting with Asherion is simple,
              affordable, and built around you. Here&apos;s how it works.
            </p>
          </div>
          <div>
            {features.map((f) => (
              <div className="feature-row" key={f.num}>
                <span className="num">{f.num}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <CtaBand />
      <SiteFooter />
    </>
  )
}
