import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const orderId = params.orderId

    // Fetch order details from database
    const order = await db.getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // If no order found in database, return sample data for demo
    if (!order) {
      return NextResponse.json({
        id: orderId,
        date: new Date().toISOString(),
        status: "confirmed",
        items: [
          { id: 1, name: "Classic T-Shirt", quantity: 2, price: 19.99 },
          { id: 2, name: "Denim Jeans", quantity: 1, price: 49.99 },
        ],
        subtotal: 89.97,
        shipping: 4.99,
        tax: 8.5,
        total: 103.46,
        shipping_address: {
          name: "John Doe",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zip: "12345",
        },
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

