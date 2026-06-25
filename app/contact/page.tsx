import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Contact Us — Asherion Automotive",
  description: "Get in touch with Asherion Automotive. Book a test drive today.",
}

const info = [
  { Icon: PhoneIcon, title: "Call Us Now!", text: "(03) 1234 5678" },
  { Icon: MailIcon, title: "Email", text: "hello@asherionauto.com.au" },
  { Icon: PinIcon, title: "Visit Us", text: "123 Motorway Drive, Melbourne VIC 3000" },
  { Icon: ClockIcon, title: "Opening Hours", text: "Mon–Sat: 9am – 6pm · Sun: Closed" },
]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <section className="page-banner">
        <div className="container">
          <h1 className="h-xl">Contact Us</h1>
          <p className="crumbs">
            <Link href="/">Home</Link> · <span className="text-red">Contact Us</span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Get In Touch</span>
            <h2 className="h-lg">We&apos;ll contact you shortly</h2>
            <p className="lead" style={{ margin: "16px 0 32px" }}>
              Have a question about a vehicle, want to book a test drive, or need a hand with finance?
              Send us a message and our team will get back to you the same business day.
            </p>

            {info.map(({ Icon, title, text }) => (
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

          <ContactForm />
        </div>
      </section>

      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            className="map-ph ph"
            data-label="Map — 123 Motorway Drive, Melbourne VIC"
            role="img"
            aria-label="Map showing 123 Motorway Drive, Melbourne VIC"
          />
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
