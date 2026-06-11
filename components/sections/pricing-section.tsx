"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for trying out NeuralForge',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    features: [
      '100 AI requests/month',
      'Basic code analysis',
      'Community support',
      '1 project',
      'Standard response time'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For professional developers',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Unlimited AI requests',
      'Advanced code analysis',
      'Priority support',
      'Unlimited projects',
      'Custom AI training',
      'Team collaboration',
      'API access',
      'IDE integrations'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For teams and organizations',
    icon: Crown,
    color: 'from-orange-500 to-red-500',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'On-premise deployment',
      'SLA guarantee',
      'Advanced security',
      'Usage analytics',
      'White-label option'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function PricingSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-balance">Simple, Transparent</span>
            <br />
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`glass rounded-3xl p-8 h-full flex flex-col ${
                plan.popular ? 'ring-2 ring-primary border-glow' : ''
              }`}>
                {/* Plan icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>

                {/* Plan info */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? `bg-gradient-to-r ${plan.color} text-white border-0` 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['Google', 'Meta', 'Stripe', 'Vercel', 'GitHub'].map((company) => (
              <span key={company} className="text-xl font-bold text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
