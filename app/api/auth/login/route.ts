import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

export async function POST(request) {
  try {
    const { email, password, otp } = await request.json()

    // Verify OTP
    const isValidOtp = await db.verifyOtp(email, otp)

    if (!isValidOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Authenticate user
    const user = await db.authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set auth cookie
    const cookieStore = cookies()
    cookieStore.set("auth_token", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}

