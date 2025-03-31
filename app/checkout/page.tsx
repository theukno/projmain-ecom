"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/status")
        const data = await response.json()
        setIsLoggedIn(data.isLoggedIn)
      } catch (error) {
        console.error("Error checking auth status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Process payment
      const paymentResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          // Add other order details
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Payment failed")
      }

      const orderData = await paymentResponse.json()

      // Redirect to confirmation page with order ID
      router.push(`/checkout/confirmation?orderId=${orderData.orderId}`)
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error processing your payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading && !isLoggedIn) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  // If not logged in, redirect to login
  if (!loading && !isLoggedIn) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Please sign in to continue</h2>
          <p className="mb-4">You need to be signed in to complete your purchase.</p>
          <Link
            href="/account?redirect=checkout"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            {/* Shipping form fields */}
            <div className="mb-4">
              <label className="block mb-1">Full Name</label>
              <input type="text" className="w-full border rounded p-2" required />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Address</label>
              <input type="text" className="w-full border rounded p-2" required />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">City</label>
                <input type="text" className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block mb-1">Postal Code</label>
                <input type="text" className="w-full border rounded p-2" required />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-8">Payment Method</h2>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="credit"
                  name="paymentMethod"
                  value="credit"
                  checked={paymentMethod === "credit"}
                  onChange={() => setPaymentMethod("credit")}
                  className="mr-2"
                />
                <label htmlFor="credit">Credit Card</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="mr-2"
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
            </div>

            {paymentMethod === "credit" && (
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block mb-1">Card Number</label>
                  <input type="text" className="w-full border rounded p-2" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Expiration Date</label>
                    <input type="text" className="w-full border rounded p-2" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <label className="block mb-1">CVV</label>
                    <input type="text" className="w-full border rounded p-2" placeholder="123" required />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Complete Purchase"}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {/* Order summary content */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>$99.97</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$4.99</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>$8.50</span>
            </div>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>$113.46</span>
          </div>
        </div>
      </div>
    </div>
  )
}

