import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Asherion Automotive — Quality Cars, Transparent Pricing",
  description:
    "Asherion Automotive — your trusted partner in reliable car sales. Quality cars, transparent pricing, and a hassle-free buying experience.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 22 L16 6 L28 22 L20 22 L16 15 L12 22 Z' fill='%23cd0012'/%3E%3C/svg%3E",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body>{children}</body>
    </html>
  )
}
