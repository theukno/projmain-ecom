"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Loader2 } from "lucide-react"

interface Order {
  _id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    imageUrl?: string
  }>
  total: number
  status: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  shippingAddress: string
  paymentMethod: string
}

export function Bill() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchOrder()
    }
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching order with ID:", id)
      
      const response = await fetch(`/api/orders/${id}`)
      console.log("Response status:", response.status)
      
      const data = await response.json()
      console.log("Response data:", data)
      
      if (!response.ok) {
        console.error("Error response:", data)
        throw new Error(data.error || "Failed to fetch order")
      }
      
      if (!data) {
        console.error("No order data received")
        throw new Error("No order data received")
      }
      
      console.log("Setting order data:", data)
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
      setError(error instanceof Error ? error.message : "Failed to load order details")
    } finally {
      setLoading(false)
    }
  }

  const downloadBill = () => {
    if (!order) return

    const billContent = `
Order Bill
==========
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status}

Customer Information
------------------
Name: ${order.user.name}
Email: ${order.user.email}

Shipping Address
--------------
${order.shippingAddress}

Payment Method
-------------
${order.paymentMethod}

Items
-----
${order.items.map(item => `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total Amount: $${order.total.toFixed(2)}

Thank you for your purchase!
    `.trim()

    const blob = new Blob([billContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bill-${order._id}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-destructive">
            <p>{error}</p>
            <Button variant="outline" onClick={fetchOrder} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <p>Order not found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Bill</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Customer Information</h3>
          <p><strong>Name:</strong> {order.user.name}</p>
          <p><strong>Email:</strong> {order.user.email}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Shipping Address</h3>
          <p>{order.shippingAddress}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Payment Method</h3>
          <p>{order.paymentMethod}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Items</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-medium text-lg">
            <span>Total Amount</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <Button onClick={downloadBill} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Bill
        </Button>
      </CardContent>
    </Card>
  )
} 