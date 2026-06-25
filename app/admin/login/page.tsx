import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAuthed } from "@/lib/auth"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Admin Login — Asherion Automotive",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin")

  return (
    <main className="admin-auth">
      <div className="admin-card">
        <span className="eyebrow">Asherion Automotive</span>
        <h1 className="h-lg">Admin Login</h1>
        <p className="admin-sub">Sign in to manage the stock car images shown across the site.</p>
        <LoginForm />
        <Link href="/" className="admin-back">
          ← Back to site
        </Link>
      </div>
    </main>
  )
}
