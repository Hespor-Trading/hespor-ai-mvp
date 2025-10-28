import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Store contact form submission in waitlist table for now
    const { error } = await supabase.from("waitlist").insert([
      {
        email,
        full_name: name,
        company_name: company,
        message,
      },
    ])

    if (error) {
      console.error("Error storing contact form:", error)
      return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
    }

    // In production, you would also send an email notification here using Resend or similar

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
