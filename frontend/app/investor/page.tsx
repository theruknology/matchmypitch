"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import {
  ArrowRight,
  ArrowLeft,
  Mic,
  Search,
  MessageSquare,
  Send,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Zap,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Mock Data ──────────────────────────────────────────────────────────────────

const SECTORS = ["SaaS", "FinTech", "HealthTech", "AI/ML", "EdTech", "CleanTech"] as const

const STARTUPS = [
  {
    id: 1,
    name: "MediSync",
    sector: "HealthTech",
    fundingAsk: "$2.5M",
    equity: "12%",
    marketFit: 87,
    riskScore: 32,
    traction: 74,
    summary:
      "MediSync is a cloud-based platform that unifies electronic health records across hospitals, enabling real-time patient data sharing and reducing diagnostic errors by up to 40%.",
    highlights: [
      "Signed LOIs with 3 regional hospital networks",
      "15K monthly active users in beta",
      "Patent-pending NLP engine for medical notes",
    ],
    risks: [
      "Regulatory approval timelines (HIPAA, FDA)",
      "High customer acquisition cost in healthcare",
      "Dependency on hospital IT infrastructure",
    ],
  },
  {
    id: 2,
    name: "FinLedger",
    sector: "FinTech",
    fundingAsk: "$1.8M",
    equity: "10%",
    marketFit: 79,
    riskScore: 45,
    traction: 68,
    summary:
      "FinLedger automates bookkeeping and compliance reporting for SMBs using AI, reducing accounting overhead by 60% and enabling real-time financial insights.",
    highlights: [
      "500+ paying SMB customers",
      "Integration with QuickBooks, Xero, Stripe",
      "MRR growing 18% month-over-month",
    ],
    risks: [
      "Crowded market with established competitors",
      "Thin margins on SMB pricing tier",
      "Need for SOC 2 Type II certification",
    ],
  },
  {
    id: 3,
    name: "EduVerse",
    sector: "EdTech",
    fundingAsk: "$3M",
    equity: "15%",
    marketFit: 82,
    riskScore: 38,
    traction: 71,
    summary:
      "EduVerse is an immersive learning platform using spatial computing and AI tutors to deliver personalized K-12 STEM education in underserved communities.",
    highlights: [
      "Pilot programs in 12 school districts",
      "90% student engagement rate in trials",
      "Strategic partnership with a major hardware OEM",
    ],
    risks: [
      "Hardware dependency increases deployment cost",
      "Long sales cycles with public school budgets",
      "Content development is time-intensive",
    ],
  },
  {
    id: 4,
    name: "GreenGrid AI",
    sector: "CleanTech",
    fundingAsk: "$5M",
    equity: "8%",
    marketFit: 91,
    riskScore: 28,
    traction: 83,
    summary:
      "GreenGrid AI optimizes energy distribution for renewable microgrids using predictive AI, helping utilities reduce waste by 35% and cut costs for end consumers.",
    highlights: [
      "Live deployment with 2 utility companies",
      "$1.2M ARR with 140% net revenue retention",
      "Team includes former Tesla and Google DeepMind engineers",
    ],
    risks: [
      "Capital-intensive infrastructure deals",
      "Regulatory variance across states",
      "Long enterprise sales cycles (6-12 months)",
    ],
  },
  {
    id: 5,
    name: "CodePilot",
    sector: "AI/ML",
    fundingAsk: "$4M",
    equity: "10%",
    marketFit: 88,
    riskScore: 35,
    traction: 77,
    summary:
      "CodePilot provides AI-powered code review and automated refactoring for enterprise engineering teams, reducing bug rates by 50% and cutting review time by 70%.",
    highlights: [
      "Used by 3 Fortune 500 engineering teams",
      "Supports 12 programming languages",
      "SOC 2 Type II certified",
    ],
    risks: [
      "Competition from GitHub Copilot ecosystem",
      "Enterprise sales require long POC periods",
      "Model accuracy varies across niche frameworks",
    ],
  },
  {
    id: 6,
    name: "AgriSense",
    sector: "SaaS",
    fundingAsk: "$1.5M",
    equity: "14%",
    marketFit: 76,
    riskScore: 42,
    traction: 62,
    summary:
      "AgriSense is a SaaS platform for precision agriculture that uses satellite imagery and IoT sensors to give farmers real-time crop health analytics and yield predictions.",
    highlights: [
      "Active on 200+ farms across 3 states",
      "Partnerships with 2 agricultural co-ops",
      "Average 22% yield improvement for users",
    ],
    risks: [
      "Seasonal revenue patterns",
      "Farmer adoption of technology is slow",
      "IoT sensor hardware margins are thin",
    ],
  },
]

