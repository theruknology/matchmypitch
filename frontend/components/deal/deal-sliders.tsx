"use client"

import { DollarSign, Percent } from "lucide-react"

interface DealSlidersProps {
  investment: number
  equity: number
  onInvestmentChange: (value: number) => void
  onEquityChange: (value: number) => void
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

export function DealSliders({ investment, equity, onInvestmentChange, onEquityChange }: DealSlidersProps) {
  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up">
      <h2 className="mb-6 font-display text-lg font-semibold text-foreground">Deal Terms</h2>

      {/* Investment Amount */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-foreground">Investment Amount</span>
          </div>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {formatCurrency(investment)}
          </span>
        </div>

        <input
          type="range"
          min={100000}
          max={5000000}
          step={50000}
          value={investment}
          onChange={(e) => onInvestmentChange(Number(e.target.value))}
          className="w-full appearance-none h-2 rounded-full bg-secondary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-violet-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_12px_hsla(263,70%,58%,0.4)] [&::-webkit-slider-thumb]:cursor-pointer"
        />

        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>$100K</span>
          <span>$5M</span>
        </div>
      </div>

      {/* Equity Percentage */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-fuchsia-400" />
            <span className="text-sm font-medium text-foreground">Equity Offered</span>
          </div>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            {equity}%
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={40}
          step={0.5}
          value={equity}
          onChange={(e) => onEquityChange(Number(e.target.value))}
          className="w-full appearance-none h-2 rounded-full bg-secondary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-fuchsia-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:shadow-[0_0_12px_hsla(280,60%,50%,0.4)] [&::-webkit-slider-thumb]:cursor-pointer"
        />

        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>1%</span>
          <span>40%</span>
        </div>
      </div>

      {/* Implied Valuation */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-violet-950/30 to-purple-950/20 border border-violet-500/10 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Implied Valuation</span>
          <span className="font-display text-lg font-bold text-foreground">
            {formatCurrency(Math.round(investment / (equity / 100)))}
          </span>
        </div>
      </div>
    </div>
  )
}
