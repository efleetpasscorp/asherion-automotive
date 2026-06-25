import "server-only"
import { randomUUID } from "node:crypto"
import { SquareClient, SquareEnvironment } from "square"

function getConfig() {
  const token = process.env.SQUARE_ACCESS_TOKEN
  const locationId = process.env.SQUARE_LOCATION_ID
  const env = (process.env.SQUARE_ENVIRONMENT ?? "sandbox").toLowerCase()

  if (!token || !locationId) {
    return null
  }

  return {
    token,
    locationId,
    environment: env === "production" ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  }
}

export function isSquareConfigured() {
  return getConfig() !== null
}

type CheckoutItem = {
  name: string
  amountCents: number
  note?: string
}

/**
 * Creates a Square-hosted payment link (Quick Pay) for a single vehicle.
 * Returns the long URL the buyer is redirected to.
 */
export async function createCheckoutLink(item: CheckoutItem, redirectUrl: string): Promise<string> {
  const config = getConfig()
  if (!config) {
    throw new Error("Square is not configured. Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID.")
  }

  const client = new SquareClient({
    token: config.token,
    environment: config.environment,
  })

  const response = await client.checkout.paymentLinks.create({
    idempotencyKey: randomUUID(),
    quickPay: {
      name: item.name,
      priceMoney: {
        amount: BigInt(item.amountCents),
        currency: "AUD",
      },
      locationId: config.locationId,
    },
    checkoutOptions: {
      redirectUrl,
      askForShippingAddress: false,
    },
    ...(item.note ? { description: item.note } : {}),
  })

  const url = response.paymentLink?.url
  if (!url) {
    throw new Error("Square did not return a payment link URL.")
  }
  return url
}
