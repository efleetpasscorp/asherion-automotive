import "server-only"
import { put, list, get } from "@vercel/blob"

export type TestDriveRequest = {
  id: string
  vehicle: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: string
  dateOfBirth: string
  preferredDate: string
  notes: string
  licensePathname: string
  disclaimerAccepted: boolean
  createdAt: string
}

const REQUEST_PREFIX = "test-drives/"
const LICENSE_PREFIX = "licenses/"

/**
 * Stores a driver's license image in PRIVATE Blob storage.
 * The returned pathname is NOT publicly accessible — it must be streamed
 * through an authenticated route using get().
 */
export async function saveLicenseImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const pathname = `${LICENSE_PREFIX}${crypto.randomUUID()}.${ext}`
  const blob = await put(pathname, file, {
    access: "private",
    contentType: file.type || "image/jpeg",
    addRandomSuffix: false,
  })
  return blob.pathname
}

export async function saveTestDrive(
  data: Omit<TestDriveRequest, "id" | "createdAt">,
): Promise<TestDriveRequest> {
  const record: TestDriveRequest = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  // Request JSON also contains PII, so it is stored privately as well.
  await put(`${REQUEST_PREFIX}${record.id}.json`, JSON.stringify(record, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  })
  return record
}

export async function listTestDrives(): Promise<TestDriveRequest[]> {
  try {
    const { blobs } = await list({ prefix: REQUEST_PREFIX })
    const results = await Promise.all(
      blobs.map(async (b) => {
        const res = await get(b.pathname, { access: "private" })
        if (!res || res.statusCode === 304) return null
        const text = await new Response(res.stream).text()
        return JSON.parse(text) as TestDriveRequest
      }),
    )
    return results
      .filter((r): r is TestDriveRequest => r !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}
