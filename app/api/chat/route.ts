import { registry } from "@/utils/registry";
import { groq } from "@ai-sdk/groq";
import {
  extractReasoningMiddleware,
  streamText,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // Check if content-type is multipart/form-data (image upload)
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      return handleImageRequest(request);
    } else {
      return handleTextRequest(request);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' }, 
      { status: 500 }
    );
  }
}

async function handleImageRequest(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image') as File;
  const prompt = formData.get('prompt') as string || "What's in this image?";
  const model = formData.get('model') as string;
  const systemPrompt = formData.get('systemPrompt') as string;

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  // Convert image to base64
  const buffer = await image.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString('base64');

  // Initialize the model
  const geminiModel = genAI.getGenerativeModel({ 
    model: model.includes('gemini') ? model.split(':')[1] : "gemini-2.0-flash"
  });

  // Prepare the image part
  const imageParts = [
    {
      inlineData: {
        data: base64Image,
        mimeType: image.type
      }
    }
  ];

  // Generate content - ONLY uses the image prompt, ignores text messages
  const result = await geminiModel.generateContent({
    contents: [
      {
        parts: [
          { text: systemPrompt || "You are a helpful assistant that analyzes images." },
          { text: prompt }, // Only uses the specific image prompt
          ...imageParts
        ],
        role:"user"
      }
    ]
  });

  const response = await result.response;
  const text = response.text();

  return NextResponse.json({ 
    text,
    isImageResponse: true // Flag to identify image responses
  });
}

async function handleTextRequest(request: Request) {
  const {
    messages,

    model: modelType,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
    systemPrompt,
  } = await request.json();

  const defaultSystemPrompt = `
  You are an advanced AI assistant in an interactive playground environment...
  `; // (keep your existing system prompt)

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
























// import { registry } from "@/utils/registry";
// import { groq } from "@ai-sdk/groq";
// import {
//   extractReasoningMiddleware,
//   streamText,
//   experimental_wrapLanguageModel as wrapLanguageModel,
// } from "ai";
// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// export const runtime = 'edge';
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(request: Request) {
//   try {
//     // Check if content-type is multipart/form-data (image upload)
//     if (request.headers.get('content-type')?.includes('multipart/form-data')) {
//       return handleImageRequest(request);
//     } else {
//       return handleTextRequest(request);
//     }
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Failed to process request' }, 
//       { status: 500 }
//     );
//   }
// }

// async function handleImageRequest(request: Request) {
//   const formData = await request.formData();
//   const image = formData.get('image') as File;
//   const prompt = formData.get('prompt') as string || "What's in this image?";
//   const model = formData.get('model') as string;
//   const systemPrompt = formData.get('systemPrompt') as string;

//   if (!image) {
//     return NextResponse.json({ error: 'No image provided' }, { status: 400 });
//   }

//   // Convert image to base64
//   const buffer = await image.arrayBuffer();
//   const base64Image = Buffer.from(buffer).toString('base64');

//   // Initialize the model
//   const geminiModel = genAI.getGenerativeModel({ 
//     model: model.includes('gemini') ? model.split(':')[1] : "gemini-2.0-flash"
//   });

//   // Prepare the image part
//   const imageParts = [
//     {
//       inlineData: {
//         data: base64Image,
//         mimeType: image.type
//       }
//     }
//   ];

//   // Generate content - ONLY uses the image prompt, ignores text messages
//   const result = await geminiModel.generateContent({
//     contents: [
//       {
//         parts: [
//           { text: systemPrompt || "You are a helpful assistant that analyzes images." },
//           { text: prompt }, // Only uses the specific image prompt
//           ...imageParts
//         ],
//         role: "user"
//       }
//     ]
//   });

//   const response = await result.response;
//   const text = response.text();

//   return NextResponse.json({ 
//     text,
//     isImageResponse: true // Flag to identify image responses
//   });
// }

// async function handleTextRequest(request: Request) {
//   const {
//     messages,

//     model: modelType,
//     temperature,
//     maxTokens,
//     topP,
//     frequencyPenalty,
//     presencePenalty,
//     systemPrompt,
//   } = await request.json();

//   const defaultSystemPrompt = `
//   You are an advanced AI assistant in an interactive playground environment...
//   `; // (keep your existing system prompt)

//   const enhancedModel = wrapLanguageModel({
//     model: groq("deepseek-r1-distill-llama-70b"),
//     middleware: extractReasoningMiddleware({ tagName: "think" }),
//   });

//   const result = streamText({
//     model: modelType === "deepseek:deepseek-reasoner"
//       ? enhancedModel
//       : registry.languageModel(modelType),
//     messages,
//     temperature: temperature || 0.7,
//     maxTokens: maxTokens || 1000,
//     topP: topP || 0.9,
//     frequencyPenalty: frequencyPenalty || 0.0,
//     presencePenalty: presencePenalty || 0.0,
//     system: systemPrompt || defaultSystemPrompt,
//     maxSteps: 5,
//     onStepFinish({
//       text,
//       toolCalls,
//       toolResults,
//       finishReason,
//       usage,
//       stepType,
//     }) {
//       console.log("stepType", stepType);
//       console.log("text", text);
//       console.log("finishReason", finishReason);
//       console.log("usage", usage);

//       if (finishReason === "tool-calls") {
//         const toolInvocations = toolResults?.[0];
//         console.log("toolInvocations", toolInvocations);
//       }
//     },
//     onFinish: ({ text, toolResults, toolCalls, finishReason }) => {
//       console.log("text", text);
//       console.log("finishReason", finishReason);
//     },
//   });

//   return result.toDataStreamResponse({
//     sendReasoning: true,
//   });
// }