import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAuthed } from "@/lib/auth"
import { getImageOverrides } from "@/lib/image-store"
import { imageSlots } from "@/lib/cars"
import { listTestDrives } from "@/lib/test-drives"
import { ImageEditor } from "./image-editor"
import { logoutAction } from "./actions"

export const metadata: Metadata = {
  title: "Admin — Asherion Automotive",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login")

  const overrides = await getImageOverrides()
  const testDrives = await listTestDrives()

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">Asherion Automotive</span>
          <h1 className="h-lg">Stock Image Manager</h1>
        </div>
        <div className="admin-topbar-actions">
          <Link href="/" className="btn btn-ghost">
            View site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-ghost">
              Log out
            </button>
          </form>
        </div>
      </header>

      <p className="admin-sub">
        Upload a new image for any stock vehicle. Changes appear instantly on the home and stock pages.
      </p>

      <div className="grid grid-3 admin-grid">
        {imageSlots.map((slot) => (
          <ImageEditor
            key={slot.key}
            slot={{
              key: slot.key,
              label: slot.label,
              currentImage: overrides[slot.key] ?? slot.defaultImage,
            }}
          />
        ))}
      </div>

      <section style={{ marginTop: 56 }}>
        <h2 className="h-md" style={{ marginBottom: 6 }}>
          Test Drive Requests
        </h2>
        <p className="admin-sub" style={{ marginBottom: 24 }}>
          Submitted requests with securely stored driver&apos;s licences. {testDrives.length} total.
        </p>

        {testDrives.length === 0 ? (
          <div className="card" style={{ padding: 28 }}>
            <p style={{ color: "var(--muted)" }}>No test drive requests yet.</p>
          </div>
        ) : (
          <div className="td-admin-list">
            {testDrives.map((t) => (
              <div className="card td-admin-row" key={t.id}>
                <a
                  className="td-admin-license"
                  href={`/api/license?pathname=${encodeURIComponent(t.licensePathname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/license?pathname=${encodeURIComponent(t.licensePathname)}`}
                    alt={`Driver's licence for ${t.name}`}
                  />
                </a>
                <div className="td-admin-info">
                  <h4>{t.name}</h4>
                  <p className="td-admin-vehicle">{t.vehicle}</p>
                  <dl className="td-admin-meta">
                    <div>
                      <dt>Email</dt>
                      <dd>{t.email}</dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{t.phone}</dd>
                    </div>
                    <div>
                      <dt>Licence No.</dt>
                      <dd>{t.licenseNumber || "—"}</dd>
                    </div>
                    <div>
                      <dt>Expiry</dt>
                      <dd>{t.licenseExpiry || "—"}</dd>
                    </div>
                    <div>
                      <dt>DOB</dt>
                      <dd>{t.dateOfBirth || "—"}</dd>
                    </div>
                    <div>
                      <dt>Preferred</dt>
                      <dd>{t.preferredDate || "—"}</dd>
                    </div>
                  </dl>
                  {t.notes && <p className="td-admin-notes">{t.notes}</p>}
                  <span className="td-admin-date">
                    Submitted {new Date(t.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
