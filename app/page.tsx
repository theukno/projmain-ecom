import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoodQuizCard } from "@/components/mood-quiz-card"
import { FeaturedProducts } from "@/components/featured-products"
import { HowItWorks } from "@/components/how-it-works"
import { ShoppingBag, Sparkles, MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Shop Based on Your Mood
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover products that match how you feel. Take our mood quiz and get personalized recommendations.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/quiz">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Take Mood Quiz
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <MoodQuizCard />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Chat Assistant */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button size="lg" className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open Chat Assistant</span>
        </Button>
      </div>
    </div>
  )
}

