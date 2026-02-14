"use client"

import { Zap } from "lucide-react"

export function InvestorScene() {
  return (
    <div className="glass purple-border rounded-2xl p-1 animate-fade-in-up">
      <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-violet-950/30 to-purple-950/20 md:h-56">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary-subtle animate-float">
            <Zap className="h-7 w-7 text-violet-400" />
          </div>
          <p className="text-sm font-medium text-foreground/70">Investor Room 3D Scene</p>
          <p className="text-xs text-muted-foreground/60">Spline integration placeholder</p>
        </div>
      </div>
    </div>
  )
}
