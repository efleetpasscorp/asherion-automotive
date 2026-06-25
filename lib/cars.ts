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
  // Detail fields
  year: string
  odometer: string
  fuel: string
  body: string
  color: string
  drivetrain: string
  rego: string
  description: string
  features: string[]
}

export type RentalCar = {
  id: string
  kind: "rental"
  slot: string
  name: string
  price: string
  amountCents: number
  image: string
  // Detail fields
  trans: string
  seats: string
  doors: string
  fuel: string
  bags: string
  deposit: string
  description: string
  features: string[]
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

const rentalTemplate: Omit<RentalCar, "id"> = {
  kind: "rental",
  slot: "luxury-sedan",
  name: "Luxury Sedan",
  price: "From $129 / day",
  amountCents: 12900,
  image: "/images/luxury-sedan.png",
  trans: "Automatic",
  seats: "5 Seats",
  doors: "4 Doors",
  fuel: "Petrol",
  bags: "3 Bags",
  deposit: "$129 due today to reserve",
  description:
    "Travel in comfort and style with our flagship luxury sedan. Whether you need a refined ride for a business trip, a wedding, or a weekend away, this car delivers a smooth, quiet drive with premium leather seating, climate control, and the latest safety tech. Fully serviced, detailed, and ready to go.",
  features: [
    "Leather-appointed seating",
    "Dual-zone climate control",
    "Apple CarPlay & Android Auto",
    "Reversing camera & sensors",
    "Cruise control",
    "Bluetooth & USB connectivity",
    "Comprehensive insurance available",
    "24/7 roadside assistance",
  ],
}

export const rentalCars: RentalCar[] = Array.from({ length: 6 }, (_, i) => ({
  ...rentalTemplate,
  id: `rental-${i + 1}`,
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
    year: "2011",
    odometer: "98,500 km",
    fuel: "Petrol",
    body: "Sedan",
    color: "Crystal White",
    drivetrain: "Front-Wheel Drive",
    rego: "Registered until 09/2025",
    description:
      "A reliable and economical Mazda 3 BK that is perfect for first-car buyers, students, and daily commuters. This well-maintained sedan combines sharp handling with low running costs, and comes with a full service history. Known for their bulletproof reliability, the Mazda 3 is one of the smartest buys in its class.",
    features: [
      "Air conditioning",
      "Power windows & mirrors",
      "Alloy wheels",
      "Cruise control",
      "Bluetooth audio",
      "ABS & dual airbags",
      "Full service history",
      "Roadworthy certificate included",
    ],
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
    year: "2013",
    odometer: "76,200 km",
    fuel: "Petrol",
    body: "Hatchback",
    color: "Aluminium Silver",
    drivetrain: "Front-Wheel Drive",
    rego: "Registered until 11/2025",
    description:
      "The Mazda 2 Neo is the ultimate city runabout — nimble, fuel-efficient, and effortless to park. With its automatic transmission and compact footprint, it is ideal for navigating busy streets while keeping fuel bills low. A fantastic value hatchback that has been thoroughly inspected and detailed.",
    features: [
      "Automatic transmission",
      "Air conditioning",
      "Power steering",
      "Central locking",
      "Bluetooth & USB",
      "ABS & airbags",
      "Excellent fuel economy",
      "Roadworthy certificate included",
    ],
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
