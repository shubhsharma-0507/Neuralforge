
"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Bot, User, Sparkles, Copy, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { LoginRequiredModal } from '@/components/ui/login-required-modal'
import { useAuthGuard } from '@/hooks/useAuthGuard'

type MessageType = { role: string; content: string }

function ChatMessage({ message, index }: { message: MessageType; index: number }) {
  const [copied, setCopied] = useState(false)
  const isBot = message.role === 'assistant'

  const copyCode = () => {
    const codeMatch = message.content.match(/```[\s\S]*?```/)
    if (codeMatch) {
      navigator.clipboard.writeText(codeMatch[0].replace(/```\w*\n?/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: isBot ? -20 : 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
        isBot ? 'bg-gradient-to-br from-primary to-accent' : 'bg-secondary'
      }`}>
        {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
      </div>
      <div className={`flex-1 max-w-[85%] ${isBot ? '' : 'text-right'}`}>
        <div className={`inline-block p-4 rounded-2xl ${
          isBot ? 'glass text-left' : 'bg-primary text-primary-foreground'
        }`}>
          <div className="prose prose-invert max-w-none text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-black/30 px-1 py-0.5 rounded">{children}</code>
                  )
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-border">{children}</table>
                    </div>
                  )
                },
                th({ children }) {
                  return <th className="border border-border px-4 py-2 bg-secondary text-left">{children}</th>
                },
                td({ children }) {
                  return <td className="border border-border px-4 py-2">{children}</td>
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatbotSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Auth guard ──────────────────────────────────────────────────
  const { isLoggedIn, showModal, closeModal, guardedAction } = useAuthGuard()

  const [messages,  setMessages]  = useState<MessageType[]>([
    { role: "assistant", content: "Hello! How can I help you today?" }
  ])
  const [input,     setInput]     = useState('')
  const [isTyping,  setIsTyping]  = useState(false)

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const typeMessage = async (text: string) => {
    let currentText = ""
    setMessages(prev => [...prev, { role: "assistant", content: "" }])
    for (let i = 0; i < text.length; i++) {
      currentText += text[i]
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "assistant", content: currentText }
        return updated
      })
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }

  const doSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await response.json()

      // 401 → show login modal
      if (response.status === 401) {
        setMessages(prev => prev.slice(0, -1)) // remove user message
        setInput(userMessage.content)           // restore input
        guardedAction(() => {})
        return
      }

      await typeMessage(data?.reply || data?.choices?.[0]?.message?.content || "No response")
    } catch (error) {
      console.error(error)
      await typeMessage("Sorry, something went wrong. Please try again.")
    } finally {
      setIsTyping(false)
    }
  }

  // Guarded send — shows modal if not logged in
  const sendMessage = () => guardedAction(doSend)

  return (
    <>
      {/* Login Modal */}
      <LoginRequiredModal
        isOpen={showModal}
        onClose={closeModal}
        feature="AI Chatbot"
      />

      <section id="chatbot" ref={sectionRef} className="relative py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                AI Chatbot
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="text-balance">Your Intelligent</span>
                <br />
                <span className="gradient-text">Coding Companion</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
                Engage in natural conversations about your code. Get instant answers,
                explanations, and suggestions powered by advanced AI that understands
                context and learns from your codebase.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Context-aware code understanding',
                  'Multi-language support',
                  'Real-time code suggestions',
                  'Integration with your IDE'
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
              >
                {isLoggedIn
                  ? <Sparkles className="w-4 h-4 mr-2" />
                  : <Lock     className="w-4 h-4 mr-2" />
                }
                Try AI Chatbot
              </Button>

              {!isLoggedIn && (
                <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Login required to use AI Chatbot
                </p>
              )}
            </motion.div>

            {/* RIGHT: Chat UI */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-6 border-glow">
                {/* Chat Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">NeuralForge Assistant</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Online • Ready to help
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-4">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} index={i} />
                  ))}

                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="glass p-4 rounded-2xl">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
onKeyDown={e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}}                    placeholder={isLoggedIn ? "Ask anything about your code..." : "Login to chat with AI..."}
                    className="flex-1 bg-secondary/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                 <Button
  type="button"
  size="icon"
  onClick={sendMessage}
  className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500"
>
  {isLoggedIn ? <Send className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
</Button>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-2xl" />
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}