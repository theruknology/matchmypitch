"use client"

import { Navigation } from "@/components/navigation"
import { VoiceInput } from "@/components/pitch/voice-input"
import { TranscriptPanel } from "@/components/pitch/transcript-panel"
import { QaTimeline } from "@/components/pitch/qa-timeline"

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Live Pitch Interface
          </h1>
          <p className="mt-2 text-muted-foreground">
            Present your startup to AI investors in real-time. Speak, get transcribed, and answer questions.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Voice + Transcript */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <VoiceInput />
            <TranscriptPanel />
          </div>

          {/* Right: Q&A Timeline */}
          <div className="lg:col-span-3">
            <QaTimeline />
          </div>
        </div>
      </main>
    </div>
  )
}
