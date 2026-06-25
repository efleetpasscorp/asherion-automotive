export type VehicleStatus = "available" | "coming-soon"

export type SaleCar = {
  id: string
  kind: "sale"
  status: VehicleStatus
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
  status: VehicleStatus
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

// Distinct, human-friendly vehicle options for the booking dropdown (client-safe fallback).
export const bookingVehicles = [
  "Luxury Sedan (Rental)",
  "Mazda 3 BK (For Sale)",
  "Mazda 2 Neo (For Sale)",
  "Not sure yet — help me choose",
]

// ---------------------------------------------------------------------------
// Default seed catalog. Stored in Blob on first edit; these are the fallbacks.
// Each vehicle is unique (no padding) and carries its own status + image.
// ---------------------------------------------------------------------------

export const defaultRentalCars: RentalCar[] = [
  {
    id: "rental-luxury-sedan",
    kind: "rental",
    status: "available",
    slot: "rental-luxury-sedan",
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
  },
  {
    id: "rental-premium-suv",
    kind: "rental",
    status: "coming-soon",
    slot: "rental-premium-suv",
    name: "Premium 7-Seat SUV",
    price: "Rates coming soon",
    amountCents: 18900,
    image: "/images/luxury-sedan.png",
    trans: "Automatic",
    seats: "7 Seats",
    doors: "5 Doors",
    fuel: "Hybrid",
    bags: "5 Bags",
    deposit: "Register your interest",
    description:
      "A spacious premium SUV is joining our rental fleet very soon. Perfect for family road trips and group getaways, with three rows of seating, generous luggage space, and efficient hybrid power. Register your interest and we'll let you know the moment it's available.",
    features: [
      "Seven-seat configuration",
      "Hybrid fuel efficiency",
      "Panoramic sunroof",
      "Tri-zone climate control",
      "Advanced driver assistance",
      "Apple CarPlay & Android Auto",
    ],
  },
]

export const defaultSaleCars: SaleCar[] = [
  {
    id: "sale-mazda-3",
    kind: "sale",
    status: "available",
    slot: "sale-mazda-3",
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
    id: "sale-mazda-2",
    kind: "sale",
    status: "available",
    slot: "sale-mazda-2",
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
  {
    id: "sale-next-arrival",
    kind: "sale",
    status: "coming-soon",
    slot: "sale-next-arrival",
    name: "Next Arrival — Sports Coupe",
    price: "Price coming soon",
    amountCents: 0,
    trans: "Auto",
    engine: "2.5L Turbo",
    doors: "2 Doors",
    seats: "4 Seats",
    image: "/images/hero-car.png",
    year: "2018",
    odometer: "Low kms",
    fuel: "Petrol",
    body: "Coupe",
    color: "To be revealed",
    drivetrain: "Rear-Wheel Drive",
    rego: "Arriving soon",
    description:
      "Something special is arriving at Asherion Automotive. A head-turning sports coupe is being prepared and detailed for sale. Register your interest or place a wish order and you'll be first to know when we pull back the cover.",
    features: [
      "Turbocharged performance",
      "Sports-tuned suspension",
      "Premium alloy wheels",
      "Full inspection & detail before sale",
    ],
  },
]
