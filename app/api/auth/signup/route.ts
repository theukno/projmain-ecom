import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    await db.createUser({ email, password })

    return NextResponse.json({
      success: true,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

