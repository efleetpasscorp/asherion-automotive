import "server-only"
import { put, list } from "@vercel/blob"

export type BookingRequest = {
  id: string
  vehicle: string
  name: string
  email: string
  phone: string
  preferredDate: string
  notes: string
  createdAt: string
}

const PREFIX = "bookings/"

export async function saveBooking(
  data: Omit<BookingRequest, "id" | "createdAt">,
): Promise<BookingRequest> {
  const booking: BookingRequest = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await put(`${PREFIX}${booking.id}.json`, JSON.stringify(booking, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  })
  return booking
}

export async function listBookings(): Promise<BookingRequest[]> {
  try {
    const { blobs } = await list({ prefix: PREFIX })
    const results = await Promise.all(
      blobs.map(async (b) => {
        const res = await fetch(b.url, { cache: "no-store" })
        return (await res.json()) as BookingRequest
      }),
    )
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}
