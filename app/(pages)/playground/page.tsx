"use client";
import { useEffect } from "react";
import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronDown ,ChevronUp} from 'lucide-react';
import Image from "next/image"; // ✅ NEW: Optimized image import

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Copy, Check, Share, Sparkles, BookText, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {sendChatMessage} from "@/lib/api";
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

  // Model parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [topP, setTopP] = useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);

  const { messages, isLoading, input, handleInputChange, handleSubmit} = useChat({
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
  
  useEffect(() => {
    if (messages.length) {
      console.log("Messages from Gemini AI:", messages); // Debug log to check the messages
    }
  }, [messages]);
  console.log(messages)

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

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Navigation Sidebar */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200">
        <div className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <h1 className="text-lg font-semibold">ScistuAI</h1>
          </Link>

          <Button
            variant="secondary"
            className="w-full justify-start gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Homework Helper
          </Button>

          <Link href="/article-reader">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <BookText className="w-4 h-4" />
              Article Reader
            </Button>
          </Link>

          <Link href="/humanize-ai">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Humanize AI
            </Button>
          </Link>

          <Link href="/resume-analyzer">
            <Button
              variant="ghost"
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
            <h2 className="text-lg font-medium">Homework Helper</h2>
            <Badge variant="outline" className="text-xs">
              {model === "groq:deepseek-r1-distill-llama-70b"
                ? "GROK"
                : model?.split(":")[1] === "deepseek-reasoner"
                  ? "deepseek-r"
                  : model?.startsWith("gemini:")
                    ? model === "gemini:gemini-2.0-flash"
                      ? "Gemini 2.0 Flash"
                      : model === "gemini:gemini-pro"
                        ? "Gemini Pro"
                        : model === "gemini:gemini-1.5-pro"
                          ? "Gemini 1.5 Pro"
                          : "Gemini"
                    : model?.split(":")[1]}
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
                          <SelectItem value="gemini:gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                          <SelectItem value="gemini:gemini-pro">Gemini Pro</SelectItem>
                          <SelectItem value="gemini:gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
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
      </div>
    </div>
  );
}