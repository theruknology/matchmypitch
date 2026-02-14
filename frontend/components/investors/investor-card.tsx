"use client"

import { MessageCircle, Handshake, X, type LucideIcon } from "lucide-react"

interface Investor {
  id: string
  name: string
  role: string
  description: string
  icon: LucideIcon
  color: string
  fitScore: number
  interests: string[]
  verdict: string
}

interface InvestorCardProps {
  investor: Investor
  isSelected: boolean
  onSelect: () => void
  delay: number
}

export function InvestorCard({ investor, isSelected, onSelect, delay }: InvestorCardProps) {
  return (
    <div
      className={`glass rounded-2xl p-6 transition-all duration-300 cursor-pointer animate-fade-in-up ${
        isSelected ? "purple-border scale-[1.02]" : "hover:purple-border"
      }`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border"
          style={{
            background: `${investor.color}15`,
            borderColor: `${investor.color}25`,
          }}
        >
          <investor.icon className="h-5 w-5" style={{ color: investor.color }} />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{investor.name}</h3>
          <p className="text-[11px] text-muted-foreground">{investor.role}</p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{investor.description}</p>

      {/* Interest Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {investor.interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
            style={{
              borderColor: `${investor.color}20`,
              color: investor.color,
              background: `${investor.color}08`,
            }}
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Expanded Content */}
      {isSelected && (
        <div className="animate-fade-in">
          <div className="mb-4 rounded-xl bg-gradient-to-br from-violet-950/30 to-purple-950/20 border border-violet-500/10 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">AI Verdict</p>
            <p className="text-xs leading-relaxed text-foreground/80">{investor.verdict}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg gradient-primary-subtle px-3 py-2 text-[11px] font-medium text-violet-300 transition-all hover:brightness-125">
              <MessageCircle className="h-3 w-3" />
              Ask
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg gradient-accent-subtle px-3 py-2 text-[11px] font-medium text-fuchsia-300 transition-all hover:brightness-125">
              <Handshake className="h-3 w-3" />
              Deal
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/8 px-3 py-2 text-[11px] font-medium text-red-400 transition-colors hover:bg-red-500/15">
              <X className="h-3 w-3" />
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Fit Score Badge */}
      {!isSelected && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground">Investor Fit</span>
          <span
            className="font-display text-sm font-bold"
            style={{ color: investor.color }}
          >
            {investor.fitScore}%
          </span>
        </div>
      )}
    </div>
  )
}
