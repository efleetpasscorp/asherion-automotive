import { generateText, Output } from "ai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

const licenseSchema = z.object({
  fullName: z.string().nullable().describe("Full name exactly as printed on the licence"),
  licenseNumber: z.string().nullable().describe("Driver's licence number / card number"),
  dateOfBirth: z.string().nullable().describe("Date of birth in YYYY-MM-DD format"),
  expiryDate: z.string().nullable().describe("Licence expiry date in YYYY-MM-DD format"),
  isLicense: z
    .boolean()
    .describe("True only if the image clearly appears to be a driver's licence"),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`

    const { experimental_output } = await generateText({
      model: "openai/gpt-5-mini",
      experimental_output: Output.object({ schema: licenseSchema }),
      messages: [
        {
          role: "system",
          content:
            "You extract details from photos of driver's licences. Read the card carefully and return the fields. Use YYYY-MM-DD for all dates. If a field is not visible, return null for it. Never invent data.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the details from this driver's licence." },
            { type: "image", image: dataUrl },
          ],
        },
      ],
    })

    if (!experimental_output.isLicense) {
      return NextResponse.json(
        { error: "That doesn't look like a driver's licence. Please upload a clear photo." },
        { status: 422 },
      )
    }

    return NextResponse.json({ data: experimental_output })
  } catch (error) {
    console.error("[v0] license scan error:", error)
    return NextResponse.json(
      { error: "Could not scan the licence. You can still fill in the form manually." },
      { status: 500 },
    )
  }
}
