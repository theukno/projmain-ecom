import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Smile, Brain, ShoppingBag } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">About MoodShop</h1>
        <p className="text-gray-500 md:text-xl dark:text-gray-400 max-w-[700px] mx-auto">
          Discover how we're revolutionizing shopping by connecting emotions with products that enhance your wellbeing.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
        {[
          {
            icon: <Smile className="h-10 w-10 text-primary" />,
            title: "Mood-Based",
            description: "Products curated to match and enhance your emotional state",
          },
          {
            icon: <Brain className="h-10 w-10 text-primary" />,
            title: "Science-Backed",
            description: "Recommendations based on psychological research",
          },
          {
            icon: <Heart className="h-10 w-10 text-primary" />,
            title: "Wellbeing Focus",
            description: "Every product selected to improve your quality of life",
          },
          {
            icon: <ShoppingBag className="h-10 w-10 text-primary" />,
            title: "Personalized",
            description: "Shopping experience tailored to your unique needs",
          },
        ].map((feature, index) => (
          <Card key={index} className="border-2 border-muted">
            <CardHeader className="pb-2">
              <div className="mb-2">{feature.icon}</div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-12 md:grid-cols-2 mb-16">
        <div>
          <Badge className="mb-4">Our Story</Badge>
          <h2 className="text-3xl font-bold mb-4">How MoodShop Began</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            MoodShop was founded in 2023 with a simple but powerful idea: what if shopping could be more intuitive, more
            connected to how we actually feel?
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Our founder noticed that people often shop based on their emotional state - seeking comfort when sad,
            celebration items when happy, or calming products when anxious. Yet no platform existed that organized
            products this way.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            After months of research and collaboration with psychologists, MoodShop was born - a revolutionary platform
            that connects your emotions with products that can genuinely enhance your wellbeing.
          </p>
        </div>
        <div className="bg-muted rounded-lg h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Founder Image</p>
        </div>
      </div>

      <div className="mb-16">
        <div className="text-center mb-8">
          <Badge className="mb-4">Our Mission</Badge>
          <h2 className="text-3xl font-bold mb-4">Why We Exist</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            We believe shopping should be more than just transactions - it should be a tool for emotional wellbeing and
            self-care. Our mission is to help people find products that genuinely improve how they feel.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Understand</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                We help you understand your emotional state through our scientifically-designed mood quiz.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                We connect your mood with carefully curated products that can enhance or improve how you feel.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                We aim to improve your overall wellbeing through mindful consumption and emotional awareness.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-4">
          We're just getting started on our mission to revolutionize how people shop. Follow our journey and be part of
          the mood-based shopping revolution.
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="outline" className="px-4 py-2">
            Instagram
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            Twitter
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            Facebook
          </Badge>
        </div>
      </div>
    </div>
  )
}

