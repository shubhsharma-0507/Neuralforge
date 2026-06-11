"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import AnimatedGradientBg from '@/components/ui/animated-gradient-bg'
import Navbar from '@/components/layout/navbar'
import HeroSection from '@/components/sections/hero-section'
import FeaturesSection from '@/components/sections/features-section'
import ChatbotSection from '@/components/sections/chatbot-section'
import CodeAnalysisSection from '@/components/sections/code-analysis-section'
import CodeGeneratorSection from '@/components/sections/code-generator-section'
import DebuggerSection from '@/components/sections/debugger-section'
import ArchitectureSection from '@/components/sections/architecture-section'
import TestimonialsSection from '@/components/sections/testimonials-section'
import PricingSection from '@/components/sections/pricing-section'
import CTASection from '@/components/sections/cta-section'
import Footer from '@/components/layout/footer'

const ScrollingParticles = dynamic(
  () => import('@/components/three/scrolling-particles'),
  { ssr: false }
)

function LoadingFallback() {
  return (
    <div className="fixed inset-0 -z-10 bg-background" />
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Background layers */}
      <AnimatedGradientBg />
      <Suspense fallback={<LoadingFallback />}>
        <ScrollingParticles />
      </Suspense>

      {/* Navigation */}
      <Navbar />

      {/* Main content sections */}
      <HeroSection />
      
      <div className="relative z-10">
        <FeaturesSection />
        <ChatbotSection />
        <CodeAnalysisSection />
        <CodeGeneratorSection />
        <DebuggerSection />
        <ArchitectureSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
