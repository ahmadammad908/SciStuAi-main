import { registry } from "@/utils/registry";
import { groq } from "@ai-sdk/groq";
import {
    extractReasoningMiddleware,
    streamText,
    experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

type ValidModel = 
  | `groq:${'llama3-70b-8192' | 'llama3-8b-8192' | 'mixtral-8x7b-32768' | 'deepseek-r1-distill-llama-70b'}` 
  | `deepseek:${'deepseek-reasoner' | string}`
  | `anthropic:${string}`
  | `openai:${string}`
  | `gemini:${string}`;

interface HumanizeRequest {
    text: string;
    model?: ValidModel;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<HumanizeRequest>;
        const {
            text,
            model = "deepseek:deepseek-reasoner",
            temperature = 0.7,
            maxTokens = 1000,
            topP = 0.9,
            frequencyPenalty = 0.0,
            presencePenalty = 0.0,
        } = body;

        if (!text || typeof text !== "string") {
            return new Response(JSON.stringify({ error: "Invalid text input" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const systemPrompt = `
You are an advanced text humanization engine. Your task is to:
1. Analyze and rewrite AI-generated text to sound more natural and human-like
2. Maintain the original meaning and intent
3. Use conversational language and natural phrasing
4. Avoid technical jargon and overly formal constructs
5. Add appropriate colloquialisms where suitable
6. Ensure readability for a general audience

Guidelines:
- Preserve technical accuracy when present
- Maintain appropriate tone for the context
- Keep paragraphs concise and focused
- Use contractions where natural
- Vary sentence structure
`;

        const enhancedModel = wrapLanguageModel({
            model: groq("deepseek-r1-distill-llama-70b"),
            middleware: extractReasoningMiddleware({ tagName: "humanize-process" }),
        });

        const result = await streamText({
            model: model === "deepseek:deepseek-reasoner"
                ? enhancedModel
                : registry.languageModel(model as any),
            messages: [{
                role: "user",
                content: text
            }],
            temperature,
            maxTokens,
            topP,
            frequencyPenalty,
            presencePenalty,
            system: systemPrompt,
        });

        // Return the streaming response directly
        return result.toDataStreamResponse();

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Humanization Error:", errorMessage);

        return new Response(JSON.stringify({ 
            error: "Failed to process request",
            details: errorMessage 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}