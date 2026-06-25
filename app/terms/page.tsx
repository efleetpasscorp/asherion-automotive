import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Terms of Service — Asherion Automotive",
  description:
    "The terms and conditions governing your use of Asherion Automotive's website and services.",
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <section className="page-banner">
        <div className="container">
          <h1 className="h-xl">Terms of Service</h1>
          <p className="crumbs">
            <Link href="/">Home</Link> · <span className="text-red">Terms of Service</span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="legal">
            <p className="legal-meta">Last updated: 20 June 2026</p>

            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
              Asherion Automotive website and services. By using our website, booking, or purchasing
              a vehicle, you agree to be bound by these Terms.
            </p>

            <h2>1. Use of Our Website</h2>
            <p>
              You agree to use our website only for lawful purposes and in a manner that does not
              infringe the rights of, or restrict the use of, this website by any third party. You
              must not attempt to gain unauthorised access to any part of the site or its systems.
            </p>

            <h2>2. Vehicle Listings and Pricing</h2>
            <p>
              We make every effort to ensure that vehicle details, availability, and pricing are
              accurate. However, listings are provided for general information and may contain
              errors. All prices are in Australian Dollars (AUD) and are subject to change without
              notice. A listing does not constitute a binding offer.
            </p>

            <h2>3. Bookings and Purchases</h2>
            <p>
              When you book or purchase a vehicle, you agree to provide accurate and complete
              information. All bookings and sales are subject to availability and our acceptance.
              We reserve the right to refuse or cancel any order at our discretion.
            </p>

            <h2>4. Payments</h2>
            <p>
              Payments are processed securely via Square. By submitting a payment, you confirm that
              you are authorised to use the chosen payment method. Rental bookings may require a
              deposit or first-payment amount as indicated at checkout.
            </p>

            <h2>5. Cancellations and Refunds</h2>
            <p>
              Cancellation and refund eligibility depends on the type of transaction and applicable
              consumer law. Please contact us as soon as possible if you need to cancel or amend a
              booking. Refunds, where applicable, will be issued to the original payment method.
            </p>

            <h2>6. Consumer Guarantees</h2>
            <p>
              Nothing in these Terms excludes, restricts, or modifies any consumer rights you may
              have under the Australian Consumer Law that cannot lawfully be excluded.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Asherion Automotive is not liable for any
              indirect, incidental, or consequential loss arising from your use of our website or
              services.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design, is the
              property of Asherion Automotive and is protected by applicable intellectual property
              laws. You may not reproduce or distribute it without our written permission.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Victoria, Australia, and you submit to the
              non-exclusive jurisdiction of its courts.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For any questions about these Terms, please contact us at{" "}
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
