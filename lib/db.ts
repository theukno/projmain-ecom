// Mock database for demo purposes
const users = []
const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Denim Jeans",
    description: "Stylish denim jeans",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Casual Sneakers",
    description: "Everyday comfortable sneakers",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=400",
  },
]

const orders = []

const recommendedProducts = [
  {
    id: 101,
    name: "Recommended T-Shirt",
    description: "Based on your style preferences",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 102,
    name: "Stylish Jeans",
    description: "Perfect match for your style",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 103,
    name: "Fashion Sneakers",
    description: "Complete your look with these",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=400",
  },
]

const tempOtps = {}

export const db = {
  getProducts: async () => {
    return products
  },
  getRecommendedProducts: async ({ style, color, size }) => {
    // In a real application, you would query a database
    // based on the provided style, color, and size
    return recommendedProducts
  },
  getUserByEmail: async (email) => {
    return users.find((user) => user.email === email)
  },
  createUser: async ({ email, password }) => {
    const newUser = {
      id: users.length + 1,
      email,
      password,
      token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    }
    users.push(newUser)
    return newUser
  },
  authenticateUser: async (email, password) => {
    const user = users.find((user) => user.email === email && user.password === password)
    return user
  },
  addToCart: async (token, productId, quantity) => {
    // In a real application, you would update the user's cart in a database
    return { success: true }
  },
  getUserCart: async (token) => {
    // In a real application, you would fetch the user's cart from a database
    return { items: [] }
  },
  getOrderById: async (orderId) => {
    const order = orders.find((order) => order.id === orderId)
    return order
  },
  verifyOtp: async (email, otp) => {
    if (!tempOtps[email]) return false
    return tempOtps[email] === otp
  },
  generateAndStoreOtp: async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    tempOtps[email] = otp
    return otp
  },
}

