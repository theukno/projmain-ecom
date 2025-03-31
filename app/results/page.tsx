"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

export default function ResultsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get quiz answers from URL params
  const style = searchParams.get("style") || ""
  const color = searchParams.get("color") || ""
  const size = searchParams.get("size") || ""

  useEffect(() => {
    async function fetchRecommendedProducts() {
      try {
        // Fetch recommended products based on quiz answers
        const response = await fetch(`/api/products/recommendations?style=${style}&color=${color}&size=${size}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setError("Failed to load recommendations. Please try again later.")
        // Set fallback products so the page doesn't appear empty
        setProducts([
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
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedProducts()
  }, [style, color, size])

  const addToCart = async (productId) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add product to cart")
      }

      // Show success message or notification
      alert("Product added to cart!")

      // Optionally redirect to cart
      // router.push('/cart')
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading recommendations...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Your Personalized Recommendations</h1>
      <p className="text-gray-600 mb-6">Based on your style preferences, we think you'll love these items.</p>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p>No recommendations found. Try adjusting your preferences.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-64 w-full">
                {product.image ? (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />
                ) : (
                  <Image src="/placeholder.svg?height=400&width=400" alt={product.name} fill className="object-cover" />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mb-2">${product.price}</p>
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(product.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

