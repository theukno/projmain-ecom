import { NextResponse } from "next/server"
import { createOrder, addOrderItem, getUserOrders } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId, items, totalAmount } = await req.json()

    if (!userId || !items || !totalAmount) {
      return NextResponse.json({ error: "User ID, items, and total amount are required" }, { status: 400 })
    }

    // Create the order
    const order = await createOrder(userId, totalAmount)

    // Add order items
    for (const item of items) {
      await addOrderItem(order.id, item.productId, item.quantity, item.price)
    }

    return NextResponse.json({
      message: "Order created successfully",
      order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const orders = await getUserOrders(Number.parseInt(userId))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

