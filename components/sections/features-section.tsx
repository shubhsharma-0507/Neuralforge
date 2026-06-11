"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  MessageSquare, 
  Search, 
  Code2, 
  Bug, 
  Network,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Intelligent conversational AI that understands your codebase and provides contextual assistance.',
    color: 'from-blue-500 to-cyan-500',
    href: '#chatbot'
  },
  {
    icon: Search,
    title: 'Code Analysis',
    description: 'Deep semantic analysis to identify patterns, vulnerabilities, and optimization opportunities.',
    color: 'from-purple-500 to-pink-500',
    href: '#code-analysis'
  },
  {
    icon: Code2,
    title: 'Code Generator',
    description: 'Generate production-ready code from natural language descriptions in seconds.',
    color: 'from-orange-500 to-red-500',
    href: '#generator'
  },
  {
    icon: Bug,
    title: 'AI Debugger',
    description: 'Automatically detect, diagnose, and fix bugs with intelligent suggestions.',
    color: 'from-green-500 to-emerald-500',
    href: '#debugger'
  },
  {
    icon: Network,
    title: 'Architecture Generator',
    description: 'Design scalable system architectures with AI-powered recommendations.',
    color: 'from-indigo-500 to-purple-500',
    href: '#architecture'
  },
  {
    icon: Sparkles,
    title: 'Smart Refactoring',
    description: 'Transform legacy code into modern, maintainable patterns automatically.',
    color: 'from-pink-500 to-rose-500',
    href: '#features'
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.a
      ref={ref}
      href={feature.href}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative block"
    >
      <div className="relative glass rounded-3xl p-8 h-full overflow-hidden transition-all duration-500 hover:bg-secondary/50 hover:-translate-y-2">
        {/* Gradient background on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} 
        />
        
        {/* Icon */}
        <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
          <feature.icon className="w-6 h-6 text-white" />
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-50 group-hover:opacity-80 transition-opacity`} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-foreground transition-colors">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {feature.description}
        </p>

        {/* Learn more link */}
        <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          Learn more
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Corner decoration */}
        <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
      </div>
    </motion.a>
  )
}

export default function FeaturesSection() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6"
          >
            Powerful Features
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-balance">Everything You Need to</span>
            <br />
            <span className="gradient-text">Code Smarter</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            A complete suite of AI-powered tools designed to accelerate your development 
            workflow and elevate code quality.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
