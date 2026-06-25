import "server-only"
import { getSocialSettings } from "./social-settings"

const GRAPH_VERSION = "v21.0"

export type LiveReview = {
  name: string
  handle: string
  source: "facebook" | "instagram"
  rating: number
  quote: string
  createdTime?: string
}

type GraphRating = {
  reviewer?: { name?: string }
  rating?: number
  review_text?: string
  recommendation_type?: "positive" | "negative"
  created_time?: string
}

// Pull live Facebook Page recommendations / ratings via the Graph API.
// Requires a Page access token with pages_read_engagement (and, for content
// from users who haven't authorized the app, Page Public Content Access — which
// is granted through Meta App Review). Newer Pages return `recommendation_type`
// ("positive"/"negative") rather than a 1–5 `rating`; positive maps to 5 stars.
export async function fetchFacebookReviews(): Promise<{
  ok: boolean
  reviews: LiveReview[]
  error?: string
}> {
  const { facebookPageId, facebookAccessToken } = await getSocialSettings()
  if (!facebookPageId || !facebookAccessToken) {
    return { ok: false, reviews: [], error: "Facebook Page ID and access token are not configured." }
  }

  const fields = "reviewer{name},rating,review_text,recommendation_type,created_time"
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(facebookPageId)}/ratings` +
    `?fields=${encodeURIComponent(fields)}&limit=12&access_token=${encodeURIComponent(facebookAccessToken)}`

  try {
    // Cache live results for an hour so we don't hammer the Graph API on every render.
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const json = (await res.json()) as { data?: GraphRating[]; error?: { message?: string } }
    if (!res.ok || json.error) {
      return { ok: false, reviews: [], error: json.error?.message ?? `Graph API returned HTTP ${res.status}.` }
    }

    const reviews: LiveReview[] = (json.data ?? [])
      .filter((r) => (r.review_text && r.review_text.trim()) || r.recommendation_type)
      .map((r) => ({
        name: r.reviewer?.name ?? "Facebook user",
        handle: "via Facebook",
        source: "facebook" as const,
        rating: typeof r.rating === "number" ? r.rating : r.recommendation_type === "positive" ? 5 : 3,
        quote: r.review_text?.trim() || "Recommends Asherion Automotive.",
        createdTime: r.created_time,
      }))

    return { ok: true, reviews }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error contacting the Graph API."
    return { ok: false, reviews: [], error: message }
  }
}

// Verify the saved Page ID + token by requesting the Page's basic profile.
export async function testFacebookConnection(): Promise<{ ok: boolean; message: string }> {
  const { facebookPageId, facebookAccessToken } = await getSocialSettings()
  if (!facebookPageId || !facebookAccessToken) {
    return { ok: false, message: "Save a Facebook Page ID and access token first, then test." }
  }

  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(facebookPageId)}` +
    `?fields=name,fan_count&access_token=${encodeURIComponent(facebookAccessToken)}`

  try {
    const res = await fetch(url, { cache: "no-store" })
    const json = (await res.json()) as { name?: string; fan_count?: number; error?: { message?: string } }
    if (!res.ok || json.error) {
      return { ok: false, message: json.error?.message ?? `Graph API returned HTTP ${res.status}.` }
    }
    const fans = typeof json.fan_count === "number" ? ` · ${json.fan_count.toLocaleString()} followers` : ""
    return { ok: true, message: `Connected to "${json.name ?? "Facebook Page"}"${fans}.` }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error contacting the Graph API."
    return { ok: false, message }
  }
}
