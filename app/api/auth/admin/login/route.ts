import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    // Check if it's the hardcoded admin credentials
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // Create or update admin user
      const adminUser = await User.findOneAndUpdate(
        { email },
        {
          name: "Admin",
          email,
          isAdmin: true,
          passwordHash: await bcrypt.hash(password, 10),
        },
        { upsert: true, new: true }
      )

      // Return admin user data
      const userData = {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: true,
      }

      // Set a cookie to maintain the session
      const response = NextResponse.json(userData)
      response.cookies.set("user", JSON.stringify(userData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return response
    }

    // If not admin credentials, check database
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    // Set a cookie to maintain the session
    const response = NextResponse.json(userData)
    response.cookies.set("user", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 