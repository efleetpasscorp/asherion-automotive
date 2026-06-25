import "server-only"
import { list, put } from "@vercel/blob"

const OVERRIDES_PATH = "site-config/image-overrides.json"

export type ImageOverrides = Record<string, string>

// Read the current slot -> image URL overrides from Blob.
export async function getImageOverrides(): Promise<ImageOverrides> {
  try {
    const { blobs } = await list({ prefix: OVERRIDES_PATH })
    const found = blobs.find((b) => b.pathname === OVERRIDES_PATH)
    if (!found) return {}
    const res = await fetch(found.url, { cache: "no-store" })
    if (!res.ok) return {}
    return (await res.json()) as ImageOverrides
  } catch (error) {
    console.error("[v0] Failed to read image overrides:", error)
    return {}
  }
}

// Persist a single slot override back to Blob.
export async function setImageOverride(slot: string, url: string): Promise<void> {
  const current = await getImageOverrides()
  current[slot] = url
  await put(OVERRIDES_PATH, JSON.stringify(current), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

// Apply overrides to any list of items that carry a `slot` + `image` field.
export function applyOverrides<T extends { slot: string; image: string }>(
  items: T[],
  overrides: ImageOverrides,
): T[] {
  return items.map((item) => ({
    ...item,
    image: overrides[item.slot] ?? item.image,
  }))
}
