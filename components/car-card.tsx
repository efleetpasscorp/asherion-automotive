import type { RentalCar, SaleCar } from "@/lib/cars"
import { CheckoutButton } from "./checkout-button"
import { DoorIcon, EngineIcon, GearIcon, LuggageIcon, SeatIcon } from "./icons"

export function SaleCarCard({ car, tag = "For Sale" }: { car: SaleCar; tag?: string }) {
  return (
    <article className="card">
      <div className="car-media">
        <span className="tag">{tag}</span>
        <img src={car.image || "/placeholder.svg"} alt={car.name} />
      </div>
      <div className="car-body">
        <h3>{car.name}</h3>
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
        <CheckoutButton carId={car.id} label="Buy Now & Pay" />
      </div>
    </article>
  )
}

export function RentalCarCard({ car, tag = "Rental" }: { car: RentalCar; tag?: string }) {
  return (
    <article className="card">
      <div className="car-media">
        <span className="tag">{tag}</span>
        <img src={car.image || "/placeholder.svg"} alt={car.name} />
      </div>
      <div className="car-body">
        <h3>{car.name}</h3>
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
        <CheckoutButton carId={car.id} label="Book Now & Pay" />
      </div>
    </article>
  )
}
