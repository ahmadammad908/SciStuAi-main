import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { registry } from "@/utils/registry";

export const maxDuration = 30; // Set maximum execution duration

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const resumeFile = formData.get('resume') as File;
        const jobDescription = formData.get('jobDescription') as string || "";

        // Validate inputs
        if (!resumeFile) {
            return NextResponse.json(
                { error: "No resume file provided" },
                { status: 400 }
            );
        }

        if (!resumeFile.name.endsWith('.pdf')) {
            return NextResponse.json(
                { error: "Please upload a valid PDF file" },
                { status: 400 }
            );
        }

        if (resumeFile.size === 0) {
            return NextResponse.json(
                { error: "The uploaded file is empty" },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        let arrayBuffer;
        try {
            arrayBuffer = await resumeFile.arrayBuffer();
        } catch (error) {
            console.error("File reading error:", error);
            return NextResponse.json(
                { error: "Failed to read the uploaded file" },
                { status: 400 }
            );
        }

        const pdfBuffer = Buffer.from(arrayBuffer);
        delete (pdfBuffer as any).path;

        // Parse PDF
        let pdfText;
        try {
            const { default: pdf } = await import("pdf-parse");
            const pdfData = await pdf(pdfBuffer);
            pdfText = pdfData.text;

            if (!pdfText || pdfText.trim().length === 0) {
                return NextResponse.json(
                    { error: "The PDF file appears to be empty or unreadable" },
                    { status: 400 }
                );
            }
        } catch (pdfError) {
            console.error("PDF parsing error:", pdfError);
            return NextResponse.json(
                {
                    error: "Unable to read the PDF file",
                    details: "Please ensure the file is not corrupted, password protected, or inaccessible"
                },
                { status: 400 }
            );
        }

        // AI Analysis
        try {
            const analysis = await performResumeAnalysis(pdfText, jobDescription);
            return NextResponse.json(analysis);
        } catch (analysisError) {
            console.error("AI analysis error:", analysisError);
            return NextResponse.json(
                { 
                    error: "Failed to analyze the resume content",
                    details: process.env.NODE_ENV === 'development' ? String(analysisError) : undefined
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Resume analysis error:", error);
        return NextResponse.json(
            {
                error: "Failed to process the resume",
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            },
            { status: 500 }
        );
    }
}

async function performResumeAnalysis(text: string, jobDescription: string) {
    const analysisPrompt = `
    Analyze this resume according to these criteria:
    1. ATS Optimization: Check for proper formatting and keywords
    2. Job Match: ${jobDescription || "General best practices"}
    3. Strength Identification: Technical skills, achievements
    4. Improvement Areas: Weak verbs, generic terms
    5. Keyword Analysis: Frequency and relevance
    6. Sentiment: Confidence and professionalism

    Respond in JSON format with these keys:
    - score (0-100)
    - strengths (array)
    - improvements (array)
    - atsOptimization (array)
    - keywordAnalysis (object)
    - sentiment (string)
    `;

    // Fix: Use proper model format with provider prefix
    const modelName = "openai:gpt-4"; // Correct format: provider:model-name

    const result = await streamText({
        model: registry.languageModel(modelName),
        system: analysisPrompt,
        messages: [{ role: "user", content: text }],
        temperature: 0.2,
        maxTokens: 2000
    });

    try {
        return JSON.parse(await result.text);
    } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        throw new Error("Invalid analysis response format");
    }
}