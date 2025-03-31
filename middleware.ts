import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path starts with /admin
  if (path.startsWith("/admin")) {
    // Get the user data from cookies
    const userData = request.cookies.get("user")
    const user = userData ? JSON.parse(userData.value) : null

    // If no user or user is not admin, redirect to login
    if (!user || !user.isAdmin) {
      const loginUrl = new URL("/account", request.url)
      loginUrl.searchParams.set("redirect", path)

      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/admin/:path*",
  ],
} 