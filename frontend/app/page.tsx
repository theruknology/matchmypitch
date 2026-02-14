"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Zap, ArrowRight, Brain, Mic, Shield, Briefcase, Rocket, Search } from "lucide-react"
import { PlasmaBackground } from "@/components/plasma-background"

const features = [
  {
    icon: Brain,
    title: "AI Pitch Analysis",
    description: "Upload your pitch and receive instant AI-powered evaluation across multiple investment dimensions.",
  },
  {
    icon: Mic,
    title: "Live Voice Pitch",
    description: "Pitch to AI investors in real-time with voice recognition and interactive Q&A sessions.",
  },
  {
    icon: Search,
    title: "Startup Discovery",
    description: "Investors can filter startups by sector, funding needs, and AI-scored metrics to find the best match.",
  },
  {
    icon: Shield,
    title: "Smart Due Diligence",
    description: "AI investors analyze market fit, risk factors, and competitive landscape automatically.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* Plasma wave background */}
        <PlasmaBackground />

        {/* Dark overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-background/20" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-8 animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-sm font-medium text-foreground">AI-Powered Investment Platform</span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-foreground animate-fade-in-up md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
            <span className="text-balance">Where visionary ideas</span>
            <br />
            <span className="text-balance">meet strategic capital</span>
          </h1>

          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-fade-in-up md:text-xl" style={{ animationDelay: "0.2s" }}>
            Choose your role and let AI bridge the gap between founders and investors.
          </p>

          {/* Role Selection Buttons */}
          <div className="flex flex-col items-center gap-4 animate-fade-in-up sm:flex-row" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-8 py-3.5 text-base font-semibold text-background transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
            >
              <Rocket className="h-4.5 w-4.5" />
              I am a Startup Founder
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/investor"
              className="group inline-flex items-center gap-2.5 rounded-full border border-muted-foreground/30 bg-muted-foreground/10 px-8 py-3.5 text-base font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-muted-foreground/50 hover:text-foreground hover:scale-[1.03]"
            >
              <Briefcase className="h-4.5 w-4.5" />
              I am an Investor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">A complete AI investment experience from pitch to partnership.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass group rounded-2xl p-8 transition-all duration-300 hover:purple-border animate-fade-in-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg gradient-primary-subtle">
                  <feature.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-foreground">MatchmyPitch<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> AI</span></span>
          </div>

        </div>
      </footer>
    </div>
  )
}
