'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
// import logger from '@/lib/logger'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  type?: 'text' | 'result'
  resultData?: any[]
  isStreaming?: boolean
}

interface SearchResponse {
  success: boolean
  data: any[] | null
  status: number
  message: string
  errorDetail: string | null
}

export default function ChatDialog() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // Scroll to bottom of messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // 1. Add the user's message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      sender: 'user',
      type: 'text',
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      // 2. Prepare backend request (adapted from your old code)
      const formattedMessages = updatedMessages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: new Date().toISOString(),
      }))

      const response = await fetch('/api/langchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessages,
          userId: session?.user?.id ?? 'cmben86we0000vd8gk890533p',
        }),
      })

      // 3. Handle backend response
      if (!response.ok) throw new Error('Backend error')
      const data = await response.json()

      const botMessage: Message = {
        id: crypto.randomUUID(),
        content:
          data.answer ?? 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        type: 'text',
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          type: 'text',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all z-50"
        onClick={() => setOpen(true)}
        aria-label="Open AI chat"
      >
        <Bot className="w-6 h-6" />
      </Button>
      {/* Chat Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
            <Button
              variant="ghost"
              className="absolute right-4 top-4"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground">
                  Start typing to search for services, appointments, businesses,
                  or customers!
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === 'user'
                        ? 'flex-row-reverse space-x-reverse'
                        : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {message.sender === 'user' ? 'U' : 'AI'}
                      </AvatarFallback>
                      {message.sender === 'bot' && (
                        <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
                      )}
                    </Avatar>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      } ${message.isStreaming ? 'animate-pulse' : ''}`}
                    >
                      {message.type === 'result' ? (
                        <pre className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </pre>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && !messages.some((msg) => msg.isStreaming) && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg animate-pulse">
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
                    </Avatar>
                    <p className="text-sm text-muted-foreground">Typing...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center p-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about services, appointments, etc..."
              className="flex-1 mr-2"
              aria-label="Chat input"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
          
    </>
  )
}
