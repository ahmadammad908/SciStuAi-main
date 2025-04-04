"use client";

import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot, ChevronDown, ChevronUp, Copy, Check, Download, Share, Sparkles, BookText, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { v4 as uuidv4 } from "uuid";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  timestamp: Date;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface Comment {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  position?: { x: number; y: number };
  pageNumber?: number;
  selectedText?: string;
}

interface Article {
  id: string;
  name: string;
  content: string;
  comments: Comment[];
  file: File;
  numPages?: number;
}

interface Folder {
  id: string;
  name: string;
  articles: Article[];
}

interface PDFViewerProps {
  article: Article;
  onCommentCreate: (comment: Comment) => void;
}

interface HumanizeRequest {
  id: string;
  originalText: string;
  humanizedText: string;
  timestamp: Date;
}

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

interface HumanizedPreviewProps {
  result: HumanizeResult;
}

interface HistoryItemProps {
  result: HumanizeResult;
}

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState("homework");
  const [model, setModel] = useState("deepseek:deepseek-reasoner");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [expandedReasoning, setExpandedReasoning] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [articleUrl, setArticleUrl] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: "default", name: "All in One Articles", articles: [] }
  ]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newComment, setNewComment] = useState("");

  // Model parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [topP, setTopP] = useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);

  const { messages, isLoading, input, handleInputChange, handleSubmit } = useChat({
    body: {
      model,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
      systemPrompt,
    },
  });

  const [humanizeText, setHumanizeText] = useState("");
  const [humanizedResults, setHumanizedResults] = useState<HumanizeRequest[]>([]);
  const [isHumanizing, setIsHumanizing] = useState(false);

  const toggleReasoning = (index: number) => {
    setExpandedReasoning((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const components = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      const code = String(children).replace(/\n$/, '');

      return !inline ? (
        <div className="relative rounded-lg overflow-hidden my-2">
          <div className="flex items-center justify-between px-4 py-2 bg-[#282C34] text-gray-200">
            <span className="text-xs font-medium">{language}</span>
            <button
              onClick={() => handleCopyCode(code)}
              className="hover:text-white transition-colors"
            >
              {copiedCode === code ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            className="!bg-[#1E1E1E] !m-0 !p-4 !rounded-b-lg"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      );
    }
  };

  const handleArticleSubmit = async () => {
    // Implement article processing logic
    setArticleSummary("This is a sample summary of the article...");
    setKeyPoints([
      "Key point 1 from the article",
      "Important concept 2",
      "Main takeaway 3"
    ]);
  };

  // New Article Reader Functions
  const createFolder = () => {
    if (newFolderName.trim()) {
      setFolders(prev => [
        ...prev,
        { id: uuidv4(), name: newFolderName, articles: [] }
      ]);
      setNewFolderName("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedFolder) return;

    try {
      const newArticle: Article = {
        id: uuidv4(),
        name: file.name,
        content: "", // Store preview text separately
        comments: [],
        file // Store the original File object
      };

      setFolders(prev => prev.map(folder =>
        folder.id === selectedFolder
          ? { ...folder, articles: [...folder.articles, newArticle] }
          : folder
      ));

      // Generate preview text asynchronously
      try {
        const preview = await readPDFContent(file);
        setFolders(prev => prev.map(folder => ({
          ...folder,
          articles: folder.articles.map(article =>
            article.id === newArticle.id ? { ...article, content: preview } : article
          )
        })));
      } catch (error) {
        console.error("Error generating preview:", error);
      }
    } catch (error) {
      console.error("Error handling PDF:", error);
    }
  };

  const readPDFContent = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          resolve(text.slice(0, 500) + "..."); // Store first 500 chars as preview
        };
        reader.readAsText(file);
      });
      return text;
    } catch (error) {
      console.error("Error reading PDF:", error);
      return "Could not extract text content";
    }
  };

  const addComment = async (isAI: boolean = false) => {
    if (!selectedArticle || (!newComment.trim() && !isAI)) return;
    const comment: Comment = {
      id: uuidv4(),
      text: isAI ? "Analyzing article..." : newComment,
      isAI,
      timestamp: new Date()
    };
    // Update the selected article with new comment
    setFolders(prev =>
      prev.map(folder => ({
        ...folder,
        articles: folder.articles.map(article =>
          article.id === selectedArticle.id
            ? { ...article, comments: [...article.comments, comment] }
            : article
        )
      }))
    );
    if (isAI) {
      // Simulate AI analysis
      setTimeout(() => {
        const aiComment: Comment = {
          id: uuidv4(),
          text: "This is a sample AI analysis of the article content...",
          isAI: true,
          timestamp: new Date()
        };
        setFolders(prev =>
          prev.map(folder => ({
            ...folder,
            articles: folder.articles.map(article =>
              article.id === selectedArticle.id
                ? {
                  ...article,
                  comments: article.comments.map(c =>
                    c.id === comment.id ? aiComment : c
                  )
                }
                : article
            )
          }))
        );
      }, 2000);
    }
    setNewComment("");
  };

  const PDFViewer = ({ article, onCommentCreate }: PDFViewerProps) => {
    const [selectedText, setSelectedText] = useState<string>("");
    const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [numPages, setNumPages] = useState<number>(0);
    const pdfContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (article.file) {
        const url = URL.createObjectURL(article.file);
        setPdfUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }, [article.file]);

    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = pdfContainerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setSelectionPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top
        });
        setSelectedText(selection.toString());
        setCurrentPage(getPageNumberFromElement(range.startContainer));
      }
    };

    const getPageNumberFromElement = (element: Node): number => {
      let pageElement = element.parentElement;
      while (pageElement && !pageElement.classList.contains("react-pdf__Page")) {
        pageElement = pageElement.parentElement;
      }
      return pageElement ? parseInt(pageElement.dataset.pageNumber || "1") : 1;
    };

    const handleAddComment = (isAI: boolean) => {
      if (!selectedText) return;

      const newComment: Comment = {
        id: uuidv4(),
        text: isAI ? "Analyzing..." : "",
        isAI,
        timestamp: new Date(),
        position: selectionPosition,
        pageNumber: currentPage,
        selectedText
      };

      onCommentCreate(newComment);
      window.getSelection()?.removeAllRanges();
      setSelectedText("");
    };

    return (
      <div className="flex h-[calc(100vh-160px)]">
        <div ref={pdfContainerRef} className="flex-1 overflow-auto relative" onMouseUp={handleTextSelection}>
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setFolders(prev => prev.map(folder => ({
                ...folder,
                articles: folder.articles.map(a =>
                  a.id === article.id ? { ...a, numPages } : a
                )
              })));
            }}
            onLoadError={(error) => console.error("PDF load error:", error)}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={pdfContainerRef.current?.clientWidth}
                className="relative mb-4"
              >
                {article.comments
                  .filter(comment => comment.pageNumber === index + 1)
                  .map(comment => comment.position && (
                    <div
                      key={comment.id}
                      className="absolute w-4 h-4 bg-yellow-400 rounded-full cursor-pointer pdf-comment"
                      data-x={comment.position.x - 8}
                      data-y={comment.position.y - 8}
                    />
                  ))}
              </Page>
            ))}
          </Document>

          {selectedText && (
            <div
              className={`absolute z-10 left-[${selectionPosition.x}px] top-[${selectionPosition.y}px]`}
            >
              <div className="flex gap-2 bg-white dark:bg-zinc-800 p-2 rounded shadow-lg">
                <Button size="sm" onClick={() => handleAddComment(false)}>
                  Add Comment
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleAddComment(true)}>
                  AI Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderArticleReader = () => {
    if (selectedArticle) {
      return (
        <div className="flex-1 p-6">
          <Button
            onClick={() => setSelectedArticle(null)}
            variant="ghost"
            className="mb-4"
          >
            ← Back to Folder
          </Button>
          <div className="bg-white dark:bg-zinc-900 rounded-lg">
            <h2 className="text-xl font-bold p-6 border-b dark:border-zinc-800">{selectedArticle.name}</h2>
            <PDFViewer
              article={selectedArticle}
              onCommentCreate={(comment) => {
                setFolders(prev =>
                  prev.map(folder => ({
                    ...folder,
                    articles: folder.articles.map(article =>
                      article.id === selectedArticle.id
                        ? { ...article, comments: [...article.comments, comment] }
                        : article
                    )
                  }))
                );
              }}
            />
          </div>
        </div>
      );
    }
    if (selectedFolder) {
      const folder = folders.find(f => f.id === selectedFolder);
      return (
        <div className="flex-1 p-6">
          <Button
            onClick={() => setSelectedFolder(null)}
            variant="ghost"
            className="mb-4"
          >
            ← Back to Folders
          </Button>
          <div className="mb-6 flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              title="Upload PDF Article"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              Upload PDF Article
            </Button>
            <span className="text-sm text-zinc-500">
              {folder?.articles.length} articles
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folder?.articles.map(article => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <h3 className="font-medium mb-2">{article.name}</h3>
                <div className="text-sm text-zinc-500">
                  {article.content.slice(0, 100)}...
                </div>
                <div className="mt-2 text-xs text-zinc-400">
                  {article.comments.length} comments
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-2">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              className="flex-1 p-2 border rounded-lg"
              onKeyDown={(e) => e.key === "Enter" && createFolder()}
            />
            <Button onClick={createFolder}>
              Create Folder
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map(folder => (
              <div
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className="p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <h3 className="font-medium mb-2">{folder.name}</h3>
                <div className="text-sm text-zinc-500">
                  {folder.articles.length} articles
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const HumanizeAI = () => {
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

    // Helper components defined within HumanizeAI
    const HumanizedPreview = ({ result }: HumanizedPreviewProps) => (
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

    const HistoryItem = ({ result }: HistoryItemProps) => (
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
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Navigation Sidebar */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200">
        <div className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <img src="/favicon.ico" alt="SciStuAI" className="w-6 h-6" />
            <h1 className="text-lg font-semibold">ScistuAI</h1>
          </Link>

          <Button
            variant={activeTab === "homework" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("homework")}
          >
            <Sparkles className="w-4 h-4" />
            Homework Helper
          </Button>
          <Link href={"/article-reader"}>
            <Button
              variant={activeTab === "article" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <BookText className="w-4 h-4" />
              Article Reader
            </Button>
          </Link>
          <Link href={"/humanize-ai"}>
            <Button
              variant={activeTab === "humanize" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Humanize AI
            </Button>
          </Link>

          <Link href={"/resume-analyzer"}>
          <Button
            variant={activeTab === "resume" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <FileText className="w-4 h-4" />
            Resume Analyzer
          </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b dark:border-zinc-800 border-zinc-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium capitalize">{activeTab}</h2>
            {activeTab === "homework" && (
              <Badge variant="outline" className="text-xs">
                {model === "groq:deepseek-r1-distill-llama-70b" 
                  ? "GROK" 
                  : model?.split(":")[1] === "deepseek-reasoner" 
                    ? "deepseek-r" 
                    : model?.split(":")[1]}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {activeTab === "homework" && (
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="max-w-3xl mx-auto space-y-6">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                      >
                        <div className="flex flex-col gap-2 max-w-[480px]">
                          {message.reasoning && (
                            <div className={`${message.role === "user" ? "bg-[#007AFF] text-white" : "bg-[#E9E9EB] dark:bg-[#1C1C1E] text-black dark:text-white"} rounded-[20px] ${message.role === "user" ? "rounded-br-[8px]" : "rounded-bl-[8px]"}`}>
                              <button
                                onClick={() => toggleReasoning(index)}
                                className="w-full flex items-center justify-between px-3 py-2"
                              >
                                <span className="text-xs font-medium opacity-70">
                                  Reasoning
                                </span>
                                {expandedReasoning.includes(index) ? (
                                  <ChevronUp className="w-3 h-3 opacity-70" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 opacity-70" />
                                )}
                              </button>
                              {expandedReasoning.includes(index) && (
                                <div className="px-3 pb-3 text-[12px] opacity-70">
                                  <ReactMarkdown components={components}>
                                    {message.reasoning}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          )}
                          {message.content && (
                            <div className={`${message.role === "user" ? "bg-[#007AFF] text-white" : "bg-[#E9E9EB] dark:bg-[#1C1C1E] text-black dark:text-white"} rounded-[20px] ${message.role === "user" ? "rounded-br-[8px]" : "rounded-bl-[8px]"} px-3 py-2`}>
                              <div className="text-[14px]">
                                <ReactMarkdown components={components}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 dark:bg-zinc-900/50 bg-white rounded-lg p-4"
                    >
                      <div className="w-6 h-6 rounded-full border dark:border-zinc-800 border-zinc-200 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-1 mt-[0.5rem]">
                          <span className="bounce-delay-0 w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce" />
                          <span className="bounce-delay-150 w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce" />
                          <span className="bounce-delay-300 w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t dark:border-zinc-800 border-zinc-200">
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Ask your homework question..."
                      className="min-h-[60px] lg:min-h-[100px] bg-transparent dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200 focus:border-zinc-400 dark:focus:border-zinc-600"
                    />
                    <div className="absolute bottom-3 right-3">
                      <Button
                        size="sm"
                        onClick={(e) => handleSubmit(e)}
                        disabled={isLoading || !input.trim()}
                        className="h-8 bg-white hover:bg-zinc-200 text-black"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Sidebar */}
            <div className="lg:w-80 border-l dark:border-zinc-800 border-zinc-200">
              <div className="h-full">
                <Tabs defaultValue="model" className="h-full flex flex-col">
                  <TabsList className="w-full dark:bg-zinc-900/50 bg-zinc-100 border dark:border-zinc-800 border-zinc-200">
                    <TabsTrigger value="model" className="flex-1 text-xs sm:text-sm">
                      Model
                    </TabsTrigger>
                    <TabsTrigger value="parameters" className="flex-1 text-xs sm:text-sm">
                      Parameters
                    </TabsTrigger>
                    <TabsTrigger value="system" className="flex-1 text-xs sm:text-sm">
                      System
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-y-auto p-4">
                    <TabsContent value="model" className="mt-0 space-y-4 h-full">
                      <div>
                        <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                          Model
                        </label>
                        <Select value={model} onValueChange={setModel}>
                          <SelectTrigger className="dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai:gpt-4o">GPT-4o</SelectItem>
                            <SelectItem value="openai:gpt-4">GPT-4</SelectItem>
                            <SelectItem value="openai:gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="openai:gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="deepseek:deepseek-chat">DeepSeek Chat</SelectItem>
                            <SelectItem value="deepseek:deepseek-coder">DeepSeek Coder</SelectItem>
                            <SelectItem value="deepseek:deepseek-reasoner">DeepSeek-R</SelectItem>
                            <SelectItem value="groq:deepseek-r1-distill-llama-70b">
                              GROK
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="parameters" className="mt-0 space-y-4 h-full">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                            Temperature ({temperature})
                          </label>
                          <Slider
                            value={[temperature]}
                            onValueChange={([value]: [number]) => setTemperature(value)}
                            max={2}
                            step={0.1}
                          />
                        </div>

                        <div>
                          <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                            Max Tokens ({maxTokens})
                          </label>
                          <Slider
                            value={[maxTokens]}
                            onValueChange={([value]: [number]) => setMaxTokens(value)}
                            max={4000}
                            step={100}
                          />
                        </div>

                        <div>
                          <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                            Top P ({topP})
                          </label>
                          <Slider
                            value={[topP]}
                            onValueChange={([value]: number[]) => setTopP(value)}
                            max={1}
                            step={0.1}
                          />
                        </div>

                        <div>
                          <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                            Frequency Penalty ({frequencyPenalty})
                          </label>
                          <Slider
                            value={[frequencyPenalty]}
                            onValueChange={([value]: [number]) => setFrequencyPenalty(value)}
                            max={2}
                            step={0.1}
                          />
                        </div>

                        <div>
                          <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                            Presence Penalty ({presencePenalty})
                          </label>
                          <Slider
                            value={[presencePenalty]}
                            onValueChange={([value]: [number]) => setPresencePenalty(value)}
                            max={2}
                            step={0.1}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="system" className="mt-0 space-y-4 h-full">
                      <div>
                        <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                          System Prompt
                        </label>
                        <Textarea
                          placeholder="Enter a custom system prompt"
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          className="h-[200px] dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200"
                        />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {activeTab === "article" && renderArticleReader()}

        {activeTab === "humanize" && <HumanizeAI />}

      </div>
    </div>
  );
}