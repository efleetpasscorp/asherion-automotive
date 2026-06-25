import Link from "next/link"
import type { RentalCar, SaleCar } from "@/lib/cars"
import { CheckoutButton } from "./checkout-button"
import { DoorIcon, EngineIcon, GearIcon, LuggageIcon, SeatIcon } from "./icons"

export function SaleCarCard({ car, tag = "For Sale" }: { car: SaleCar; tag?: string }) {
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
            Gearbox: Auto
          </div>
          <div className="spec">
            <LuggageIcon />
            Luggage: 3 bags
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
