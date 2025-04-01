import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/lib/models/Order"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log("Looking up order with ID:", id)

    console.log("Connecting to database...")
    await connectDB()
    console.log("Connected to database")

    console.log("Attempting to find order...")
    const order = await Order.findById(id)
    console.log("Order lookup result:", order ? "Found" : "Not found")
    if (order) {
      console.log("Order data:", JSON.stringify(order, null, 2))
    }

    if (!order) {
      console.error("Order not found:", id)
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 