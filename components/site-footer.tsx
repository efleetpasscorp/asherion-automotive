import Link from "next/link"
import { Emblem } from "./icons"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <Link className="brand" href="/">
              <Emblem className="emblem" />
              <span className="word">
                <b style={{ color: "#fff" }}>ASHERION</b>
                <span>AUTOMOTIVE</span>
              </span>
            </Link>
            <p>
              Quality cars, transparent pricing, and a hassle-free buying
              experience. Your trusted partner in reliable car sales.
            </p>
            <div className="footer-social">
              <a
                href="https://instagram.com/asherionautomotive"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Follow Asherion Automotive on Instagram"
              >
                <img src="/icons/instagram.svg" alt="" width={22} height={22} />
              </a>
              <a
                href="https://facebook.com/asherionautomotive"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Follow Asherion Automotive on Facebook"
              >
                <img src="/icons/facebook.svg" alt="" width={22} height={22} />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/stock">Our Cars</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
          <div className="footer-col">
            <h4>Contact Info</h4>
            <p>123 Motorway Drive, Melbourne VIC</p>
            <p>(03) 1234 5678</p>
            <p>hello@asherionauto.com.au</p>
            <p>Mon–Sat: 9am – 6pm</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Asherion Automotive. All Rights Reserved.</span>
          <span>
            <Link href="/privacy">Privacy Policy</Link> ·{" "}
            <Link href="/terms">Terms of Service</Link> ·{" "}
            <Link href="/admin">Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
