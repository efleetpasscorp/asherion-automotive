import Link from "next/link"

export function CtaBand() {
  return (
    <section className="section-sm">
      <div className="container">
        <div className="cta-band">
          <h2 className="h-lg text-balance">
            Take Comfort On The Road, Test Drive Your Car Today!
          </h2>
          <p>For Further Info &amp; Support, Contact Us.</p>
          <Link href="/contact" className="btn btn-light">
            Book a Test Drive
          </Link>
        </div>
      </div>
    </section>
  )
}
