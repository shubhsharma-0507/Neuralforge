

"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Network, Server, Database, Cloud, Shield, Globe, Cpu, HardDrive, Layers, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoginRequiredModal } from '@/components/ui/login-required-modal'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const iconMap = {
  Globe, Server, Database, Cloud, Shield, Cpu, HardDrive, Layers, Network,
}

const colorMap = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-purple-500',
  'from-red-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-yellow-500 to-orange-500',
  'from-teal-500 to-green-500',
]

const defaultNodes = [
  { id: 'client', label: 'Client App', icon: 'Globe', x: 50, y: 8, color: 'from-blue-500 to-cyan-500' },
  { id: 'cdn', label: 'CDN', icon: 'Cloud', x: 20, y: 25, color: 'from-purple-500 to-pink-500' },
  { id: 'lb', label: 'Load Balancer', icon: 'Layers', x: 80, y: 25, color: 'from-purple-500 to-pink-500' },
  { id: 'api', label: 'API Gateway', icon: 'Server', x: 50, y: 42, color: 'from-orange-500 to-red-500' },
  { id: 'auth', label: 'Auth Service', icon: 'Shield', x: 15, y: 60, color: 'from-green-500 to-emerald-500' },
  { id: 'app', label: 'App Server', icon: 'Cpu', x: 50, y: 65, color: 'from-indigo-500 to-purple-500' },
  { id: 'cache', label: 'Redis Cache', icon: 'HardDrive', x: 85, y: 60, color: 'from-red-500 to-pink-500' },
  { id: 'db', label: 'Database', icon: 'Database', x: 30, y: 85, color: 'from-cyan-500 to-blue-500' },
  { id: 'storage', label: 'Object Storage', icon: 'Cloud', x: 70, y: 85, color: 'from-yellow-500 to-orange-500' },
]

const defaultLinks = [
  { from: 'client', to: 'cdn' },
  { from: 'client', to: 'lb' },
  { from: 'cdn', to: 'api' },
  { from: 'lb', to: 'api' },
  { from: 'api', to: 'auth' },
  { from: 'api', to: 'app' },
  { from: 'api', to: 'cache' },
  { from: 'app', to: 'db' },
  { from: 'app', to: 'storage' },
  { from: 'app', to: 'cache' },
]

function autoLayout(nodes: typeof defaultNodes) {
  return nodes.map((n, i) => ({
    ...n,
    x: [15, 50, 85, 15, 50, 85, 15, 50, 85][i] || 50,
    y: [15, 15, 15, 45, 45, 45, 75, 75, 75][i] || 50,
    color: colorMap[i % colorMap.length],
  }))
}

type NodeType = { id: string; label: string; icon: string; x: number; y: number; color: string }
type LinkType = { from: string; to: string }

