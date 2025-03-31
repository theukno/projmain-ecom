import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"

interface CartItem {
  productId: string
  quantity: number
  name: string
  price: number
}

interface Cart {
  items: CartItem[]
}

export async function GET() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")

    // If no token, return empty cart or get from temp cart
    if (!token) {
      const tempCart = cookieStore.get("temp_cart")
      if (tempCart) {
        return NextResponse.json(JSON.parse(tempCart.value))
      }
      return NextResponse.json({ items: [] })
    }

    // In a real app, you would fetch the user's cart from a database
    // For now, return sample data with actual product prices
    const sampleProducts = await Product.find().limit(2)
    return NextResponse.json({
      items: sampleProducts.map(product => ({
        productId: product._id.toString(),
        quantity: 1,
        name: product.name,
        price: product.price
      }))
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json()
    await connectDB()

    // Fetch the product to get its details
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")

    // If no token, create a temporary cart in cookies
    if (!token) {
      // Get existing cart from cookies or create new one
      const cartCookie = cookieStore.get("temp_cart")
      const cart: Cart = cartCookie ? JSON.parse(cartCookie.value) : { items: [] }

      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex((item: CartItem) => item.productId === productId)

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item to cart with actual product details
        cart.items.push({
          productId,
          quantity,
          name: product.name,
          price: product.price
        })
      }

      // Save updated cart to cookies
      cookieStore.set("temp_cart", JSON.stringify(cart), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json(cart)
    }

    // In a real app, you would update the user's cart in a database
    // For now, return success response with actual product details
    return NextResponse.json({
      success: true,
      items: [{
        productId,
        quantity,
        name: product.name,
        price: product.price
      }],
    })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

