import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB()
    const product = await Product.findById(params.productId)
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB()
    const body = await request.json()

    // Handle moodId conversion
    let moodId = null
    if (body.moodId) {
      try {
        moodId = new mongoose.Types.ObjectId(body.moodId)
      } catch (error) {
        console.error("Invalid moodId format:", body.moodId)
        return NextResponse.json(
          { error: "Invalid moodId format. Please provide a valid MongoDB ObjectId." },
          { status: 400 }
        )
      }
    }

    // Update product with converted moodId
    const product = await Product.findByIdAndUpdate(
      params.productId,
      { ...body, moodId },
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB()
    const product = await Product.findByIdAndDelete(params.productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
} 