import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import Mood from "@/lib/models/Mood"
import mongoose from 'mongoose'

export async function GET(request: Request) {
  try {
    await connectDB()
    
    // Get mood from query parameters
    const { searchParams } = new URL(request.url)
    const moodName = searchParams.get('mood')

    // Build query
    let query = {}
    if (moodName) {
      // First find the mood by name
      const mood = await Mood.findOne({ name: moodName.toLowerCase() })
      if (mood) {
        // Then find products with that mood's ID
        query = { moodId: mood._id }
      }
    }

    const products = await Product.find(query)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("Connecting to MongoDB...")
    await connectDB()
    console.log("Connected to MongoDB successfully")

    const data = await request.json()
    console.log("Received product data:", data)

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.imageUrl || !data.category) {
      console.error("Missing required fields:", data)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate price
    const price = parseFloat(data.price)
    if (isNaN(price) || price <= 0) {
      console.error("Invalid price:", data.price)
      return NextResponse.json(
        { error: "Invalid price value" },
        { status: 400 }
      )
    }

    // Handle moodId
    let moodId = null
    if (data.moodId) {
      try {
        // First try to find the mood by name
        const mood = await Mood.findOne({ name: data.moodId.toLowerCase() })
        if (mood) {
          moodId = mood._id
        } else {
          // If not found by name, try to use it as an ObjectId
          moodId = new mongoose.Types.ObjectId(data.moodId)
        }
      } catch (error) {
        console.error("Invalid moodId format:", data.moodId)
        return NextResponse.json(
          { error: "Invalid moodId format" },
          { status: 400 }
        )
      }
    }

    // Create new product
    const product = new Product({
      name: data.name,
      description: data.description,
      price: price,
      imageUrl: data.imageUrl,
      category: data.category,
      moodId: moodId,
    })

    console.log("Attempting to save product...")
    const savedProduct = await product.save()
    console.log("Product created successfully:", savedProduct)
    
    return NextResponse.json(savedProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

