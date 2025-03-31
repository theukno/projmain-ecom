import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SmilePlus, ShoppingBag, CreditCard, Package } from "lucide-react"

const steps = [
  {
    icon: <SmilePlus className="h-10 w-10 text-primary" />,
    title: "Take the Mood Quiz",
    description: "Answer a few questions to help us understand your current mood and preferences.",
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-primary" />,
    title: "Get Personalized Recommendations",
    description: "We'll suggest products that match your mood and can help enhance your wellbeing.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-primary" />,
    title: "Secure Checkout",
    description: "Add items to your cart and complete your purchase with our secure payment system.",
  },
  {
    icon: <Package className="h-10 w-10 text-primary" />,
    title: "Enjoy Your Mood-Boosting Products",
    description: "Receive your order and experience products tailored to your emotional state.",
  },
]

export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our simple process to find products that match your mood
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-2 border-muted">
              <CardHeader className="pb-2">
                <div className="mb-2">{step.icon}</div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

