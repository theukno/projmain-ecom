import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Fetch products from database
    const products = await db.getProducts()

    // If no products found, return sample data
    if (!products || products.length === 0) {
      return NextResponse.json([
        {
          id: 1,
          name: "Classic T-Shirt",
          description: "Comfortable cotton t-shirt",
          price: 19.99,
          image: "/placeholder.svg?height=400&width=400",
        },
        {
          id: 2,
          name: "Denim Jeans",
          description: "Stylish denim jeans",
          price: 49.99,
          image: "/placeholder.svg?height=400&width=400",
        },
        {
          id: 3,
          name: "Casual Sneakers",
          description: "Everyday comfortable sneakers",
          price: 79.99,
          image: "/placeholder.svg?height=400&width=400",
        },
      ])
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

