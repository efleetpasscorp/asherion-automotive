import "server-only"
import { list, put } from "@vercel/blob"
import {
  defaultRentalCars,
  defaultSaleCars,
  type AnyCar,
  type RentalCar,
  type SaleCar,
} from "./cars"

const CATALOG_PATH = "site-config/catalog.json"

export type Catalog = { sales: SaleCar[]; rentals: RentalCar[] }

function seed(): Catalog {
  return { sales: defaultSaleCars, rentals: defaultRentalCars }
}

// Read the current vehicle catalog from Blob, falling back to the seed defaults.
export async function getCatalog(): Promise<Catalog> {
  try {
    const { blobs } = await list({ prefix: CATALOG_PATH })
    const found = blobs.find((b) => b.pathname === CATALOG_PATH)
    if (!found) return seed()
    const res = await fetch(found.url, { cache: "no-store" })
    if (!res.ok) return seed()
    const data = (await res.json()) as Partial<Catalog>
    return {
      sales: Array.isArray(data.sales) ? data.sales : defaultSaleCars,
      rentals: Array.isArray(data.rentals) ? data.rentals : defaultRentalCars,
    }
  } catch (error) {
    console.error("[v0] Failed to read catalog:", error)
    return seed()
  }
}

export async function saveCatalog(catalog: Catalog): Promise<void> {
  await put(CATALOG_PATH, JSON.stringify(catalog, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function getVehicleById(id: string): Promise<AnyCar | undefined> {
  const c = await getCatalog()
  return [...c.rentals, ...c.sales].find((v) => v.id === id)
}

// Insert or update a single vehicle, routed to the correct list by `kind`.
export async function upsertVehicle(vehicle: AnyCar): Promise<void> {
  const catalog = await getCatalog()
  if (vehicle.kind === "rental") {
    const idx = catalog.rentals.findIndex((v) => v.id === vehicle.id)
    if (idx >= 0) catalog.rentals[idx] = vehicle
    else catalog.rentals.push(vehicle)
  } else {
    const idx = catalog.sales.findIndex((v) => v.id === vehicle.id)
    if (idx >= 0) catalog.sales[idx] = vehicle
    else catalog.sales.push(vehicle)
  }
  await saveCatalog(catalog)
}

export async function deleteVehicle(id: string): Promise<void> {
  const catalog = await getCatalog()
  catalog.sales = catalog.sales.filter((v) => v.id !== id)
  catalog.rentals = catalog.rentals.filter((v) => v.id !== id)
  await saveCatalog(catalog)
}
