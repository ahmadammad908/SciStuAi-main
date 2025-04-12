"use client";
import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, ArrowUp, Copy, Check, Share, Sparkles, BookText, FileText, Menu } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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

export default function PlaygroundPage() {
  const [model, setModel] = useState("deepseek:deepseek-reasoner");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [expandedReasoning, setExpandedReasoning] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);

  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [topP, setTopP] = useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, input, handleInputChange, handleSubmit } = useChat({
    body: { model, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, systemPrompt },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, input]);

  // Prevent mobile zoom and scroll issues
  useEffect(() => {
    const handleFocus = () => {
      if (textareaRef.current) {
        // Ensure the cursor is visible without scrolling
        textareaRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('focus', handleFocus);
      return () => textarea.removeEventListener('focus', handleFocus);
    }
  }, []);

  const toggleReasoning = (index: number) => {
    setExpandedReasoning((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const handleShare = async () => {
    setIsShareLoading(true);
    try {
      const shareContent = messages.map(msg => {
        return `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}\n${
          msg.reasoning ? `Reasoning: ${msg.reasoning}\n` : ''
        }`;
      }).join('\n');

      const fullContent = systemPrompt 
        ? `System Prompt: ${systemPrompt}\n\n${shareContent}`
        : shareContent;

      const finalContent = `${fullContent}\n\n---\nModel: ${model}\nTemperature: ${temperature}\nMax Tokens: ${maxTokens}`;

      if (navigator.share) {
        await navigator.share({
          title: 'ScistuAI Conversation',
          text: finalContent,
        });
      } else {
        await navigator.clipboard.writeText(finalContent);
        alert('Conversation copied to clipboard! You can now paste it anywhere.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error instanceof Error && !error.toString().includes('AbortError')) {
        alert('Failed to share. Please try again.');
      }
    } finally {
      setIsShareLoading(false);
    }
  };

  const components = {
    code({ inline, className, children, ...props }: CodeProps) {
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
              aria-label="Copy code"
            >
              {copiedCode === code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            className="!bg-[#1E1E1E] !m-0 !p-4 !rounded-b-lg"
            {...props}
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

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Viewport meta tag for mobile */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-full lg:w-64 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200">
        <div className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <h1 className="text-lg font-semibold">ScistuAI</h1>
          </Link>

          <Button variant="secondary" className="w-full justify-start gap-2">
            <Sparkles className="w-4 h-4" /> Homework Helper
          </Button>

          <Link href="/article-reader">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BookText className="w-4 h-4" /> Article Reader
            </Button>
          </Link>

          <Link href="/humanize-ai">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Sparkles className="w-4 h-4" /> Humanize AI
            </Button>
          </Link>

          <Link href="/resume-analyzer">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <FileText className="w-4 h-4" /> Resume Analyzer
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b dark:border-zinc-800 border-zinc-200">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-medium truncate w-full">Homework Helper</h2>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={handleShare}
              disabled={isShareLoading || messages.length === 0}
              aria-label="Share conversation"
            >
              {isShareLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Share className="w-4 h-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-4 border-b dark:border-zinc-800 border-zinc-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium">Homework Helper</h2>
            <Badge variant="outline" className="text-xs">
              {model === "groq:deepseek-r1-distill-llama-70b"
                ? "GROK"
                : model?.split(":")[1] || model}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare}
              disabled={isShareLoading || messages.length === 0}
            >
              {isShareLoading ? (
                <span className="animate-pulse">Sharing...</span>
              ) : (
                <>
                  <Share className="w-4 h-4 mr-2" /> Share
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-black border-b dark:border-zinc-800 border-zinc-200">
            <div className="p-4 space-y-2">
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Sparkles className="w-4 h-4" /> Homework Helper
              </Button>

              <Link href="/article-reader" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <BookText className="w-4 h-4" /> Article Reader
                </Button>
              </Link>

              <Link href="/humanize-ai" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Sparkles className="w-4 h-4" /> Humanize AI
                </Button>
              </Link>

              <Link href="/resume-analyzer" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" /> Resume Analyzer
                </Button>
              </Link>
            </div>
          </div>
        )}

        <section className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="h-full p-4">
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
                          <div className="rounded-[20px] px-3 py-2 dark:bg-[#1C1C1E] bg-[#E9E9EB]">
                            <button
                              onClick={() => toggleReasoning(index)}
                              className="w-full flex items-center justify-between"
                            >
                              <span className="text-xs font-medium opacity-70">Reasoning</span>
                              {expandedReasoning.includes(index) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            {expandedReasoning.includes(index) && (
                              <div className="text-[12px] opacity-70 mt-2">
                                <ReactMarkdown components={components}>{message.reasoning}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                        )}
                        {message.content && (
                          <div className="rounded-[20px] px-3 py-2 dark:bg-[#1C1C1E] bg-[#E9E9EB]">
                            <ReactMarkdown components={components}>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 items-center"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="animate-pulse">Thinking...</span>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t dark:border-zinc-800 border-zinc-200">
              <form onSubmit={handleSubmit} className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask your homework question..."
                  className="min-h-[60px] bg-transparent dark:bg-zinc-900/50 border dark:border-zinc-800 border-zinc-200 text-base"
                  style={{
                    fontSize: '16px',
                    transform: 'translateZ(0)'
                  }}
                />
                <div className="absolute bottom-3 right-3">
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={isLoading || !input.trim()} 
                    className="h-8 bg-white hover:bg-zinc-200 text-black"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Settings */}
          <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l dark:border-zinc-800 border-zinc-200">
            <Tabs defaultValue="model" className="h-full flex flex-col">
              <TabsList className="w-full dark:bg-zinc-900/50 bg-zinc-100 border dark:border-zinc-800 border-zinc-200">
                <TabsTrigger value="model" className="flex-1 text-xs sm:text-sm">Model</TabsTrigger>
                <TabsTrigger value="parameters" className="flex-1 text-xs sm:text-sm">Parameters</TabsTrigger>
                <TabsTrigger value="system" className="flex-1 text-xs sm:text-sm">System</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="model" className="space-y-4">
                  <label className="text-xs dark:text-zinc-400 text-zinc-600">Model</label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="dark:bg-zinc-900/50 border dark:border-zinc-800">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="openai:gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="openai:gpt-4">GPT-4</SelectItem>
                      <SelectItem value="openai:gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="openai:gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="deepseek:deepseek-chat">DeepSeek Chat</SelectItem>
                      <SelectItem value="deepseek:deepseek-coder">DeepSeek Coder</SelectItem>
                      <SelectItem value="deepseek:deepseek-reasoner">DeepSeek-R</SelectItem>
                      <SelectItem value="groq:deepseek-r1-distill-llama-70b">GROK</SelectItem>
                      <SelectItem value="gemini:gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                      <SelectItem value="gemini:gemini-2.0-flash-lite">Gemini 2.0 Flash-Lite</SelectItem>
                      <SelectItem value="gemini:gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </TabsContent>

                <TabsContent value="parameters" className="space-y-4">
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600">Temperature ({temperature.toFixed(1)})</label>
                    <Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} max={2} step={0.1} />
                  </div>
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600">Max Tokens ({maxTokens})</label>
                    <Slider value={[maxTokens]} onValueChange={([v]) => setMaxTokens(v)} max={4000} step={100} />
                  </div>
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600">Top P ({topP.toFixed(1)})</label>
                    <Slider value={[topP]} onValueChange={([v]) => setTopP(v)} max={1} step={0.1} />
                  </div>
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600">Frequency Penalty ({frequencyPenalty.toFixed(1)})</label>
                    <Slider value={[frequencyPenalty]} onValueChange={([v]) => setFrequencyPenalty(v)} max={2} step={0.1} />
                  </div>
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600">Presence Penalty ({presencePenalty.toFixed(1)})</label>
                    <Slider value={[presencePenalty]} onValueChange={([v]) => setPresencePenalty(v)} max={2} step={0.1} />
                  </div>
                </TabsContent>

                <TabsContent value="system">
                  <label className="text-xs dark:text-zinc-400 text-zinc-600">System Prompt</label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="h-[200px] dark:bg-zinc-900/50 border dark:border-zinc-800"
                    placeholder="Enter system prompt"
                  />
                </TabsContent>
              </div>
            </Tabs>
          </aside>
        </section>
      </main>
    </div>
  );
}