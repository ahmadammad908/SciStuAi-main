// app/(main)/article-reader/page.tsx
"use client";
import Image from "next/image"; // ✅ NEW: Optimized image import

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Button } from "@/components/ui/button";
import { Sparkles, BookText, FileText, Menu, X } from "lucide-react";

import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Share } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

const PDFViewer = ({ article, onCommentCreate }: PDFViewerProps) => {

  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // NEW: Mobile menu state


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

export default function ArticleReaderPage() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: "default", name: "All in One Articles", articles: [] }
  ]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newComment, setNewComment] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // NEW: Mobile menu state


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
        content: "",
        comments: [],
        file
      };

      setFolders(prev => prev.map(folder =>
        folder.id === selectedFolder
          ? { ...folder, articles: [...folder.articles, newArticle] }
          : folder
      ));

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
          resolve(text.slice(0, 500) + "...");
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

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Navigation Sidebar */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200 hidden md:block">
        <div className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Image
              src="/favicon.ico"
              alt="SciStuAI"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h1 className="text-lg font-semibold">ScistuAI</h1>
          </Link>

          <Link href="/homework-helper">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Sparkles className="w-4 h-4" />
              Homework Helper
            </Button>
          </Link>

          <Link href="/article-reader">
            <Button variant="secondary" className="w-full justify-start gap-2">
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
        <header className="md:hidden flex items-center justify-between p-4 border-b dark:border-zinc-800 border-zinc-200">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              
            </Button>
            <h2 className="text-lg font-medium truncate w-full">Article Reader</h2>
            <Badge variant="outline" className="text-xs truncate w-full">
              PDF Viewer
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </header>
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-4 border-b dark:border-zinc-800 border-zinc-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium">Article Reader</h2>
            <Badge variant="outline" className="text-xs">
              PDF Viewer
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" /> Share
            </Button>
          </div>
        </header>
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
                <Button variant="secondary" className="w-full justify-start gap-2">
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
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Resume Analyzer
                </Button>
              </Link>
            </div>
          </div>
        )}


        {/* Article Reader Content */}
        {selectedArticle ? (
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
        ) : selectedFolder ? (
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
                {folders.find(f => f.id === selectedFolder)?.articles.length} articles
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.find(f => f.id === selectedFolder)?.articles.map(article => (
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
        ) : (
          <div className="flex-1 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder name"
                  className="flex-1 min-w-0 p-2 border rounded-lg" // min-w-0 prevents overflow
                  onKeyDown={(e) => e.key === "Enter" && createFolder()}
                />
                <Button onClick={createFolder} className="sm:w-auto w-full">
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
        )}
      </div>
    </div>
  );
}