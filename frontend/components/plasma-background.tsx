"use client"

import { useEffect, useRef } from "react"

export function PlasmaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    function render() {
      if (!canvas || !ctx) return

      const w = canvas.width
      const h = canvas.height

      // Clear with dark background
      ctx.fillStyle = "hsl(240, 12%, 4%)"
      ctx.fillRect(0, 0, w, h)

      // Draw flowing plasma blobs
      const blobs = [
        {
          x: w * 0.5 + Math.sin(time * 0.3) * w * 0.1,
          y: h * 0.4 + Math.cos(time * 0.2) * h * 0.08,
          rx: w * 0.25 + Math.sin(time * 0.15) * w * 0.05,
          ry: h * 0.35 + Math.cos(time * 0.18) * h * 0.05,
          color: "hsla(270, 50%, 25%, 0.6)",
          rotation: time * 0.1,
        },
        {
          x: w * 0.55 + Math.cos(time * 0.25) * w * 0.08,
          y: h * 0.55 + Math.sin(time * 0.3) * h * 0.1,
          rx: w * 0.18 + Math.cos(time * 0.2) * w * 0.04,
          ry: h * 0.3 + Math.sin(time * 0.15) * h * 0.04,
          color: "hsla(280, 40%, 20%, 0.5)",
          rotation: -time * 0.08,
        },
        {
          x: w * 0.42 + Math.sin(time * 0.35) * w * 0.06,
          y: h * 0.35 + Math.cos(time * 0.22) * h * 0.06,
          rx: w * 0.15 + Math.sin(time * 0.12) * w * 0.03,
          ry: h * 0.22 + Math.cos(time * 0.16) * h * 0.03,
          color: "hsla(260, 55%, 30%, 0.4)",
          rotation: time * 0.12,
        },
        {
          x: w * 0.6 + Math.cos(time * 0.2) * w * 0.05,
          y: h * 0.6 + Math.sin(time * 0.28) * h * 0.07,
          rx: w * 0.12 + Math.cos(time * 0.14) * w * 0.02,
          ry: h * 0.18 + Math.sin(time * 0.1) * h * 0.02,
          color: "hsla(290, 35%, 18%, 0.45)",
          rotation: -time * 0.15,
        },
      ]

      for (const blob of blobs) {
        ctx.save()
        ctx.translate(blob.x, blob.y)
        ctx.rotate(blob.rotation)
        ctx.filter = "blur(80px)"

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(blob.rx, blob.ry))
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, "0.2)"))
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.ellipse(0, 0, blob.rx, blob.ry, 0, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.restore()
      }

      // Add a brighter center highlight
      ctx.save()
      ctx.filter = "blur(60px)"
      const highlightX = w * 0.5 + Math.sin(time * 0.25) * w * 0.05
      const highlightY = h * 0.42 + Math.cos(time * 0.2) * h * 0.04
      const highlightGradient = ctx.createRadialGradient(highlightX, highlightY, 0, highlightX, highlightY, w * 0.12)
      highlightGradient.addColorStop(0, "hsla(270, 60%, 40%, 0.35)")
      highlightGradient.addColorStop(0.6, "hsla(280, 50%, 30%, 0.1)")
      highlightGradient.addColorStop(1, "transparent")
      ctx.fillStyle = highlightGradient
      ctx.fillRect(0, 0, w, h)
      ctx.restore()

      time += 0.008
      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
