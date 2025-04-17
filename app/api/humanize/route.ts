import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";
import { extractReasoningMiddleware } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid text input" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are an advanced AI text humanizer. Transform AI-generated content into natural, human-like text while preserving the original meaning. Follow these guidelines:

1. Use conversational language
2. Break long sentences into shorter ones
3. Use contractions where appropriate
4. Maintain technical accuracy
5. Keep paragraphs concise
6. Vary sentence structure
7. Use active voice
8. Ensure readability (8th-10th grade level)
`;

    const enhancedModel = wrapLanguageModel({
      model: groq("deepseek-r1-distill-llama-70b"),
      middleware: extractReasoningMiddleware({ tagName: "humanize-process" }),
    });

    const result = await streamText({
      model: enhancedModel,
      messages: [{
        role: "user",
        content: `Humanize this text:\n\n${text}`
      }],
      system: systemPrompt,
    });

    // Create clean streaming response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const delta of result.textStream) {
          controller.enqueue(new TextEncoder().encode(delta));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}