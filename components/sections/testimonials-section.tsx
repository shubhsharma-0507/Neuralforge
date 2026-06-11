"use client"

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Engineer at Meta',
    avatar: 'SC',
    content: 'NeuralForge has completely transformed how our team writes code. The AI suggestions are incredibly accurate and have cut our development time in half.',
    rating: 5,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO at TechStart',
    avatar: 'MR',
    content: 'The architecture generator alone is worth the subscription. It helped us design a system that handles 10x our expected traffic without any issues.',
    rating: 5,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Emily Watson',
    role: 'Lead Developer at Stripe',
    avatar: 'EW',
    content: 'I was skeptical about AI code tools, but NeuralForge proved me wrong. The debugger found issues our entire team missed in code review.',
    rating: 5,
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'David Kim',
    role: 'Founder at CodeLab',
    avatar: 'DK',
    content: 'As a solo developer, NeuralForge feels like having a senior engineer pair programming with me 24/7. Absolutely game-changing.',
    rating: 5,
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Lisa Thompson',
    role: 'Engineering Manager at Google',
    avatar: 'LT',
    content: 'We integrated NeuralForge into our CI/CD pipeline. The code analysis catches issues before they even reach code review. Brilliant tool.',
    rating: 5,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'James Wilson',
    role: 'Full Stack Developer',
    avatar: 'JW',
    content: 'The AI chatbot understands context better than any other tool I have tried. It remembers our previous conversations and codebase structure.',
    rating: 5,
    color: 'from-pink-500 to-rose-500'
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass rounded-3xl p-6 h-full relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:bg-secondary/30">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
        
        {/* Quote icon */}
        <Quote className={`w-8 h-8 mb-4 text-primary/30 group-hover:text-primary/50 transition-colors`} />

        {/* Content */}
        <p className="text-muted-foreground leading-relaxed mb-6">
          &quot;{testimonial.content}&quot;
        </p>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold`}>
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background decorations */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/5 blur-[100px] -z-10"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-[100px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-balance">Loved by Developers</span>
            <br />
            <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Join thousands of developers who have transformed their workflow with NeuralForge AI.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
