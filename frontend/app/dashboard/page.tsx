"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { PitchUploadPanel } from "@/components/dashboard/pitch-upload"
import { PitchSummaryPanel } from "@/components/dashboard/pitch-summary"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { AiSuggestions } from "@/components/dashboard/ai-suggestions"

export default function DashboardPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false)

  return (
    <div className="min-h-screen bg-background grid-bg ambient-glow">
      <Navigation />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Founder Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload your pitch, get AI-powered analysis, and track your startup metrics.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column: Upload + Summary */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            <PitchUploadPanel onSubmit={() => setHasSubmitted(true)} hasSubmitted={hasSubmitted} />
            <PitchSummaryPanel visible={hasSubmitted} />
          </div>

          {/* Right Column: Metrics + Suggestions */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <MetricsCards animate={hasSubmitted} />
            <AiSuggestions visible={hasSubmitted} />
          </div>
        </div>
      </main>
    </div>
  )
}
