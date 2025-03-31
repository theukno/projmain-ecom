import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: "Calming Tea Set",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    mood: "Calm",
    description: "A selection of herbal teas to help you relax and unwind.",
  },
  {
    id: 2,
    name: "Energizing Fitness Kit",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
    mood: "Energetic",
    description: "Everything you need for a quick workout to boost your energy.",
  },
  {
    id: 3,
    name: "Comfort Blanket",
    price: 34.99,
    image: "/placeholder.svg?height=200&width=200",
    mood: "Sad",
    description: "A soft, weighted blanket for those days when you need extra comfort.",
  },
  {
    id: 4,
    name: "Celebration Box",
    price: 39.99,
    image: "/placeholder.svg?height=200&width=200",
    mood: "Happy",
    description: "A curated box of treats to celebrate good moments.",
  },
]

export function FeaturedProducts() {
  return (
    <section className="w-full py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover our most popular mood-enhancing products
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {product.mood}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.description}</p>
                <p className="font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

