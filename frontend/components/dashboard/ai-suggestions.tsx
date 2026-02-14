"use client"

import { Lightbulb, ArrowUpRight } from "lucide-react"

interface AiSuggestionsProps {
  visible: boolean
}

const suggestions = [
  {
    title: "Strengthen Revenue Projections",
    detail: "Include a 3-year financial model with unit economics breakdowns. Investors want to see CAC, LTV, and payback period.",
  },
  {
    title: "Add Competitive Moat Analysis",
    detail: "Articulate your defensibility beyond technology -- network effects, data moats, or switching costs.",
  },
  {
    title: "Showcase Customer Testimonials",
    detail: "Add 2-3 pilot customer quotes with measurable outcomes to strengthen social proof.",
  },
  {
    title: "Clarify Go-to-Market Strategy",
    detail: "Detail your acquisition channels and prioritize them by expected ROI for the next 12 months.",
  },
]

export function AiSuggestions({ visible }: AiSuggestionsProps) {
  if (!visible) return null

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/12 to-orange-400/8">
          <Lightbulb className="h-4.5 w-4.5 text-amber-400" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Improve Your Pitch</h2>
          <p className="text-xs text-muted-foreground">AI-generated suggestions to boost investor appeal</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {suggestions.map((suggestion, i) => (
          <div
            key={suggestion.title}
            className="group cursor-pointer rounded-xl border border-border/50 p-3.5 transition-all hover:border-violet-500/25 hover:bg-violet-500/5 animate-fade-in-up"
            style={{ animationDelay: `${0.1 * (i + 2)}s` }}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-violet-400" />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{suggestion.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
