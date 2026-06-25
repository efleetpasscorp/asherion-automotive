export type SaleCar = {
  id: string
  kind: "sale"
  slot: string
  name: string
  price: string
  amountCents: number
  trans: string
  engine: string
  doors: string
  seats: string
  image: string
}

export type RentalCar = {
  id: string
  kind: "rental"
  slot: string
  name: string
  price: string
  amountCents: number
  image: string
}

export type AnyCar = SaleCar | RentalCar

// Distinct, human-friendly vehicle options for the booking dropdown (client-safe).
export const bookingVehicles = [
  "Luxury Sedan (Rental)",
  "Mazda 3 BK (For Sale)",
  "Mazda 2 Neo (For Sale)",
  "Not sure yet — help me choose",
]

// Editable stock image slots, surfaced in the admin panel.
export type ImageSlot = {
  key: string
  label: string
  defaultImage: string
}

export const imageSlots: ImageSlot[] = [
  { key: "luxury-sedan", label: "Luxury Sedan (Rental)", defaultImage: "/images/luxury-sedan.png" },
  { key: "mazda-3", label: "Mazda 3 BK (For Sale)", defaultImage: "/images/mazda-3.png" },
  { key: "mazda-2", label: "Mazda 2 Neo (For Sale)", defaultImage: "/images/mazda-2.png" },
]

export const rentalCars: RentalCar[] = Array.from({ length: 6 }, (_, i) => ({
  id: `rental-${i + 1}`,
  kind: "rental" as const,
  slot: "luxury-sedan",
  name: "Luxury Sedan",
  price: "From $129 / day",
  amountCents: 12900,
  image: "/images/luxury-sedan.png",
}))

const saleTemplates: Array<Omit<SaleCar, "id">> = [
  {
    kind: "sale",
    slot: "mazda-3",
    name: "Mazda 3 BK",
    price: "$14,990",
    amountCents: 1499000,
    trans: "Manual",
    engine: "2.0L",
    doors: "4 Doors",
    seats: "5 Seats",
    image: "/images/mazda-3.png",
  },
  {
    kind: "sale",
    slot: "mazda-2",
    name: "Mazda 2 Neo",
    price: "$11,490",
    amountCents: 1149000,
    trans: "Auto",
    engine: "1.5L",
    doors: "5 Doors",
    seats: "5 Seats",
    image: "/images/mazda-2.png",
  },
]

export const saleCars: SaleCar[] = Array.from({ length: 6 }, (_, i) => ({
  ...saleTemplates[i % saleTemplates.length],
  id: `sale-${i + 1}`,
}))

// Server-side lookup so checkout amounts can never be tampered with from the client.
export function getCarById(id: string): AnyCar | undefined {
  return [...rentalCars, ...saleCars].find((c) => c.id === id)
}
