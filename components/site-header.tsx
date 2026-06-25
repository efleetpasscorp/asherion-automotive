"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Emblem } from "./icons"

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/stock", label: "Our Stock" },
  { href: "/booking", label: "Booking" },
  { href: "/test-drive", label: "Test Drive" },
  { href: "/contact", label: "Contact Us" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav">
          <Link className="brand" href="/" onClick={() => setOpen(false)}>
            <Emblem className="emblem" />
            <span className="word">
              <b>ASHERION</b>
              <span>AUTOMOTIVE</span>
            </span>
          </Link>
          <div className={`nav-links${open ? " open" : ""}`}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="nav-cta">
            <Link href="/booking" className="btn btn-primary">
              Book Now
            </Link>
            <button
              className="nav-toggle"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
