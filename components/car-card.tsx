import Link from "next/link"
import type { RentalCar, SaleCar } from "@/lib/cars"
import { CheckoutButton } from "./checkout-button"
import { DoorIcon, EngineIcon, GearIcon, LuggageIcon, SeatIcon, SparkleIcon } from "./icons"

// A covered "surprise" card for vehicles that aren't available yet. The car cover
// is shown by default and the real vehicle is revealed on hover/focus.
function ComingSoonCard({ car }: { car: SaleCar | RentalCar }) {
  const wishHref = `/wish?vehicle=${encodeURIComponent(car.name)}`
  return (
    <article className="card card-coming-soon">
      <Link href={wishHref} className="car-media car-media-reveal" aria-label={`Make a wish order for ${car.name}`}>
        <span className="tag tag-soon">Coming Soon</span>
        <img className="reveal-cover" src="/images/covered-car.png" alt="" aria-hidden="true" />
        <img className="reveal-real" src={car.image || "/placeholder.svg"} alt={car.name} />
        <span className="reveal-hint">Hover to peek</span>
      </Link>
      <div className="car-body">
        <h3>{car.name}</h3>
        <div className="car-price car-price-soon">{car.price}</div>
        <p className="car-soon-text">Arriving at Asherion Automotive soon. Be first in line.</p>
        <div className="car-actions">
          <Link href={wishHref} className="btn btn-primary">
            <SparkleIcon />
            Make a Wish Order
          </Link>
        </div>
      </div>
    </article>
  )
}

export function SaleCarCard({ car, tag = "For Sale" }: { car: SaleCar; tag?: string }) {
  if (car.status === "coming-soon") return <ComingSoonCard car={car} />
  return (
    <article className="card">
      <Link href={`/stock/${car.id}`} className="car-media" aria-label={`View details for ${car.name}`}>
        <span className="tag">{tag}</span>
        <img src={car.image || "/placeholder.svg"} alt={car.name} />
      </Link>
      <div className="car-body">
        <h3>
          <Link href={`/stock/${car.id}`} className="car-title-link">
            {car.name}
          </Link>
        </h3>
        <div className="car-price">{car.price}</div>
        <div className="car-specs">
          <div className="spec">
            <GearIcon />
            {car.trans}
          </div>
          <div className="spec">
            <EngineIcon />
            {car.engine}
          </div>
          <div className="spec">
            <DoorIcon />
            {car.doors}
          </div>
          <div className="spec">
            <SeatIcon />
            {car.seats}
          </div>
        </div>
        <div className="car-actions">
          <Link href={`/stock/${car.id}`} className="btn btn-ghost">
            View Details
          </Link>
          <CheckoutButton carId={car.id} label="Buy Now & Pay" />
        </div>
      </div>
    </article>
  )
}

export function RentalCarCard({ car, tag = "Rental" }: { car: RentalCar; tag?: string }) {
  if (car.status === "coming-soon") return <ComingSoonCard car={car} />
  return (
    <article className="card">
      <Link href={`/stock/${car.id}`} className="car-media" aria-label={`View details for ${car.name}`}>
        <span className="tag">{tag}</span>
        <img src={car.image || "/placeholder.svg"} alt={car.name} />
      </Link>
      <div className="car-body">
        <h3>
          <Link href={`/stock/${car.id}`} className="car-title-link">
            {car.name}
          </Link>
        </h3>
        <div className="car-price">{car.price}</div>
        <div className="car-specs">
          <div className="spec">
            <GearIcon />
            {car.trans}
          </div>
          <div className="spec">
            <SeatIcon />
            {car.seats}
          </div>
          <div className="spec">
            <LuggageIcon />
            {car.bags}
          </div>
        </div>
        <div className="car-actions">
          <Link href={`/stock/${car.id}`} className="btn btn-ghost">
            View Details
          </Link>
          <CheckoutButton carId={car.id} label="Book Now & Pay" />
        </div>
      </div>
    </article>
  )
}
