"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  moodId?: string
}

interface Mood {
  _id: string
  name: string
}

export default function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const router = useRouter()
  const { productId } = use(params)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [moods, setMoods] = useState<Mood[]>([])
  const [formData, setFormData] = useState<Product>({
    _id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    moodId: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch moods
        const moodsResponse = await fetch('/api/moods')
        if (!moodsResponse.ok) {
          throw new Error('Failed to fetch moods')
        }
        const moodsData = await moodsResponse.json()
        setMoods(moodsData)

        // Fetch product
        const productResponse = await fetch(`/api/products/${productId}`)
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product')
        }
        const productData = await productResponse.json()
        setFormData(productData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage({ type: 'error', text: 'Failed to load data' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { _id, ...updateData } = formData
      
      // Handle moodId - if it's empty string, set to null, otherwise keep as is
      const dataToUpdate = {
        ...updateData,
        moodId: updateData.moodId === '' ? null : updateData.moodId
      }
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      setMessage({ type: 'success', text: 'Product updated successfully' })
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } catch (error) {
      console.error('Error updating product:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update product' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      
      {message && (
        <div className={`p-4 rounded-md mb-4 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            <option value="candles">Candles</option>
            <option value="diffusers">Diffusers</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label htmlFor="moodId" className="block text-sm font-medium text-gray-700">
            Mood
          </label>
          <select
            id="moodId"
            name="moodId"
            value={formData.moodId || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a mood</option>
            {moods.map((mood) => (
              <option key={mood._id} value={mood._id}>
                {mood.name.charAt(0).toUpperCase() + mood.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 