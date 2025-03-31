import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")

  // Check if token exists and is valid
  const isLoggedIn = !!token

  return NextResponse.json({ isLoggedIn })
}

