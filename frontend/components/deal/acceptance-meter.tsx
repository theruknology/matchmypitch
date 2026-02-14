"use client"

import { Gauge } from "lucide-react"

interface AcceptanceMeterProps {
  investment: number
  equity: number
}

function calculateProbability(investment: number, equity: number): number {
  const valuation = investment / (equity / 100)
  let score = 50

  if (valuation >= 8_000_000 && valuation <= 15_000_000) score += 25
  else if (valuation >= 5_000_000 && valuation <= 20_000_000) score += 15
  else if (valuation > 25_000_000) score -= 15
  else score += 5

  if (equity >= 8 && equity <= 18) score += 15
  else if (equity > 25) score -= 10
  else if (equity < 5) score -= 15

  if (investment >= 500_000 && investment <= 2_500_000) score += 10
  else if (investment > 3_500_000) score -= 5

  return Math.max(5, Math.min(98, score))
}

function getLabel(prob: number): { text: string; color: string } {
  if (prob >= 80) return { text: "Very Likely", color: "text-violet-300" }
  if (prob >= 60) return { text: "Favorable", color: "text-purple-400" }
  if (prob >= 40) return { text: "Moderate", color: "text-fuchsia-400" }
  return { text: "Unlikely", color: "text-red-400" }
}

export function AcceptanceMeter({ investment, equity }: AcceptanceMeterProps) {
  const probability = calculateProbability(investment, equity)
  const label = getLabel(probability)
  const angle = -90 + (probability / 100) * 180

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary-subtle">
          <Gauge className="h-4.5 w-4.5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Deal Acceptance</h2>
          <p className="text-xs text-muted-foreground">AI-predicted probability</p>
        </div>
      </div>

      {/* Gauge Visualization */}
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-64">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Gradient arc */}
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(263, 70%, 58%)" />
                <stop offset="100%" stopColor="hsl(280, 60%, 50%)" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(probability / 100) * 251.2} 251.2`}
              className="transition-all duration-700 ease-out"
              style={{
                filter: "drop-shadow(0 0 8px hsla(263, 70%, 58%, 0.35))",
              }}
            />
            {/* Needle */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out origin-bottom"
              transform={`rotate(${angle} 100 100)`}
            />
            {/* Center dot */}
            <circle cx="100" cy="100" r="5" fill="hsl(263, 70%, 58%)" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-1 -mt-2">
          <span className="font-display text-4xl font-bold text-foreground">{probability}%</span>
          <span className={`text-sm font-medium ${label.color}`}>{label.text}</span>
        </div>
      </div>
    </div>
  )
}
