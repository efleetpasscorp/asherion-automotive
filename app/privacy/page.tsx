import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Privacy Policy — Asherion Automotive",
  description:
    "How Asherion Automotive collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <section className="page-banner">
        <div className="container">
          <h1 className="h-xl">Privacy Policy</h1>
          <p className="crumbs">
            <Link href="/">Home</Link> · <span className="text-red">Privacy Policy</span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="legal">
            <p className="legal-meta">Last updated: 20 June 2026</p>

            <p>
              Asherion Automotive (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is
              committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website or use our
              services, in accordance with the Australian Privacy Principles (APPs) under the
              Privacy Act 1988 (Cth).
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when you make
              an enquiry, book or purchase a vehicle, or contact us. This may include your name,
              email address, phone number, billing details, and any other information you choose to
              share.
            </p>
            <p>
              We also automatically collect certain technical information when you visit our site,
              such as your IP address, browser type, device information, and pages viewed, through
              cookies and similar technologies.
            </p>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To process vehicle bookings, sales, and payments.</li>
              <li>To respond to your enquiries and provide customer support.</li>
              <li>To send you updates, confirmations, and service-related communications.</li>
              <li>To improve our website, products, and services.</li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>

            <h2>3. Payments</h2>
            <p>
              Payments are processed securely through Square. We do not store your full card
              details on our servers. Your payment information is handled by Square in accordance
              with their privacy and security standards.
            </p>

            <h2>4. Disclosure of Information</h2>
            <p>
              We do not sell your personal information. We may share it with trusted third-party
              service providers (such as payment processors and IT providers) who assist us in
              operating our business, and where required by law.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We take reasonable steps to protect your personal information from misuse,
              interference, loss, and unauthorised access or disclosure. However, no method of
              transmission over the internet is completely secure.
            </p>

            <h2>6. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. You can set your
              browser to refuse cookies, although some parts of the site may not function properly
              as a result.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              You have the right to request access to, and correction of, the personal information
              we hold about you. To make such a request, please contact us using the details below.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with an updated revision date.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@asherionauto.com.au">hello@asherionauto.com.au</a> or call{" "}
              (03) 1234 5678.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
