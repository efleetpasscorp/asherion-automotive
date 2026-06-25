import { StarIcon } from "./icons"
import { getSocialSettings } from "@/lib/social-settings"
import { fetchFacebookReviews, type LiveReview } from "@/lib/meta-reviews"

// Fallback sample reviews shown until live Facebook reviews are connected (or if
// Meta blocks the request). Once a Page is connected in the admin portal, real
// recommendations replace these automatically.
const sampleReviews: LiveReview[] = [
  {
    name: "Jessica M.",
    handle: "@jess.drives",
    source: "instagram",
    rating: 5,
    quote:
      "Bought my Mazda 3 from Asherion and the whole process was effortless. No hidden fees, no pressure — just an honest team that delivered exactly what they promised.",
  },
  {
    name: "Daniel R.",
    handle: "Daniel Roberts",
    source: "facebook",
    rating: 5,
    quote:
      "Best car-buying experience I've had. The car was spotless, fully inspected, and paying online through their checkout was quick and secure. Highly recommend.",
  },
  {
    name: "Amira K.",
    handle: "@amira.k",
    source: "instagram",
    rating: 5,
    quote:
      "Rented a car for a weekend trip and it was immaculate. Pickup was easy and the staff genuinely care. I've already booked again!",
  },
]

export async function Testimonials() {
  const settings = await getSocialSettings()
  const live = await fetchFacebookReviews()
  const reviews = live.ok && live.reviews.length > 0 ? live.reviews : sampleReviews

  const instagramUrl = settings.instagramUrl || "https://instagram.com/asherionautomotive"
  const facebookUrl = settings.facebookUrl || "https://facebook.com/asherionautomotive"
  const isLive = live.ok && live.reviews.length > 0

  return (
    <section className="section-sm" id="reviews">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Customer Feedback</span>
            <h2 className="h-lg">What our customers say</h2>
          </div>
          <div className="reviews-socials">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="See more reviews on Instagram"
            >
              <img src="/icons/instagram.svg" alt="" width={22} height={22} />
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="See more reviews on Facebook"
            >
              <img src="/icons/facebook.svg" alt="" width={22} height={22} />
            </a>
          </div>
        </div>
        <div className="grid grid-3">
          {reviews.map((r, i) => (
            <figure className="card review-card" key={`${r.name}-${i}`}>
              <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, s) => (
                  <StarIcon key={s} className="review-star" />
                ))}
              </div>
              <blockquote className="review-quote">{r.quote}</blockquote>
              <figcaption className="review-author">
                <span className="review-source" aria-hidden="true">
                  <img
                    src={r.source === "instagram" ? "/icons/instagram.svg" : "/icons/facebook.svg"}
                    alt=""
                    width={20}
                    height={20}
                  />
                </span>
                <span>
                  <b>{r.name}</b>
                  <span className="review-handle">{r.handle}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        {isLive && <p className="reviews-live-note">Live reviews from our Facebook page.</p>}
      </div>
    </section>
  )
}
