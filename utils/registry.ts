import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createProviderRegistry, Provider } from 'ai';

export const registry = createProviderRegistry({
  anthropic: createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })  as unknown as Provider,
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  }) as unknown as Provider,
  deepseek: createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY!,
  }) as unknown as Provider,
  groq: createGroq({
    apiKey: process.env.GROQ_API_KEY!,
  }),
  gemini: createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY!,
  }) as unknown as Provider,
});