// ── Helpers ─────────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  const color =
    label === "Risk Score"
      ? value > 50
        ? "bg-red-500"
        : value > 30
          ? "bg-amber-500"
          : "bg-emerald-500"
      : value > 75
        ? "bg-emerald-500"
        : value > 50
          ? "bg-amber-500"
          : "bg-red-500"

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Profile", "Discover", "Detail", "Chat"]
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
              i < current
                ? "bg-violet-500 text-white"
                : i === current
                  ? "border-2 border-violet-500 text-violet-400"
                  : "border border-border/50 text-muted-foreground"
            )}
          >
            {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span
            className={cn(
              "hidden text-xs font-medium sm:inline",
              i <= current ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {labels[i]}
          </span>
          {i < total - 1 && <div className={cn("mx-1 h-px w-6 sm:w-10", i < current ? "bg-violet-500" : "bg-border/50")} />}
        </div>
      ))}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────────

export default function InvestorPage() {
  const [step, setStep] = useState(0)

  // Step 0: Profiling state
  const [investAmount, setInvestAmount] = useState(500_000)
  const [equityRange, setEquityRange] = useState([5, 20])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])

  // Step 1: Discovery
  const [searchQuery, setSearchQuery] = useState("")

  // Step 2: Detail
  const [selectedStartup, setSelectedStartup] = useState<(typeof STARTUPS)[0] | null>(null)

  // Step 3: Chat
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([])
  const [chatInput, setChatInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredStartups = STARTUPS.filter((s) => {
    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(s.sector)
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.sector.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSector && matchesSearch
  })

  function formatCurrency(val: number) {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
    return `$${(val / 1_000).toFixed(0)}K`
  }

  function handleSendMessage() {
    if (!chatInput.trim() || !selectedStartup) return
    const userMsg = chatInput.trim()
    setMessages((prev) => [...prev, { role: "user", text: userMsg }])
    setChatInput("")

    // Simulated AI response
    {/* TODO: Real-time chat with AI responses */}
    setTimeout(() => {
      const responses = [
        `Great question. At ${selectedStartup.name}, we've focused heavily on unit economics. Our current CAC payback period is under 8 months and improving each quarter.`,
        `We see ${selectedStartup.sector} as a massive tailwind. Our competitive moat comes from proprietary data and deep domain expertise that takes years to replicate.`,
        `Our team has a combined 40+ years in this space. The founding team previously built and exited a company in a related vertical, so we understand the playbook.`,
        `We're targeting a ${selectedStartup.equity} equity allocation at this stage because we believe the valuation is fair given our traction and the market opportunity ahead.`,
        `Absolutely. We have detailed financial models and projections we can share. Our burn rate is conservative and the funding ask of ${selectedStartup.fundingAsk} gives us 18+ months of runway.`,
      ]
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: responses[Math.floor(Math.random() * responses.length)] },
      ])
    }, 1200)
  }

  function openStartupDetail(startup: (typeof STARTUPS)[0]) {
    setSelectedStartup(startup)
    setStep(2)
  }

  function startChat() {
    setMessages([
      {
        role: "ai",
        text: `Hi! I'm the AI representative for ${selectedStartup?.name}. I'd be happy to answer any questions you have about our startup, business model, traction, or funding needs. What would you like to know?`,
      },
    ])
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6">
        {/* Step Indicator */}
        <div className="mb-10 flex flex-col items-center gap-6">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Investor Portal</h1>
          <StepIndicator current={step} total={4} />
        </div>

        {/* ── Step 0: Investor Profiling ────────────────────────────────────── */}
        {step === 0 && (
          <div className="animate-fade-in-up space-y-8">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="mb-6 font-display text-xl font-semibold text-foreground">Investment Preferences</h2>

              {/* Amount Slider */}
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Investment Amount</label>
                  <span className="text-sm font-semibold text-violet-400">{formatCurrency(investAmount)}</span>
                </div>
                <input
                  type="range"
                  min={50_000}
                  max={10_000_000}
                  step={50_000}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>$50K</span>
                  <span>$10M</span>
                </div>
              </div>

              {/* Equity Range */}
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Preferred Equity Range</label>
                  <span className="text-sm font-semibold text-violet-400">
                    {equityRange[0]}% &ndash; {equityRange[1]}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={equityRange[0]}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setEquityRange([Math.min(val, equityRange[1] - 1), equityRange[1]])
                    }}
                    className="w-full accent-violet-500"
                  />
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={equityRange[1]}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setEquityRange([equityRange[0], Math.max(val, equityRange[0] + 1)])
                    }}
                    className="w-full accent-violet-500"
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>1%</span>
                  <span>40%</span>
                </div>
              </div>

              {/* Sector Preferences */}
              <div className="mb-8">
                <label className="mb-3 block text-sm font-medium text-muted-foreground">Sector Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((sector) => {
                    const active = selectedSectors.includes(sector)
                    return (
                      <button
                        key={sector}
                        onClick={() =>
                          setSelectedSectors((prev) =>
                            active ? prev.filter((s) => s !== sector) : [...prev, sector]
                          )
                        }
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-all",
                          active
                            ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                            : "border border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                      >
                        {sector}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Voice Profiling Placeholder */}
              <div className="mb-8 flex items-center gap-4 rounded-xl border border-border/30 bg-secondary/30 px-5 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                  <Mic className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Voice Profiling</p>
                  <p className="text-xs text-muted-foreground">
                    {/* TODO: ElevenLabs voice integration */}
                    Voice-based profiling powered by ElevenLabs coming soon.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="group mx-auto flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90"
            >
              Find Matching Startups
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* ── Step 1: Startup Discovery ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in-up space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border/40 bg-secondary/40 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-violet-500/50 sm:w-72"
                />
              </div>
            </div>

            {filteredStartups.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <Search className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No startups match your criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStartups.map((startup) => (
                  <button
                    key={startup.id}
                    onClick={() => openStartupDetail(startup)}
                    className="glass group flex flex-col gap-4 rounded-2xl p-6 text-left transition-all duration-300 hover:purple-border"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-foreground">{startup.name}</h3>
                      <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                        {startup.sector}
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Ask</p>
                        <p className="font-medium text-foreground">{startup.fundingAsk}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Equity</p>
                        <p className="font-medium text-foreground">{startup.equity}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <ScoreBar label="Market Fit" value={startup.marketFit} icon={TrendingUp} />
                      <ScoreBar label="Risk Score" value={startup.riskScore} icon={ShieldAlert} />
                      <ScoreBar label="Traction" value={startup.traction} icon={BarChart3} />
                    </div>

                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Startup Detail ────────────────────────────────────────── */}
        {step === 2 && selectedStartup && (
          <div className="animate-fade-in-up space-y-6">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Discovery
            </button>

            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{selectedStartup.name}</h2>
                  <span className="mt-1 inline-block rounded-full bg-violet-500/15 px-3 py-0.5 text-xs font-medium text-violet-400">
                    {selectedStartup.sector}
                  </span>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Funding Ask</p>
                    <p className="text-lg font-semibold text-foreground">{selectedStartup.fundingAsk}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Equity</p>
                    <p className="text-lg font-semibold text-foreground">{selectedStartup.equity}</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-8">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Pitch Summary</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{selectedStartup.summary}</p>
              </div>

              {/* Metrics */}
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/30 bg-secondary/20 p-4">
                  <ScoreBar label="Market Fit" value={selectedStartup.marketFit} icon={TrendingUp} />
                </div>
                <div className="rounded-xl border border-border/30 bg-secondary/20 p-4">
                  <ScoreBar label="Risk Score" value={selectedStartup.riskScore} icon={ShieldAlert} />
                </div>
                <div className="rounded-xl border border-border/30 bg-secondary/20 p-4">
                  <ScoreBar label="Traction" value={selectedStartup.traction} icon={BarChart3} />
                </div>
              </div>

              {/* Highlights & Risks */}
              <div className="mb-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Highlights</h3>
                  <ul className="space-y-2">
                    {selectedStartup.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Risk Indicators</h3>
                  <ul className="space-y-2">
                    {selectedStartup.risks.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={startChat}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90"
              >
                <MessageSquare className="h-4 w-4" />
                Start Conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Chat ──────────────────────────────────────────────────── */}
        {step === 3 && selectedStartup && (
          <div className="animate-fade-in-up space-y-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {selectedStartup.name}
            </button>

            <div className="glass flex h-[60vh] flex-col rounded-2xl">
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                  <MessageSquare className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Chat with {selectedStartup.name}</p>
                  <p className="text-xs text-muted-foreground">AI-powered founder representative</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-violet-500/20 text-foreground"
                            : "bg-secondary/60 text-foreground"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-border/30 px-4 py-3 sm:px-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    placeholder="Ask about the startup..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 rounded-full border border-border/40 bg-secondary/40 px-5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-violet-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-500 text-white transition-opacity disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                {/* TODO: AI backend for real startup data */}
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Responses are AI-generated simulations.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
