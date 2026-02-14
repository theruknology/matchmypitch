"use client"

import { useEffect, useState } from "react"
import { BarChart3, type LucideIcon } from "lucide-react"

interface Investor {
  id: string
  name: string
  color: string
  fitScore: number
  icon: LucideIcon
}

interface InvestorFitMeterProps {
  investors: Investor[]
}

export function InvestorFitMeter({ investors }: InvestorFitMeterProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary-subtle">
          <BarChart3 className="h-4.5 w-4.5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Investor Fit Meter</h2>
          <p className="text-xs text-muted-foreground">How well your startup aligns with each AI investor</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {investors.map((investor, i) => (
          <div key={investor.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <investor.icon className="h-4 w-4" style={{ color: investor.color }} />
                <span className="text-sm font-medium text-foreground">{investor.name}</span>
              </div>
              <span
                className="font-display text-sm font-bold"
                style={{ color: investor.color }}
              >
                {animated ? investor.fitScore : 0}%
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${investor.fitScore}%` : "0%",
                  background: `linear-gradient(90deg, ${investor.color}, ${investor.color}cc)`,
                  transitionDelay: `${i * 0.15}s`,
                  boxShadow: animated ? `0 0 12px ${investor.color}30` : "none",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overall Score */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-br from-violet-950/30 to-purple-950/20 border border-violet-500/10 p-4">
        <span className="text-sm font-medium text-foreground">Overall Compatibility</span>
        <span className="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          {animated ? Math.round(investors.reduce((s, inv) => s + inv.fitScore, 0) / investors.length) : 0}%
        </span>
      </div>
    </div>
  )
}
