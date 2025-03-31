"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (!orderId) {
      router.push("/checkout")
      return
    }

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        setOrderDetails(data)
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, router])

  if (loading) {
    return <div className="container mx-auto p-4">Loading order details...</div>
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Order not found</h2>
          <p className="mb-4">We couldn't find the order you're looking for.</p>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-green-50 border border-green-200 p-6 rounded-md mb-8">
        <h1 className="text-2xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
        <p className="text-green-600">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="mb-4">
          <p className="text-gray-600">
            Order ID: <span className="font-medium">{orderDetails.id}</span>
          </p>
          <p className="text-gray-600">
            Date: <span className="font-medium">{new Date(orderDetails.date).toLocaleDateString()}</span>
          </p>
        </div>

        <h3 className="font-semibold mb-2">Items</h3>
        <div className="border-t border-b py-4 mb-4">
          {orderDetails.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p>${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${orderDetails.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>${orderDetails.shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>${orderDetails.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
          <span>Total</span>
          <span>${orderDetails.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <p>{orderDetails.shipping_address.name}</p>
        <p>{orderDetails.shipping_address.street}</p>
        <p>
          {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state}{" "}
          {orderDetails.shipping_address.zip}
        </p>
      </div>

      <div className="flex space-x-4">
        <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
          Continue Shopping
        </Link>
        <Link href="/account" className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50">
          View My Orders
        </Link>
      </div>
    </div>
  )
}

