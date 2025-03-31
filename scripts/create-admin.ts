import connectDB from "../lib/mongodb"
import User from "../lib/models/User"
import bcrypt from "bcryptjs"

async function createAdminUser() {
  try {
    await connectDB()
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@joslin.com" })
    if (existingAdmin) {
      console.log("Admin user already exists")
      process.exit(0)
    }

    // Create admin user
    const passwordHash = await bcrypt.hash("admin123", 10)
    const adminUser = new User({
      name: "Admin",
      email: "admin@joslin.com",
      passwordHash,
      isAdmin: true,
    })

    await adminUser.save()
    console.log("Admin user created successfully")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    process.exit(0)
  }
}

createAdminUser() 