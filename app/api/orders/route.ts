import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/lib/models/Order"
import User from "@/lib/models/User"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received order data:", body)

    const { userId, items, total, status, user, shippingAddress, paymentMethod } = body

    if (!userId || !items || !total) {
      console.error("Missing required fields:", { userId, items, total })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("Connecting to database...")
    await connectDB()
    console.log("Connected to database")

    // Get user information
    console.log("Looking up user:", userId)
    const dbUser = await User.findById(userId)
    if (!dbUser) {
      console.error("User not found:", userId)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    console.log("Found user:", dbUser._id)

    // Create order
    console.log("Creating order...")
    const orderData = {
      userId,
      items,
      total,
      status: status || 'pending',
      user: {
        name: user?.name || dbUser.name,
        email: user?.email || dbUser.email,
      },
      shippingAddress,
      paymentMethod,
    }
    console.log("Order data to save:", orderData)

    const order = await Order.create(orderData)
    console.log("Order created successfully:", order._id)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { 
        error: "Failed to create order", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    console.log("Connecting to database...")
    await connectDB()
    console.log("Connected to database")

    const orders = await Order.find().sort({ createdAt: -1 })
    console.log(`Found ${orders.length} orders`)

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

