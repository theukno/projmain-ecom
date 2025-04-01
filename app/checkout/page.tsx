"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download } from "lucide-react"
import { Bill } from "@/components/bill"

interface Order {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    imageUrl?: string
  }>
  total: number
  user: {
    name: string
    email: string
  }
  shippingAddress: string
  paymentMethod: string
  createdAt: string
}

function CheckoutContent() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/account?from=checkout')
    }
    if (items.length === 0 && !order) {
      router.push('/cart')
    }
  }, [user, items, router, order, isLoading])

  useEffect(() => {
    const orderId = searchParams.get('id')
    if (orderId) {
      fetchOrder(orderId)
    }
  }, [searchParams])

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      })
    }
  }

  const downloadBill = () => {
    if (!order) return

    const billContent = `
Order Bill
==========
Date: ${new Date(order.createdAt).toLocaleDateString()}

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
    a.download = `bill-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return

    setIsProcessing(true)
    try {
      // Get form values
      const name = (document.getElementById('name') as HTMLInputElement).value
      const email = (document.getElementById('email') as HTMLInputElement).value
      const address = (document.getElementById('address') as HTMLInputElement).value
      const city = (document.getElementById('city') as HTMLInputElement).value
      const state = (document.getElementById('state') as HTMLInputElement).value
      const zip = (document.getElementById('zip') as HTMLInputElement).value
      const cardNumber = (document.getElementById('card') as HTMLInputElement).value
      const expiry = (document.getElementById('expiry') as HTMLInputElement).value
      const cvc = (document.getElementById('cvc') as HTMLInputElement).value

      // Validate required fields with specific messages
      const missingFields = []
      if (!name) missingFields.push('Name')
      if (!email) missingFields.push('Email')
      if (!address) missingFields.push('Address')
      if (!city) missingFields.push('City')
      if (!state) missingFields.push('State')
      if (!zip) missingFields.push('ZIP Code')
      if (!cardNumber) missingFields.push('Card Number')
      if (!expiry) missingFields.push('Expiry Date')
      if (!cvc) missingFields.push('CVC')

      if (missingFields.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please fill in the following fields: ${missingFields.join(', ')}`,
          variant: "destructive",
        })
        return
      }

      const shippingAddress = `${address}, ${city}, ${state} ${zip}`
      const paymentMethod = `Card ending in ${cardNumber.slice(-4)}`

      // Validate required data
      if (!user.id) {
        console.error('User ID is missing')
        throw new Error('Please log in to place an order')
      }
      if (!items || items.length === 0) {
        throw new Error('Cart is empty')
      }
      if (!total || total <= 0) {
        throw new Error('Invalid total amount')
      }

      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        total,
        status: 'pending',
        user: {
          name,
          email,
        },
        shippingAddress,
        paymentMethod,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      clearCart()
      
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      })

      window.location.href = `/checkout?id=${data._id}`
    } catch (error) {
      console.error('Order creation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we verify your authentication.</p>
        </div>
      </div>
    )
  }

  if (!user || (items.length === 0 && !order)) {
    return null
  }

  if (order) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Confirmation</h1>
          <p className="text-muted-foreground">Thank you for your purchase!</p>
        </div>
        <Bill />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="card">Card Number</Label>
                <Input id="card" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p>${((item.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we load your checkout page.</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}


