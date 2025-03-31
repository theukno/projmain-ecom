import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Mood from "@/lib/models/Mood"

export async function GET() {
  try {
    await connectDB()
    const moods = await Mood.find({}, 'name _id').sort({ name: 1 })
    return NextResponse.json(moods)
  } catch (error) {
    console.error("Error fetching moods:", error)
    return NextResponse.json(
      { error: "Failed to fetch moods" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create new mood
    const mood = new Mood({
      name: data.name.toLowerCase(),
      description: data.description,
      imageUrl: data.imageUrl,
    })

    const savedMood = await mood.save()
    return NextResponse.json(savedMood, { status: 201 })
  } catch (error) {
    console.error("Error creating mood:", error)
    return NextResponse.json(
      { error: "Failed to create mood" },
      { status: 500 }
    )
  }
} 