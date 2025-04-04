import { NextApiRequest, NextApiResponse } from "next";
import pdf from "pdf-parse";
import { streamText } from "ai";
import { registry } from "@/utils/registry";

interface AnalysisResult {
    score: number;
    strengths: string[];
    improvements: string[];
    atsOptimization: string[];
    keywordAnalysis: Record<string, number>;
    sentiment: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const { resumeData, jobDescription = "" } = req.body;

        // Validate input
        if (!resumeData?.buffer || !resumeData?.originalname?.endsWith('.pdf')) {
            return res.status(400).json({ error: "Invalid PDF file" });
        }

        // Convert buffer to PDF text
        const pdfBuffer = Buffer.from(resumeData.buffer.data);
        const { text } = await pdf(pdfBuffer);

        // AI Analysis
        const analysis = await performResumeAnalysis(text, jobDescription);

        res.status(200).json(analysis);

    } catch (error) {
        console.error("Resume analysis error:", error);
        res.status(500).json({ error: "Failed to analyze resume PDF" });
    }
}

async function performResumeAnalysis(text: string, jobDescription: string): Promise<AnalysisResult> {
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

    const result = await streamText({
        model: registry.languageModel("gpt-4"),
        system: analysisPrompt,
        messages: [{ role: "user", content: text }],
        temperature: 0.2,
        maxTokens: 2000
    });

    return JSON.parse(await result.text);
}