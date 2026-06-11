"use client"
// components/ui/login-required-modal.tsx
// Show this popup when unauthenticated user tries to use AI features

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Sparkles, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LoginRequiredModalProps {
  isOpen:   boolean
  onClose:  () => void
  feature?: string  // e.g. "Code Generator", "AI Chatbot"
}

export function LoginRequiredModal({
  isOpen,
  onClose,
  feature = 'this AI feature',
}: LoginRequiredModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1,   y: 0 }}
            exit={{   opacity: 0, scale: 0.9,   y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass rounded-3xl p-8 border border-border/50 w-full max-w-md pointer-events-auto shadow-2xl">

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              {/* Text */}
              <h2 className="text-2xl font-bold text-center mb-2">
                Login Required
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-8">
                You need to be logged in to use <span className="text-foreground font-medium">{feature}</span>.
                Create a free account to get started!
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" onClick={onClose}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent text-white border-0 py-3">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={onClose}>
                  <Button variant="outline" className="w-full py-3">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Free Account
                  </Button>
                </Link>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Free account · No credit card required
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}