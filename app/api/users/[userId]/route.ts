import { NextResponse } from "next/server"
import  connectDB  from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB()
    const user = await User.findByIdAndDelete(params.userId)
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
} 