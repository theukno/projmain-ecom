"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  moodId?: string
}

export default function ResultsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addItem } = useCart()

  // Get mood from URL params
  const mood = searchParams.get("mood") || ""

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/products?mood=${mood}`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [mood])

  const handleAddToCart = async (product: Product) => {
    try {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      })
      // Show success message
      alert("Product added to cart!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Products for {mood.charAt(0).toUpperCase() + mood.slice(1)} Mood</h1>
      <p className="text-gray-600 mb-6">Here are some products that might help enhance your mood.</p>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p>No products found for this mood. Try browsing all products instead.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-64 w-full">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
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
                <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => router.push(`/products/${product._id}`)}
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

