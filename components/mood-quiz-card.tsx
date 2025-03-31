import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MoodQuizCard() {
  return (
    <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Mood Quiz</CardTitle>
        <CardDescription>Answer a few questions to help us understand your current mood</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <span className="text-2xl mb-2">😊</span>
            <span className="text-sm font-medium">Happy</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <span className="text-2xl mb-2">😌</span>
            <span className="text-sm font-medium">Calm</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <span className="text-2xl mb-2">😔</span>
            <span className="text-sm font-medium">Sad</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <span className="text-2xl mb-2">😤</span>
            <span className="text-sm font-medium">Energetic</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/quiz" className="w-full">
          <Button className="w-full">
            Start Full Quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

