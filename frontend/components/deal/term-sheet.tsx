"use client"

import { FileText, Download, CheckCircle2 } from "lucide-react"

interface TermSheetProps {
  investment: number
  equity: number
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function TermSheet({ investment, equity }: TermSheetProps) {
  const valuation = Math.round(investment / (equity / 100))
  const postMoney = valuation
  const preMoney = postMoney - investment

  const terms = [
    { label: "Investment Amount", value: formatCurrency(investment) },
    { label: "Equity Stake", value: `${equity}%` },
    { label: "Pre-Money Valuation", value: formatCurrency(preMoney) },
    { label: "Post-Money Valuation", value: formatCurrency(postMoney) },
    { label: "Investment Type", value: "Seed Round -- Priced Equity" },
    { label: "Share Class", value: "Series Seed Preferred" },
    { label: "Liquidation Preference", value: "1x Non-Participating" },
    { label: "Anti-Dilution", value: "Broad-Based Weighted Average" },
    { label: "Board Seat", value: equity >= 15 ? "1 Investor Seat" : "Observer Rights Only" },
    { label: "Pro-Rata Rights", value: "Yes -- for future rounds" },
    { label: "Vesting Schedule", value: "4-year, 1-year cliff" },
    { label: "Information Rights", value: "Quarterly financials & annual audits" },
  ]

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary-subtle">
            <FileText className="h-4.5 w-4.5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Term Sheet Preview</h2>
            <p className="text-xs text-muted-foreground">Auto-generated from deal parameters</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80">
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      {/* Term Sheet Document */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-secondary/40 to-secondary/20 p-6">
        {/* Header */}
        <div className="mb-6 border-b border-border/50 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">TERM SHEET</h3>
              <p className="text-xs text-muted-foreground">Confidential -- For Discussion Purposes Only</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Date Issued</p>
              <p className="text-sm font-medium text-foreground">{formatDate()}</p>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-gradient-to-br from-violet-950/20 to-purple-950/10 border border-violet-500/8 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Investor</p>
            <p className="text-sm font-medium text-foreground">MatchmyPitch AI Syndicate</p>
            <p className="text-xs text-muted-foreground">Multi-investor AI consortium</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-violet-950/20 to-purple-950/10 border border-violet-500/8 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Company</p>
            <p className="text-sm font-medium text-foreground">NexFlow Inc.</p>
            <p className="text-xs text-muted-foreground">Delaware C-Corporation</p>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="flex flex-col gap-0 rounded-xl border border-border/50 overflow-hidden">
          {terms.map((term, i) => (
            <div
              key={term.label}
              className={`flex items-center justify-between px-4 py-3 ${
                i !== terms.length - 1 ? "border-b border-border/30" : ""
              } ${i % 2 === 0 ? "bg-violet-950/10" : ""}`}
            >
              <span className="text-xs text-muted-foreground">{term.label}</span>
              <span className="text-sm font-medium text-foreground">{term.value}</span>
            </div>
          ))}
        </div>

        {/* Key Conditions */}
        <div className="mt-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Key Conditions</p>
          <div className="flex flex-col gap-2">
            {[
              "Satisfactory completion of due diligence",
              "Approval of final legal documentation",
              "No material adverse change prior to closing",
              "Customary representations and warranties",
            ].map((condition) => (
              <div key={condition} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                <span className="text-xs leading-relaxed text-foreground/80">{condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Lines */}
        <div className="mt-8 grid gap-6 border-t border-border/50 pt-6 sm:grid-cols-2">
          <div>
            <div className="mb-2 h-px w-full bg-border" />
            <p className="text-xs text-muted-foreground">Investor Representative</p>
          </div>
          <div>
            <div className="mb-2 h-px w-full bg-border" />
            <p className="text-xs text-muted-foreground">Company Representative</p>
          </div>
        </div>
      </div>
    </div>
  )
}
