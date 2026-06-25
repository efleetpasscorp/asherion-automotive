import { StarIcon } from "./icons"

type Review = {
  name: string
  handle: string
  source: "instagram" | "facebook"
  rating: number
  quote: string
}

const reviews: Review[] = [
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

export function Testimonials() {
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
              href="https://instagram.com/asherionautomotive"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="See more reviews on Instagram"
            >
              <img src="/icons/instagram.svg" alt="" width={22} height={22} />
            </a>
            <a
              href="https://facebook.com/asherionautomotive"
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
          {reviews.map((r) => (
            <figure className="card review-card" key={r.name}>
              <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <StarIcon key={i} className="review-star" />
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
      </div>
    </section>
  )
}
