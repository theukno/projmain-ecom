import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
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
    // For now, return sample data
    return NextResponse.json({
      items: [
        { productId: 1, quantity: 2, name: "Classic T-Shirt", price: 19.99 },
        { productId: 2, quantity: 1, name: "Denim Jeans", price: 49.99 },
      ],
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { productId, quantity } = await request.json()

    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")

    // If no token, create a temporary cart in cookies
    if (!token) {
      // Get existing cart from cookies or create new one
      const cartCookie = cookieStore.get("temp_cart")
      const cart = cartCookie ? JSON.parse(cartCookie.value) : { items: [] }

      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex((item) => item.productId === productId)

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item to cart
        cart.items.push({
          productId,
          quantity,
          name: "Product " + productId, // In a real app, you would fetch product details
          price: 29.99, // Placeholder price
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
    // For now, return success response
    return NextResponse.json({
      success: true,
      items: [{ productId, quantity, name: "Product " + productId, price: 29.99 }],
    })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

