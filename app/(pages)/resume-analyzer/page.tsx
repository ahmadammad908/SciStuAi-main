"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Share, FileText, Sparkles, BookText, Menu, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text);
    };
    reader.readAsText(file);
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock analysis result
      setAnalysis(`Resume Analysis Results:\n\n1. Strong technical skills in listed technologies\n2. Good project experience\n3. Could improve action verbs in descriptions\n4. Education section is well-formatted\n5. Consider adding more metrics to quantify achievements`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Navigation Sidebar - Desktop */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200 hidden lg:block">
        <div className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <h1 className="text-lg font-semibold">ScistuAI</h1>
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 border-b dark:border-zinc-800 border-zinc-200">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h2 className="text-lg font-medium capitalize truncate w-full">Resume Analyzer</h2>
            
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
             <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Share className="w-4 h-4" />
                        </Button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-black border-b dark:border-zinc-800 border-zinc-200">
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

        {/* Resume Analyzer Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  Upload Resume
                </Button>
                <span className="text-sm text-zinc-500">
                  {resumeText ? "Resume loaded" : "No resume uploaded"}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Resume Text</h3>
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="h-64"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Analysis Results</h3>
                  <div className="border rounded-lg p-4 h-64 overflow-auto bg-white dark:bg-zinc-900">
                    {analysis ? (
                      <div className="whitespace-pre-wrap text-sm">
                        {analysis}
                      </div>
                    ) : (
                      <div className="text-zinc-400 text-sm h-full flex items-center justify-center">
                        {isAnalyzing ? "Analyzing..." : "Analysis will appear here"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={analyzeResume}
                disabled={isAnalyzing || !resumeText.trim()}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                {isAnalyzing && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </Button>
            </div>

            {/* Tips Section */}
            <div className="border-t dark:border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Tips for Better Resumes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800">
                  <h4 className="font-medium mb-2">Use Action Verbs</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Start bullet points with strong action verbs like "Developed", "Led", "Implemented".
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800">
                  <h4 className="font-medium mb-2">Quantify Achievements</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Include numbers to show impact, like "Increased sales by 30%".
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800">
                  <h4 className="font-medium mb-2">Keep It Concise</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Limit to 1-2 pages maximum. Focus on relevant experience.
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800">
                  <h4 className="font-medium mb-2">Tailor to Job</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Customize your resume for each job application by highlighting relevant skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}