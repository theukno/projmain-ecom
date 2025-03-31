import connectDB from "../lib/mongodb.js"
import Mood from "../lib/models/Mood.js"

const moods = [
  {
    name: "happy",
    description: "Products that enhance positive feelings and joy",
    imageUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "calm",
    description: "Products that promote relaxation and peace",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "sad",
    description: "Products that provide comfort during difficult times",
    imageUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "energetic",
    description: "Products that boost energy and motivation",
    imageUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
]

async function seedMoods() {
  try {
    await connectDB()
    console.log("Connected to MongoDB")

    // Clear existing moods
    await Mood.deleteMany({})
    console.log("Cleared existing moods")

    // Insert new moods
    const insertedMoods = await Mood.insertMany(moods)
    console.log("Inserted moods:", insertedMoods)

    console.log("Mood seeding completed successfully")
  } catch (error) {
    console.error("Error seeding moods:", error)
  } finally {
    process.exit()
  }
}

seedMoods() 