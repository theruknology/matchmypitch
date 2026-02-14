"use client"

import { useState } from "react"
import { Upload, FileText, Send } from "lucide-react"

interface PitchUploadProps {
  onSubmit: () => void
  hasSubmitted: boolean
}

export function PitchUploadPanel({ onSubmit, hasSubmitted }: PitchUploadProps) {
  const [fileName, setFileName] = useState("")
  const [pitchText, setPitchText] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleSubmit = () => {
    if (pitchText.trim() || fileName) {
      onSubmit()
    }
  }

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary-subtle">
          <Upload className="h-4.5 w-4.5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Upload Your Pitch</h2>
          <p className="text-xs text-muted-foreground">Share your pitch deck or write your pitch below</p>
        </div>
      </div>

      {/* File Upload */}
      <label className="group mb-4 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border p-6 transition-all hover:border-violet-500/30 hover:bg-violet-500/5">
        <input
          type="file"
          className="hidden"
          accept=".pdf,.pptx,.ppt,.doc,.docx"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-2">
          {fileName ? (
            <>
              <FileText className="h-8 w-8 text-violet-400" />
              <span className="text-sm font-medium text-foreground">{fileName}</span>
              <span className="text-xs text-muted-foreground">Click to change file</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-violet-400" />
              <span className="text-sm font-medium text-foreground/80">Drop your pitch deck here</span>
              <span className="text-xs text-muted-foreground">PDF, PPTX, DOCX supported</span>
            </>
          )}
        </div>
      </label>

      {/* Pitch Textarea */}
      <textarea
        className="mb-4 w-full rounded-xl border border-border bg-secondary/50 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/20 resize-none"
        rows={5}
        placeholder="Or write your pitch here... Describe your startup, the problem you're solving, your target market, business model, and traction."
        value={pitchText}
        onChange={(e) => setPitchText(e.target.value)}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={hasSubmitted}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 purple-glow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {hasSubmitted ? (
          "Pitch Submitted"
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Pitch for AI Analysis
          </>
        )}
      </button>
    </div>
  )
}
