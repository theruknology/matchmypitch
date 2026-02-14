"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Bot, User, Loader2, Cloud, TrendingUp, Mic, Send } from "lucide-react"

type Message = {
  role: "investor" | "founder" | "thinking"
  name: string
  text: string
  icon: typeof Bot
  color: string
}

const mockConversation: Message[] = [
  {
    role: "investor",
    name: "AWS AI",
    text: "Your architecture sounds interesting. Can you elaborate on your infrastructure costs at scale? What happens when you hit 10x your current load?",
    icon: Cloud,
    color: "text-orange-400",
  },
  {
    role: "founder",
    name: "Founder",
    text: "Great question. We've designed our system on a serverless architecture that auto-scales. At 10x load, our projected cost per transaction actually decreases by 40% due to economies of scale.",
    icon: User,
    color: "text-violet-400",
  },
  {
    role: "investor",
    name: "ClickHouse AI",
    text: "What's your data pipeline look like? How are you handling real-time analytics for your enterprise clients?",
    icon: TrendingUp,
    color: "text-yellow-300",
  },
  {
    role: "founder",
    name: "Founder",
    text: "We use a streaming architecture with event sourcing. Analytics are processed in real-time with sub-second latency. Our enterprise clients get live dashboards with custom metrics.",
    icon: User,
    color: "text-violet-400",
  },
  {
    role: "investor",
    name: "ElevenLabs AI",
    text: "How are you integrating voice and natural language interfaces into your workflow automation? That seems like a key differentiator.",
    icon: Mic,
    color: "text-violet-300",
  },
  {
    role: "founder",
    name: "Founder",
    text: "Absolutely. Users can describe workflows in natural language, and our AI converts that into automated processes. We're also adding voice commands for hands-free operation.",
    icon: User,
    color: "text-violet-400",
  },
  {
    role: "investor",
    name: "Slack AI",
    text: "How does your product integrate with existing team communication tools? Our users live in Slack -- would NexFlow meet them there?",
    icon: MessageSquare,
    color: "text-rose-400",
  },
]

export function QaTimeline() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    if (visibleMessages < mockConversation.length) {
      setIsThinking(true)
      const thinkTimer = setTimeout(() => {
        setIsThinking(false)
        setVisibleMessages((v) => v + 1)
      }, 1800)
      return () => clearTimeout(thinkTimer)
    }
  }, [visibleMessages])

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary-subtle">
          <MessageSquare className="h-4.5 w-4.5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Q&A Session</h2>
          <p className="text-xs text-muted-foreground">Live conversation between AI investors and founder</p>
        </div>
      </div>

      {/* Chat Timeline */}
      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
        {mockConversation.slice(0, visibleMessages).map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fade-in-up ${
              msg.role === "founder" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                msg.role === "founder"
                  ? "gradient-primary-subtle"
                  : "bg-secondary"
              }`}
            >
              <msg.icon className={`h-4 w-4 ${msg.color}`} />
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "founder"
                  ? "bg-gradient-to-br from-violet-500/12 to-purple-500/8 border border-violet-500/15"
                  : "bg-secondary border border-border/50"
              }`}
            >
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${msg.color}`}>
                {msg.name}
              </p>
              <p className="text-sm leading-relaxed text-foreground/85">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {isThinking && visibleMessages < mockConversation.length && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Bot className="h-4 w-4 text-violet-400" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-secondary border border-border/50 px-4 py-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
              <span className="text-xs text-muted-foreground">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Mock Input */}
      <div className="mt-6 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your response..."
          className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
        />
        <button className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white transition-all hover:brightness-110 purple-glow" aria-label="Send message">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
