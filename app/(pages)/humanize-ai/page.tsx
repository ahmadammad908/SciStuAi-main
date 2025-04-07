// app/(main)/humanize-ai/page.tsx
"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Share, Sparkles, Copy, BookText, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image"; // ✅ NEW: Optimized image import

interface HumanizeResult {
  id: string;
  originalText: string;
  humanizedText: string;
  timestamp: Date;
}

interface HumanizeResponse {
  result?: string;
  error?: string;
}

export default function HumanizeAIPage() {
  const [humanizeText, setHumanizeText] = useState<string>("");
  const [humanizedResults, setHumanizedResults] = useState<HumanizeResult[]>([]);
  const [isHumanizing, setIsHumanizing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [requests, setRequests] = useState<number[]>([]);

  const RATE_LIMIT = 5;
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

  const handleHumanize = async () => {
    if (!humanizeText.trim()) return;

    try {
      setIsHumanizing(true);
      setError("");

      // Client-side rate limiting
      const now = Date.now();
      const recentRequests = requests.filter(ts => ts > now - RATE_LIMIT_WINDOW);
      if (recentRequests.length >= RATE_LIMIT) {
        throw new Error(`Rate limit exceeded: ${RATE_LIMIT} requests per minute`);
      }

      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: humanizeText }),
      });

      const data = await response.json() as HumanizeResponse;

      if (!response.ok || "error" in data) {
        throw new Error(data.error || "Request failed");
      }

      setHumanizedResults(prev => [{
        id: uuidv4(),
        originalText: humanizeText,
        humanizedText: data.result!,
        timestamp: new Date()
      }, ...prev]);

      setHumanizeText("");
      setRequests(prev => [...prev, Date.now()]);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to humanize text";
      setError(errorMessage);
    } finally {
      setIsHumanizing(false);
    }
  };

  const HumanizedPreview = ({ result }: { result: HumanizeResult }) => (
    <div className="relative border rounded-lg p-4 bg-white dark:bg-zinc-900">
      <div className="text-sm whitespace-pre-wrap mb-4">
        {result.humanizedText}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigator.clipboard.writeText(result.humanizedText)}
        className="absolute top-2 right-2"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
    </div>
  );

  const HistoryItem = ({ result }: { result: HumanizeResult }) => (
    <div className="group relative border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Original</h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
            {result.originalText}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Humanized</h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
            {result.humanizedText}
          </p>
        </div>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(result.humanizedText)}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-xs text-zinc-400 mt-2">
        {result.timestamp.toLocaleString()}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Navigation Sidebar */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200">
        <div className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Image src="/favicon.ico" alt="SciStuAI" className="w-6 h-6" />
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
            <Button variant="secondary" className="w-full justify-start gap-2">
              <Sparkles className="w-4 h-4" />
              Humanize AI
            </Button>
          </Link>

          <Link href="/resume-analyzer">
            <Button variant="ghost" className="w-full justify-start gap-2">
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
            <h2 className="text-lg font-medium capitalize">Humanize AI</h2>
            <Badge variant="outline" className="text-xs">
              Text Converter
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Humanize AI Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Original Text</h3>
                <Textarea
                  value={humanizeText}
                  onChange={(e) => setHumanizeText(e.target.value)}
                  placeholder="Paste your AI-generated text here..."
                  className="h-64"
                />
                <Button
                  onClick={handleHumanize}
                  disabled={isHumanizing || !humanizeText.trim()}
                  className="w-full"
                >
                  {isHumanizing ? "Humanizing..." : "Humanize Text"}
                  {isHumanizing && (
                    <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Humanized Version</h3>
                {humanizedResults[0] && (
                  <HumanizedPreview result={humanizedResults[0]} />
                )}
              </div>
            </div>

            <div className="text-sm text-zinc-500 text-center">
              Requests this minute: {requests.filter(t => t > Date.now() - RATE_LIMIT_WINDOW).length}/{RATE_LIMIT}
            </div>

            {humanizedResults.length > 0 && (
              <div className="border-t dark:border-zinc-800 pt-6">
                <h3 className="text-lg font-semibold mb-4">History</h3>
                <div className="space-y-4">
                  {humanizedResults.map((result) => (
                    <HistoryItem key={result.id} result={result} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}