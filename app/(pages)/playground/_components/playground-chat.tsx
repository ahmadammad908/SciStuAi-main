"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"
import { PlaygroundMessage } from "./playground-message"
import { Copy, RotateCw, Send } from "lucide-react"
import { toast } from "sonner"

const AI_MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: 'gemini:gemini-pro', name: 'Gemini Pro' },
  { id: 'gemini:gemini-flash', name: 'Gemini Flash' },
  { id: "claude-2", name: "Claude 2" },
  { id: "deepseek-chat", name: "DeepSeek Chat" },
]

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function PlaygroundChat() {
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedModel) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate API call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content || "No response content",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast.error("Failed to send message")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyAll = () => {
    const conversation = messages
      .map((msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}`)
      .join("\n\n")
    navigator.clipboard.writeText(conversation)
    toast.success("Conversation copied to clipboard")
  }

  const handleClearChat = () => {
    setMessages([])
    toast.info("Chat cleared")
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ahmad Ammad</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            disabled={messages.length === 0}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            disabled={messages.length === 0}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="flex-1 p-4 overflow-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a conversation with the AI
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <PlaygroundMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card>

      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 min-h-[80px] resize-none"
          disabled={isLoading}
          autoFocus
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="h-auto"
        >
          {isLoading ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}