export default function ArchitectureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // ── Auth guard ──────────────────────────────────────────────────
  const { isLoggedIn, showModal, closeModal, guardedAction } = useAuthGuard()

  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nodes, setNodes] = useState<NodeType[]>(defaultNodes)
  const [links, setLinks] = useState<LinkType[]>(defaultLinks)
  const [svgSize, setSvgSize] = useState({ w: 1000, h: 620 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setSvgSize({ w: el.clientWidth, h: el.clientHeight })
    })
    ro.observe(el)
    setSvgSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  const toX = (pct: number) => (pct / 100) * svgSize.w
  const toY = (pct: number) => (pct / 100) * svgSize.h

  // ── Actual generate function ─────────────────────────────────────
  const doGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()

      // 401 → show login modal
      if (res.status === 401) {
        closeModal()
        setTimeout(() => guardedAction(() => { }), 100)
        return
      }

      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)

      const rawNodes: NodeType[] = (data.nodes || []).map((n: Partial<NodeType>, i: number) => ({
        id: n.id || `node_${i}`,
        label: n.label || `Node ${i + 1}`,
        icon: n.icon || 'Server',
        x: 0, y: 0,
        color: colorMap[i % colorMap.length],
      }))

      const nodeIds = new Set(rawNodes.map(n => n.id))
      const rawLinks = (data.links || data.connections || []).filter(
        (l: LinkType) => l && l.from && l.to && nodeIds.has(l.from) && nodeIds.has(l.to)
      )

      setNodes(autoLayout(rawNodes))
      setLinks(rawLinks)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [prompt, loading, closeModal, guardedAction])

  // ── Guarded generate — shows modal if not logged in ─────────────
  const generateArchitecture = () => guardedAction(doGenerate)

  return (
    <>
      {/* Login Modal */}
      <LoginRequiredModal
        isOpen={showModal}
        onClose={closeModal}
        feature="Architecture Generator"
      />

      <section id="architecture" ref={sectionRef} className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
              Architecture Generator
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-balance">Design Scalable Systems</span>
              <br />
              <span className="gradient-text">Visually</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
              Generate production-ready architecture diagrams with AI. Describe your requirements
              and get optimized system designs with best practices built-in.
            </p>
          </motion.div>

          {/* Prompt bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex gap-3 mb-10 max-w-2xl mx-auto"
          >
            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateArchitecture()}
              placeholder={isLoggedIn
                ? "e.g. E-commerce app with payments, auth and CDN..."
                : "Login to generate architecture..."}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-secondary/60 border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
            />
            <Button
              onClick={generateArchitecture}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 disabled:opacity-60 px-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLoggedIn
                    ? <Network className="w-4 h-4" />
                    : <Lock className="w-4 h-4" />
                  }
                  Generate
                </span>
              )}
            </Button>
          </motion.div>

          {/* Login hint */}
          {!isLoggedIn && (
            <p className="text-center text-xs text-muted-foreground mb-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Login required to generate architecture
            </p>
          )}

          {error && (
            <p className="text-center text-red-400 text-sm mb-6">{error}</p>
          )}

          {/* Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              ref={containerRef}
              className="glass rounded-3xl overflow-hidden"
              style={{ position: 'relative', height: '620px' }}
            >
              {/* SVG lines */}
              <svg
                width={svgSize.w}
                height={svgSize.h}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 11, // ── 💡 1 ki jagah 11 kar do, taaki highlight nodes ke upar dikhe ──
                  pointerEvents: 'none'
                }}
              >
                <defs>
                  <linearGradient id="gradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <marker id="arrowDim" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(168,85,247,0.4)" />
                  </marker>
                  <marker id="arrowBright" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                  </marker>
                </defs>

                {links.map((conn, i) => {
                  const fromNode = nodes.find(n => n.id.toLowerCase() === conn.from.toLowerCase())
                  const toNode = nodes.find(n => n.id.toLowerCase() === conn.to.toLowerCase())
                  if (!fromNode || !toNode) return null

                  const nodeWidth = 100
                  const nodeHeight = 90

                  let x1 = toX(fromNode.x)
                  let y1 = toY(fromNode.y)
                  let x2 = toX(toNode.x)
                  let y2 = toY(toNode.y)

                  const angle = Math.atan2(y2 - y1, x2 - x1)
                  x1 += Math.cos(angle) * (nodeWidth / 2)
                  y1 += Math.sin(angle) * (nodeHeight / 2)
                  x2 -= Math.cos(angle) * (nodeWidth / 2)
                  y2 -= Math.sin(angle) * (nodeHeight / 2)

                  // ── 💡 FIX: Case-Insensitive check aur dono taraf se connection logic ──
                  const isCurrentHovered = hoveredNode ? hoveredNode.toLowerCase() : null
                  const isActive = isCurrentHovered === conn.from.toLowerCase() || isCurrentHovered === conn.to.toLowerCase()

                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isActive ? 'url(#gradActive)' : 'rgba(168,85,247,0.25)'}
                      strokeWidth={isActive ? 4.5 : 1.5} // Active par makhhan jaisa mota glow
                      strokeDasharray={isActive ? 'none' : '6 4'}
                      filter={isActive ? 'url(#glowFilter)' : 'none'}
                      markerEnd={isActive ? 'url(#arrowBright)' : 'url(#arrowDim)'}
                      style={{
                        transition: 'stroke 0.2s ease, stroke-width 0.2s ease, filter 0.2s ease',
                        willChange: 'stroke, stroke-width, filter'
                      }}
                    />
                  )
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node, i) => {
                const Icon = iconMap[node.icon as keyof typeof iconMap] || Server
                const isHovered = hoveredNode === node.id
                const isSelected = selectedNode === node.id
                const isConnected = !!hoveredNode && links.some(
                  l => (l.from === hoveredNode && l.to === node.id) ||
                    (l.to === hoveredNode && l.from === node.id)
                )

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.07, type: 'spring', stiffness: 200 }}
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  >
                    <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }} className="relative cursor-pointer group">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${node.color} blur-xl transition-opacity duration-200 ${isHovered ? 'opacity-60' : 'opacity-0'}`} />
                      <div className={`relative glass rounded-2xl p-4 flex flex-col items-center gap-2 min-w-[80px] transition-all duration-200 ${isHovered ? 'ring-2 ring-purple-400' :
                        isConnected ? 'ring-2 ring-purple-400/50' :
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-medium text-center max-w-[90px] truncate">
                          {node.label}
                        </span>
                        {isConnected && !isHovered && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}

              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground" style={{ zIndex: 20 }}>
                Hover on nodes to highlight connections
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button
                onClick={generateArchitecture}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 disabled:opacity-60"
              >
                {isLoggedIn
                  ? <Network className="w-4 h-4 mr-2" />
                  : <Lock className="w-4 h-4 mr-2" />
                }
                {loading ? 'Generating...' : 'Generate Architecture'}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setNodes(defaultNodes); setLinks(defaultLinks); setPrompt(''); setError('') }}
              >
                Reset to Default
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}