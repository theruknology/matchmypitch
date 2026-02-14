"use client"

import { useEffect, useState } from "react"
import { FileText } from "lucide-react"

const mockTranscriptLines = [
  { time: "0:00", text: "Thank you for having me. I'm presenting NexFlow, an AI-powered workflow automation platform." },
  { time: "0:08", text: "We're targeting mid-market B2B companies who waste 40% of their time on repetitive tasks." },
  { time: "0:15", text: "Our proprietary model can understand context across entire workflows and automate end-to-end." },
  { time: "0:24", text: "We've secured 3 pilot enterprise clients generating $45K in monthly recurring revenue." },
  { time: "0:32", text: "Our team includes two ex-Google ML engineers and a former VP of Product from Salesforce." },
  { time: "0:40", text: "We're seeking $2M in seed funding to scale our sales team and expand our model training." },
]

export function TranscriptPanel() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (visibleLines < mockTranscriptLines.length) {
      const timer = setTimeout(() => setVisibleLines((v) => v + 1), 2000)
      return () => clearTimeout(timer)
    }
  }, [visibleLines])

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary-subtle">
          <FileText className="h-4.5 w-4.5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Real-Time Transcript</h2>
          <p className="text-xs text-muted-foreground">Auto-generated from voice input</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {mockTranscriptLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="flex gap-3 animate-fade-in-up"
          >
            <span className="mt-0.5 shrink-0 text-[10px] font-mono font-medium text-violet-500/60">{line.time}</span>
            <p className="text-sm leading-relaxed text-foreground/80">{line.text}</p>
          </div>
        ))}

        {visibleLines < mockTranscriptLines.length && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            <span className="text-xs">Transcribing...</span>
          </div>
        )}
      </div>
    </div>
  )
}
