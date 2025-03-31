import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, phone } = await request.json()

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // In a real app, you would store this OTP in a database with an expiration
    // and associate it with the user's email or phone

    // For demo purposes, we'll just log it
    console.log(`OTP for ${email || phone}: ${otp}`)

    // In a real app, you would send the OTP via email or SMS
    // For this example, we'll simulate sending it

    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}

