import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
    score: number;
    strengths: string[];
    improvements: string[];
    atsOptimization: string[];
    keywordAnalysis: Record<string, number>;
    sentiment: string;
}

export default function ResumeAnalyzer() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("File size must be less than 5MB");
                setFile(null);
                return;
            }
            setFile(file);
            setError(null);
        } else {
            setError("Please upload a valid PDF file");
            setFile(null);
        }
    };

    const analyzeResume = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jobDescription);

            const response = await fetch("/api/resume-analysis", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }

            const result = await response.json();
            setAnalysis(result);
        } catch (error) {
            console.error("Analysis error:", error);
            setError(typeof error === 'string' ? error : "Failed to analyze resume. Please try again.");
            setAnalysis(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">AI Resume Analyzer</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Upload Resume (PDF)</label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                className="block w-full border rounded-lg p-2"
                                title="Upload your resume in PDF format"
                            />
                            {file && (
                                <p className="text-sm text-green-600">
                                    Selected file: {file.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Job Description (Optional)</label>
                        <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste job description for targeted analysis..."
                            rows={4}
                        />
                    </div>

                    <Button
                        onClick={analyzeResume}
                        disabled={!file || isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Analyzing..." : "Analyze Resume"}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
                    {error}
                </div>
            )}

            {analysis && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
                                <Progress value={analysis.score} className="h-3" />
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {analysis.score}%
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">✅ Strengths</h3>
                                <ul className="space-y-2">
                                    {analysis.strengths.map((strength, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-green-500">✓</span>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">📈 Improvements</h3>
                                <ul className="space-y-2">
                                    {analysis.improvements.map((improvement, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-yellow-500">•</span>
                                            {improvement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-semibold">🔍 Keyword Analysis</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(analysis.keywordAnalysis).map(([word, count]) => (
                                    <span
                                        key={word}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm"
                                    >
                                        {word} ({count})
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-semibold">📄 ATS Optimization</h3>
                            <ul className="space-y-2">
                                {analysis.atsOptimization.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}