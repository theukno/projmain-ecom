import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const style = searchParams.get("style")
    const color = searchParams.get("color")
    const size = searchParams.get("size")

    // In a real application, you would query a database
    // based on the provided style, color, and size

    // For now, return sample data
    return NextResponse.json([
      {
        id: 101,
        name: "Recommended T-Shirt",
        description: "Based on your style preferences",
        price: 29.99,
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        id: 102,
        name: "Stylish Jeans",
        description: "Perfect match for your style",
        price: 59.99,
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        id: 103,
        name: "Fashion Sneakers",
        description: "Complete your look with these",
        price: 89.99,
        image: "/placeholder.svg?height=400&width=400",
      },
    ])
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}

