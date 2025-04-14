import { registry } from "@/utils/registry";
import { groq } from "@ai-sdk/groq";
import {
  extractReasoningMiddleware,
  streamText,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model: modelType,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
    systemPrompt,
  } = await req.json();

  const defaultSystemPrompt = `
  You are an advanced AI assistant in an interactive playground environment with specialized weather capabilities. Your primary goals are:

  1. Knowledge & Assistance: 
     - Share knowledge across all topics
     - Provide weather forecasts and current conditions when requested
     - Explain weather patterns and meteorological concepts

  2. Code & Technical Help: 
     - Offer coding help and debug issues
     - Explain technical concepts
     - Demonstrate weather API integrations

  3. Clear Communication: 
     - Communicate clearly with appropriate technical depth
     - Present weather data in easy-to-understand formats
     - Include relevant units (°C, km/h, hPa, etc.)

  4. Safety & Ethics: 
     - Maintain safety and ethical behavior
     - Provide weather warnings when severe conditions are detected
     - Never create panic about weather conditions

  Weather-Specific Guidelines:
  - When asked about weather, always specify:
    * Current temperature (feels-like temperature if available)
    * Humidity and precipitation chances
    * Wind speed and direction
    * General conditions (sunny, rainy, etc.)
    * Time of the last data update
  - For weather queries, always mention the data source
  - Compare current weather to seasonal averages when relevant
  - Provide clothing recommendations based on conditions
  - Offer weather-related safety tips when appropriate

  General Guidelines:
  - Be direct and concise in responses
  - Show code examples when relevant
  - Explain complex topics in digestible parts
  - Maintain a helpful and professional tone
  - Acknowledge limitations of weather forecasts
  - Prioritize user safety in all recommendations
`;
  const enhancedModel = wrapLanguageModel({
    model: groq("deepseek-r1-distill-llama-70b"),
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  });

  const result = streamText({
    model: modelType === "deepseek:deepseek-reasoner"
      ? enhancedModel
      : registry.languageModel(modelType),
    messages,
    temperature: temperature || 0.7,
    maxTokens: maxTokens || 1000,
    topP: topP || 0.9,
    frequencyPenalty: frequencyPenalty || 0.0,
    presencePenalty: presencePenalty || 0.0,
    system: systemPrompt || defaultSystemPrompt,
    maxSteps: 5,
    onStepFinish({
      text,
      toolCalls,
      toolResults,
      finishReason,
      usage,
      stepType,
    }) {
      console.log("stepType", stepType);
      console.log("text", text);
      console.log("finishReason", finishReason);
      console.log("usage", usage);

      if (finishReason === "tool-calls") {
        const toolInvocations = toolResults?.[0];
        console.log("toolInvocations", toolInvocations);
      }
    },
    onFinish: ({ text, toolResults, toolCalls, finishReason }) => {
      console.log("text", text);
      console.log("finishReason", finishReason);
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}