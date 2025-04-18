"use client";

import { useState, useRef } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import { Share, FileText, Sparkles, BookText, Menu, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import '@/styles/page.css'

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPdf = async (file: File) => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }

    return text;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      let text = "";

      if (file.type === "application/pdf") {
        text = await extractTextFromPdf(file);
      } else {
        text = await file.text();
      }

      setResumeText(text);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.error("Failed to parse file");
      console.error(error);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.warning("Please upload or paste your resume first");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis = generateMockAnalysis(resumeText);
      setAnalysis(mockAnalysis);
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Analysis failed");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (text: string) => {
    const wordCount = text.split(/\s+/).length;
    const hasContactInfo = /(email|phone|contact)/i.test(text);
    const hasEducation = /(education|degree|school)/i.test(text);
    const hasExperience = /(experience|work|job)/i.test(text);
    const hasSkills = /(skills|technical|programming)/i.test(text);

    const skillsList = [
      "JavaScript", "React", "Node.js", "Python", "Java",
      "SQL", "Git", "AWS", "HTML/CSS", "TypeScript"
    ];

    const detectedSkills = skillsList.filter(skill =>
      new RegExp(skill, "i").test(text)
    );

    return `
    📄 Resume Analysis Report
    -------------------------
    
    🔍 Basic Metrics:
    - Word Count: ${wordCount} words
    - Sections Detected:
      ${hasContactInfo ? "✓ Contact Information" : "⚠ Missing Contact Info"}
      ${hasEducation ? "✓ Education" : "⚠ Missing Education Section"}
      ${hasExperience ? "✓ Work Experience" : "⚠ Missing Experience Section"}
      ${hasSkills ? "✓ Skills Section" : "⚠ Missing Skills Section"}
    
    💻 Technical Skills Found:
    ${detectedSkills.length > 0
        ? detectedSkills.map(skill => `    • ${skill}`).join("\n")
        : "    No specific technical skills detected"}
    
    ⚡ Recommendations:
    1. ${wordCount < 300 ? "Consider adding more details" : "Good length"}
    2. ${!hasContactInfo ? "Add contact information" : "Contact info looks good"}
    3. ${detectedSkills.length < 3 ? "Highlight more technical skills" : "Good technical skills coverage"}
    4. Use more action verbs (developed, implemented, optimized)
    5. Quantify achievements where possible (e.g., "Increased performance by 30%")
    
    📈 Overall Score: ${Math.min(100, 70 + detectedSkills.length * 3 + wordCount / 10)}/100
    `;
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    toast.success("Analysis copied to clipboard");
  };

  return (

    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-black">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      {/* Navigation Sidebar - Desktop */}
      <div className="lg:w-64 border-r hidden lg:block dark:border-zinc-800 bg-gray-100 dark:bg-black">
        <div className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <h1 className="text-lg font-semibold">ResumeAI</h1>
          </Link>

          <Link href="/homework-helper">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Sparkles className="w-4 h-4" />
              Homework Helper
            </Button>
          </Link>

          <Link href="/article-reader">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BookText className="w-4 h-4" />
              Article Reader
            </Button>
          </Link>

          <Link href="/humanize-ai">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Sparkles className="w-4 h-4" />
              Humanize AI
            </Button>
          </Link>

          <Link href="/resume-analyzer">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <FileText className="w-4 h-4" />
              Resume Analyzer
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h2 className="text-lg font-medium">Resume Analyzer</h2>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!analysis}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b dark:border-zinc-800 bg-gray-100 dark:bg-black">
            <div className="p-4 space-y-2">
              <Link href="/homework-helper" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Sparkles className="w-4 h-4" />
                  Homework Helper
                </Button>
              </Link>

              <Link href="/article-reader" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <BookText className="w-4 h-4" />
                  Article Reader
                </Button>
              </Link>

              <Link href="/humanize-ai" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Sparkles className="w-4 h-4" />
                  Humanize AI
                </Button>
              </Link>

              <Link href="/resume-analyzer" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Resume Analyzer
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-none"
                  >
                    Upload Resume
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResumeText("");
                      setFileName("");
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {fileName || "No file selected (supports PDF, DOC, TXT)"}
                </span>
              </div>

              {/* Text Areas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resume Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Resume Text</h3>
                    <span className="text-sm text-zinc-500">
                      {resumeText.length > 0 ? `${resumeText.split(/\s+/).length} words` : ""}
                    </span>
                  </div>
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here or upload a file..."
                    className="h-64"
                    style={{
                      fontSize: '16px', // Important for mobile
                      transform: 'scale(1)',
                    }}
                  />
                </div>

                {/* Analysis Results */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Analysis Results</h3>
                    {analysis && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        Copy
                      </Button>
                    )}
                  </div>
                  <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-zinc-50 dark:bg-zinc-900 whitespace-pre-wrap">
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin h-8 w-8 text-zinc-400" />
                      </div>
                    ) : analysis ? (
                      <div className="text-sm">
                        {analysis}
                      </div>
                    ) : (
                      <div className="text-zinc-400 h-full flex items-center justify-center text-center p-4">
                        {resumeText
                          ? "Click 'Analyze Resume' to get feedback"
                          : "Analysis results will appear here"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={analyzeResume}
                disabled={isAnalyzing || !resumeText.trim()}
                className="w-full mt-4"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : "Analyze Resume"}
              </Button>
            </div>

            {/* Tips Section */}
            <div className="border-t dark:border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Resume Writing Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Action Verbs",
                    content: "Start bullet points with strong verbs like 'Developed', 'Led', 'Implemented' to showcase impact."
                  },
                  {
                    title: "Quantify Results",
                    content: "Include metrics like 'Increased sales by 30%' or 'Reduced costs by $50K' to demonstrate achievements."
                  },
                  {
                    title: "Keyword Optimization",
                    content: "Include keywords from the job description to pass ATS systems and catch recruiter attention."
                  },
                  {
                    title: "Clean Formatting",
                    content: "Use consistent formatting, clear headings, and plenty of white space for readability."
                  }
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">
                        {index + 1}.
                      </span>
                      {tip.title}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      {tip.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}