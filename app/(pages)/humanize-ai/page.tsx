"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Share, Sparkles, Copy, BookText, FileText, Menu, X, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import '@/styles/page.css'

interface HumanizeResult {
  id: string;
  originalText: string;
  humanizedText: string;
  timestamp: Date;
}

export default function HumanizeAIPage() {
  const [humanizeText, setHumanizeText] = useState<string>("");
  const [humanizedResults, setHumanizedResults] = useState<HumanizeResult[]>([]);
  const [isHumanizing, setIsHumanizing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [requests, setRequests] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [streamedText, setStreamedText] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewCopied, setPreviewCopied] = useState(false);

  const RATE_LIMIT = 5;
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

  const handleCopy = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setPreviewCopied(true);
      setTimeout(() => setPreviewCopied(false), 2000);
    }
  };

  const handleHumanize = async () => {
    if (!humanizeText.trim()) return;

    try {
      setIsHumanizing(true);
      setError("");
      setStreamedText("");

      // Rate limiting
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

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let resultText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        resultText += chunk;
        setStreamedText(resultText);
      }

      setHumanizedResults(prev => [{
        id: uuidv4(),
        originalText: humanizeText,
        humanizedText: resultText,
        timestamp: new Date()
      }, ...prev]);

      setHumanizeText("");
      setRequests(prev => [...prev, now]);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to humanize text");
    } finally {
      setIsHumanizing(false);
      console.log("Humainxed text processing" ,streamedText)
    }
  };

  const formatHumanizedText = (text: string) => {
    if (!text) return text;
    
    // Process markdown formatting
    let formattedText = text
      // Headings
      .replace(/^#\s(.+)$/gm, '<h1 style="color: #ef4444; font-size: 1.5em; font-weight: bold; margin: 1em 0 0.5em;">$1</h1>')
      .replace(/^##\s(.+)$/gm, '<h2 style="color: #10b981; font-size: 1.3em; font-weight: bold; margin: 1em 0 0.5em;">$1</h2>')
      .replace(/^###\s(.+)$/gm, '<h3 style="color: #3b82f6; font-size: 1.1em; font-weight: bold; margin: 1em 0 0.5em;">$1</h3>')
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>')
      // Lists
      .replace(/^\-\s(.+)$/gm, '<li style="margin-left: 1.5em; list-style-type: disc;">$1</li>')
      .replace(/^\d+\.\s(.+)$/gm, '<li style="margin-left: 1.5em; list-style-type: decimal;">$1</li>')
      // Paragraphs and line breaks
      .replace(/\n\n/g, '</p><p style="margin-bottom: 1em; line-height: 1.6;">')
      .replace(/\n/g, '<br>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>')
      // Blockquotes
      .replace(/^>\s(.+)$/gm, '<blockquote style="border-left: 3px solid #ddd; padding-left: 1em; margin-left: 0; color: #666;">$1</blockquote>');

    // Wrap the whole content in a paragraph if it's not already wrapped
    if (!formattedText.includes('<h1') && !formattedText.includes('<h2') && !formattedText.includes('<h3') && 
        !formattedText.includes('<p>') && !formattedText.includes('<li>') && !formattedText.includes('<blockquote>')) {
      formattedText = `<p style="margin-bottom: 1em; line-height: 1.6;">${formattedText}</p>`;
    }

    return formattedText;
  };

  const HumanizedPreview = ({ result }: { result?: HumanizeResult }) => {
    const formattedText = result ? formatHumanizedText(result.humanizedText) : 
                               streamedText ? formatHumanizedText(streamedText) : 
                               '<p style="color: #6b7280;">Humanized text will appear here</p>';

    return (
      <div className="relative border rounded-lg p-4 bg-white dark:bg-zinc-900 h-64">
        <div 
          className="text-sm whitespace-pre-wrap h-full overflow-y-auto pr-2 styled-text"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
        {(result || streamedText) && !isHumanizing && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCopy(result?.humanizedText || streamedText || "")}
            className="absolute top-2 right-2"
          >
            {previewCopied ? (
              <Check className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {previewCopied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
    );
  };

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
          <div 
            className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 styled-text"
            dangerouslySetInnerHTML={{ __html: formatHumanizedText(result.humanizedText) }}
          />
        </div>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleCopy(result.humanizedText, result.id)}
        >
          {copiedId === result.id ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="text-xs text-zinc-400 mt-2">
        {result.timestamp.toLocaleString()}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Desktop Navigation Sidebar */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div className="hidden lg:block lg:w-64 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200">
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
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden block"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h2 className="text-lg font-medium capitalize truncate">Humanize AI</h2>
            <Badge variant="outline" className="text-xs truncate">
              Text Converter
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden p-4 border-b dark:border-zinc-800 border-zinc-200 bg-white dark:bg-black">
            <div className="space-y-2">
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
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Sparkles className="w-4 h-4" />
                  Humanize AI
                </Button>
              </Link>

              <Link href="/resume-analyzer" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Resume Analyzer
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Humanize AI Content */}
        <div className="flex-1 p-6 overflow-auto">
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
                  className="h-64 text-base"
                  disabled={isHumanizing}
                />
                <Button
                  onClick={handleHumanize}
                  disabled={isHumanizing || !humanizeText.trim()}
                  className="w-full"
                >
                  {isHumanizing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Humanize Text"}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Humanized Version</h3>
                <HumanizedPreview result={humanizedResults[0]} />
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