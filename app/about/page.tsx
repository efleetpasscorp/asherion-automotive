import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CtaBand } from "@/components/cta-band"
import { BoltIcon, ShieldIcon, StarIcon, TargetIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "About Us — Asherion Automotive",
  description: "Your trusted partner in reliable car sales. Learn about Asherion Automotive.",
}

const values = [
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

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <section className="page-banner">
        <div className="container">
          <h1 className="h-xl">About Us</h1>
          <p className="crumbs">
            <Link href="/">Home</Link> · <span className="text-red">About Us</span>
          </p>
        </div>
      </section>

      <section className="section">
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
              Asherion Automotive began with a simple idea: buying or renting a car should be
              straightforward, honest, and genuinely enjoyable. Over 15 years we&apos;ve grown into
              one of Melbourne&apos;s most trusted independent dealerships.
            </p>
            <p className="lead" style={{ marginTop: 14 }}>
              We hand-pick every vehicle, inspect it thoroughly, and stand behind it. No hidden fees,
              no pressure — just quality cars and a team that treats you the way we&apos;d want to be
              treated.
            </p>
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

      <section className="section-sm">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our Service</span>
              <h2 className="h-lg">What we stand for</h2>
            </div>
          </div>
          <div className="grid grid-4">
            {values.map(({ Icon, title, desc }) => (
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

      <CtaBand />
      <SiteFooter />
    </>
  )
}
