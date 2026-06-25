import { type NextRequest, NextResponse } from "next/server"
import { getVehicleById } from "@/lib/catalog"
import { createCheckoutLink, isSquareConfigured } from "@/lib/square"

export async function POST(request: NextRequest) {
  if (!isSquareConfigured()) {
    return NextResponse.json(
      { error: "Payments are not available yet. Square credentials have not been configured." },
      { status: 503 },
    )
  }

  let id: unknown
  try {
    const body = await request.json()
    id = body?.id
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  if (typeof id !== "string") {
    return NextResponse.json({ error: "Missing vehicle id." }, { status: 400 })
  }

  const car = await getVehicleById(id)
  if (!car) {
    return NextResponse.json({ error: "Vehicle not found." }, { status: 404 })
  }
  if (car.status === "coming-soon" || car.amountCents <= 0) {
    return NextResponse.json(
      { error: "This vehicle is coming soon and isn't available for checkout yet." },
      { status: 409 },
    )
  }

  // Build an absolute redirect URL back to our success page.
  const origin = request.nextUrl.origin
  const redirectUrl = `${origin}/checkout/success?vehicle=${encodeURIComponent(car.name)}`

  const label =
    car.kind === "rental" ? `${car.name} — Rental (first day / deposit)` : `${car.name} — Vehicle Purchase`

  try {
    const url = await createCheckoutLink(
      { name: label, amountCents: car.amountCents, note: `Asherion Automotive — ${car.name}` },
      redirectUrl,
    )
    return NextResponse.json({ url })
  } catch (error) {
    console.error("[v0] Square checkout error:", error)
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 })
  }
}
