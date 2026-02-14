"use client"

import { useState } from "react"
import { Mic, MicOff, Radio } from "lucide-react"

export function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary-subtle">
          <Radio className="h-4.5 w-4.5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Voice Input</h2>
          <p className="text-xs text-muted-foreground">
            {isRecording ? "Recording in progress..." : "Click the mic to start your pitch"}
          </p>
        </div>
      </div>

      {/* Mic Button with Waveform */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 ${
            isRecording
              ? "bg-gradient-to-br from-red-600/20 to-rose-600/15 purple-glow-strong"
              : "gradient-primary-subtle hover:bg-violet-500/15"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {/* Pulse rings when recording */}
          {isRecording && (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-violet-500/10" />
              <span className="absolute inset-[-8px] animate-pulse rounded-full border border-violet-500/15" />
            </>
          )}

          {isRecording ? (
            <MicOff className="relative z-10 h-10 w-10 text-red-400" />
          ) : (
            <Mic className="relative z-10 h-10 w-10 text-violet-400" />
          )}
        </button>

        {/* Animated Waveform */}
        <div className="flex h-10 items-end gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isRecording ? "bg-gradient-to-t from-violet-500 to-fuchsia-400" : "bg-muted-foreground/20"
              }`}
              style={{
                height: isRecording
                  ? `${8 + Math.sin((Date.now() / 200) + i * 0.5) * 16 + Math.random() * 8}px`
                  : "8px",
                animation: isRecording
                  ? `waveform ${0.4 + (i % 5) * 0.15}s ease-in-out infinite alternate`
                  : "none",
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isRecording ? "bg-red-400 animate-pulse" : "bg-muted-foreground/30"
            }`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {isRecording ? "LIVE" : "READY"}
          </span>
        </div>
      </div>
    </div>
  )
}
