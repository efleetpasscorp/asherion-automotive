import "server-only"
import { put, list } from "@vercel/blob"

export type WishOrder = {
  id: string
  make: string
  model: string
  year: string
  budget: string
  color: string
  name: string
  email: string
  phone: string
  notes: string
  createdAt: string
}

const PREFIX = "wishes/"

export async function saveWish(
  data: Omit<WishOrder, "id" | "createdAt">,
): Promise<WishOrder> {
  const wish: WishOrder = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await put(`${PREFIX}${wish.id}.json`, JSON.stringify(wish, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  })
  return wish
}

export async function listWishes(): Promise<WishOrder[]> {
  try {
    const { blobs } = await list({ prefix: PREFIX })
    const results = await Promise.all(
      blobs.map(async (b) => {
        const res = await fetch(b.url, { cache: "no-store" })
        return (await res.json()) as WishOrder
      }),
    )
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}
