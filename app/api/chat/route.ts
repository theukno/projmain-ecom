import { StreamingTextResponse } from "ai"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get the last user message
  const lastMessage = messages[messages.length - 1]

  // Create a system prompt for the shopping assistant
  const systemPrompt = `
    You are a helpful shopping assistant for MoodShop, a mood-based shopping platform.
    You can help users find products based on their mood, answer questions about products,
    and provide recommendations. You should be friendly, empathetic, and understanding of
    the user's emotional state.
    
    Available mood categories:
    - Happy: Products that celebrate and enhance positive feelings
    - Calm: Products that promote relaxation and peace
    - Comfort: Products that provide support during sad or difficult times
    - Energetic: Products that channel and boost energy
    
    When recommending products, suggest items from our catalog that match the user's mood.
  `

  // Stream the response
  const stream = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: lastMessage.content,
  })

  return new StreamingTextResponse(stream.toReadableStream())
}

