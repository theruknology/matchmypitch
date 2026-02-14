"use client"

import { useEffect, useState } from "react"
import { Target, ShieldAlert, Users } from "lucide-react"

interface MetricsCardsProps {
  animate: boolean
}

const metrics = [
  {
    icon: Target,
    label: "Market Fit",
    value: 87,
    suffix: "%",
    color: "text-violet-400",
    gradient: "from-violet-500 to-purple-500",
    description: "Strong alignment with target market needs",
  },
  {
    icon: ShieldAlert,
    label: "Risk Score",
    value: 34,
    suffix: "%",
    color: "text-fuchsia-400",
    gradient: "from-fuchsia-500 to-pink-500",
    description: "Moderate risk profile -- competitive landscape",
  },
  {
    icon: Users,
    label: "Investor Match",
    value: 92,
    suffix: "%",
    color: "text-purple-400",
    gradient: "from-purple-500 to-indigo-500",
    description: "High compatibility with AI-focused investors",
  },
]

export function MetricsCards({ animate }: MetricsCardsProps) {
  const [progress, setProgress] = useState(metrics.map(() => 0))

  useEffect(() => {
    if (!animate) return
    const timer = setTimeout(() => {
      setProgress(metrics.map((m) => m.value))
    }, 300)
    return () => clearTimeout(timer)
  }, [animate])

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold text-foreground">Startup Metrics</h2>
      {metrics.map((metric, i) => (
        <div
          key={metric.label}
          className="glass rounded-2xl p-5 animate-fade-in-up"
          style={{ animationDelay: `${0.15 * i}s` }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
            </div>
            <span className={`font-display text-2xl font-bold ${metric.color}`}>
              {animate ? progress[i] : 0}{metric.suffix}
            </span>
          </div>

          {/* Gradient Progress Bar */}
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${metric.gradient} transition-all duration-1000 ease-out`}
              style={{
                width: `${animate ? progress[i] : 0}%`,
                boxShadow: animate ? `0 0 12px hsla(263, 70%, 58%, 0.3)` : "none",
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </div>
      ))}
    </div>
  )
}
