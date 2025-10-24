'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Logo } from '@/components/Logo'
import { chatbaseService, ChatbaseMessage } from '@/lib/chatbase'
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Loader2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Zap,
  Lightbulb,
  BookOpen,
  Headphones,
  FileText
} from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface QuickReply {
  id: string
  text: string
  icon: any
  category: string
}

export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Omni AI Assistant powered by Chatbase. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [chatId, setChatId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickReplies: QuickReply[] = [
    { id: '1', text: 'What products do you offer?', icon: FileText, category: 'Products' },
    { id: '2', text: 'How can I get support?', icon: Headphones, category: 'Support' },
    { id: '3', text: 'Tell me about your services', icon: BookOpen, category: 'Services' },
    { id: '4', text: 'What are your business hours?', icon: Lightbulb, category: 'General' },
    { id: '5', text: 'How do I place an order?', icon: Zap, category: 'Orders' },
    { id: '6', text: 'Technical documentation', icon: BookOpen, category: 'Documentation' },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    setShowQuickReplies(false)

    try {
      const response = await chatbaseService.sendMessage(inputText, chatId)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply: QuickReply) => {
    setInputText(reply.text)
    setShowQuickReplies(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your Omni AI Assistant powered by Chatbase. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ])
    setShowQuickReplies(true)
    setChatId(undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                onClick={() => router.push('/portal')}
                className="flex items-center gap-2 px-3"
              >
                <ArrowLeft className="h-4 w-4" />

              </Button>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Bot className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">AI Assistant</h1>
                  <p className="text-sm text-slate-600">Powered by Chatbase</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Online
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="flex items-center gap-2 px-4 py-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)]">
          {/* Chat Area */}
          <div className="flex-1 min-w-0">
            <Card className="h-full border-0 shadow-sm">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="space-y-8 max-w-5xl mx-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            message.isUser 
                              ? 'bg-slate-600 text-white ml-4' 
                              : 'bg-blue-100 text-blue-600 mr-4'
                          }`}>
                            {message.isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                          </div>
                          <div className={`flex-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-5 rounded-2xl shadow-sm ${
                              message.isUser
                                ? 'bg-slate-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-900'
                            }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs text-slate-500">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {!message.isUser && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(message.text)}
                                    className="h-7 w-7 p-0 hover:bg-slate-100"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-600"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center space-x-3">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span className="text-sm text-slate-600">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 p-6">
                  <div className="flex items-end space-x-4 max-w-5xl mx-auto">
                    <div className="flex-1">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="min-h-[52px] resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-[52px]"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Replies Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Card className="h-full border-0 shadow-sm">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Replies</h3>
                  <p className="text-sm text-slate-600">Click to ask common questions</p>
                </div>
                
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {quickReplies.map((reply) => {
                    const Icon = reply.icon
                    return (
                      <Button
                        key={reply.id}
                        variant="outline"
                        onClick={() => handleQuickReply(reply)}
                        className="w-full justify-start h-auto p-4 text-left hover:bg-blue-50 hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                            <Icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 leading-relaxed break-words">{reply.text}</p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {reply.category}
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}