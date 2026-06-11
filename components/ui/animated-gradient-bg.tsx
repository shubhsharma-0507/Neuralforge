"use client"

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedGradientBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resize()
    window.addEventListener('resize', resize)

    const drawGradient = () => {
      time += 0.002
      
      const gradient = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time) * 0.2),
        canvas.height * (0.5 + Math.cos(time * 0.7) * 0.2),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      )

      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)')
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)')
      gradient.addColorStop(1, 'rgba(15, 10, 40, 0)')

      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Secondary glow
      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.7 + Math.cos(time * 1.3) * 0.2),
        canvas.height * (0.3 + Math.sin(time * 0.9) * 0.2),
        0,
        canvas.width * 0.7,
        canvas.height * 0.3,
        canvas.width * 0.5
      )

      gradient2.addColorStop(0, 'rgba(192, 132, 252, 0.1)')
      gradient2.addColorStop(0.5, 'rgba(232, 121, 249, 0.05)')
      gradient2.addColorStop(1, 'rgba(15, 10, 40, 0)')

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationId = requestAnimationFrame(drawGradient)
    }

    drawGradient()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-20"
      />
      {/* Grid overlay */}
      <div className="fixed inset-0 -z-10 grid-pattern opacity-30" />
      
      {/* Floating orbs */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] -z-10"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[80px] -z-10"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  )
}
