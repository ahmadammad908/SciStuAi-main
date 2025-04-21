"use client";

import { useState, useRef } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import { Share, FileText, Sparkles, BookText, Menu, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import AnalysisReport from "@/app/(pages)/resume-analyzer/Analysis Report";

import '@/styles/page.css';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  

  const extractTextFromDocx = async (file: File) => {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file extension
    const validExtensions = [ '.docx', '.txt'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error("Please upload only  DOCX, or TXT files");
      return;
    }

    setFileName(file.name);
    setIsAnalyzing(true);
    setShowAnalysis(false);

    try {
      let text = "";

      if (fileExtension === '.docx') {
        text = await  extractTextFromDocx(file);
      } else if (fileExtension === '.txt') {
        text = await file.text();
      }

      setResumeText(text);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.error("Failed to parse file. Please try another format.");
      console.error("File parsing error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.warning("Please upload or paste your resume first");
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (!resumeText) return;
    navigator.clipboard.writeText(resumeText);
    toast.success("Resume text copied to clipboard");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-black">
      <Head>
        <title>Resume Analyzer | ResumeAI</title>
        <meta name="description" content="Analyze and improve your resume with AI-powered tools" />
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
              disabled={!resumeText}
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
                    accept=".docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-none"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? "Processing..." : "Upload Resume"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResumeText("");
                      setFileName("");
                      setShowAnalysis(false);
                    }}
                    disabled={isAnalyzing}
                  >
                    Clear
                  </Button>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {fileName || "Supports  DOCX, TXT formats only"}
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
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      setShowAnalysis(false);
                    }}
                    placeholder="Paste your resume text here or upload a file..."
                    className="h-64 resize-none"
                    disabled={isAnalyzing}
                  />
                </div>

                {/* Analysis Results */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Analysis Results</h3>
                    {resumeText && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        Copy
                      </Button>
                    )}
                  </div>
                  <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-zinc-50 dark:bg-zinc-900">
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin h-8 w-8 text-zinc-400" />
                        <span className="ml-2">Analyzing your resume...</span>
                      </div>
                    ) : showAnalysis && resumeText ? (
                      <AnalysisReport text={resumeText} />
                    ) : (
                      <div className="text-zinc-400 h-full flex items-center justify-center text-center p-4">
                        {resumeText
                          ? "Click 'Analyze Resume' to get detailed feedback"
                          : "Upload or paste your resume to begin analysis"}
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
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </div>

            {/* Tips Section */}
            <div className="border-t dark:border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Resume Writing Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "ATS Optimization",
                    content: "Use standard headings (Experience, Education) and avoid graphics/tables that confuse ATS systems."
                  },
                  {
                    title: "Achievement Focus",
                    content: "Highlight accomplishments with metrics (e.g., 'Increased sales by 40% in Q3 2023') rather than just responsibilities."
                  },
                  {
                    title: "Keyword Matching",
                    content: "Mirror language from the job description to increase your resume's relevance score in ATS systems."
                  },
                  {
                    title: "Professional Format",
                    content: "Use a clean, readable font (10-12pt), consistent spacing, and bullet points for easy scanning."
                  },
                  {
                    title: "Tailored Content",
                    content: "Customize your resume for each application by prioritizing relevant experience and skills."
                  },
                  {
                    title: "Error-Free Writing",
                    content: "Proofread meticulously and consider using tools like Grammarly to catch errors."
                  },
                  {
                    title: "Contact Information",
                    content: "Include professional email, phone, and LinkedIn profile (if relevant) at the top of your resume."
                  },
                  {
                    title: "Recent Experience First",
                    content: "List your work history in reverse chronological order, with the most recent position first."
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