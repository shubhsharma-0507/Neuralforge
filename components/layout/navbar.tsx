"use client"
// components/layout/navbar.tsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, LogOut, User, ChevronDown, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#features',      label: 'Features' },
  { href: '#chatbot',       label: 'AI Chatbot' },
  { href: '#code-analysis', label: 'Code Analysis' },
  { href: '#generator',     label: 'Generator' },
  { href: '#debugger',      label: 'Debugger' },
  { href: '#architecture',  label: 'Architecture' },
]

// ── Avatar component — reused in desktop + mobile ──────────────────
function UserAvatar({
  image,
  name,
  size = 'sm',
}: {
  image?: string | null
  name?: string | null
  size?: 'sm' | 'lg'
}) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const dim = size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs'

  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold overflow-hidden shrink-0`}>
      {image ? (
        <img
          src={image}
          alt={name || 'avatar'}
          className="w-full h-full object-cover"
          // key forces re-render when URL changes
          key={image}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

export default function Navbar() {
  const { data: session, status } = useSession()
  const isLoading  = status === 'loading'
  const isLoggedIn = !!session?.user

  const [isScrolled,       setIsScrolled]       = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen,   setIsUserMenuOpen]   = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const close = () => setIsUserMenuOpen(false)
    if (isUserMenuOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [isUserMenuOpen])

 const handleSignOut = async () => {
  setIsUserMenuOpen(false)
  // NextAuth automatically redirects back to the home page securely
  await signOut({ callbackUrl: '/' })
}

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-strong py-3' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Neural</span>
                <span className="text-foreground">Forge</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Desktop Right: Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
              ) : isLoggedIn ? (
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary/60 transition-colors"
                  >
                    {/* ── Uses UserAvatar — auto updates when session.user.image changes ── */}
                    <UserAvatar image={session.user?.image} name={session.user?.name} size="sm" />
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {session.user?.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl border border-border/50 overflow-hidden shadow-xl"
                      >
                        {/* User info with avatar */}
                        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
                          <UserAvatar image={session.user?.image} name={session.user?.name} size="lg" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{session.user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                            {session.user?.role === 'admin' && (
                              <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-primary">
                                <Shield className="w-3 h-3" /> Admin
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-1">
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-secondary/60 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>

                          {session.user?.role === 'admin' && (
                            <Link
                              href="/admin/users"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-secondary/60 transition-colors text-primary"
                            >
                              <Shield className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-white border-0">
                      <span className="relative z-10">Get Started Free</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                        initial={{ x: '100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-50 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 glass-strong p-6 pt-24 overflow-y-auto"
            >
              {/* Mobile user info — WITH image */}
              {isLoggedIn && (
                <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-secondary/40 border border-border/50">
                  {/* ── UserAvatar here too ── */}
                  <UserAvatar image={session?.user?.image} name={session?.user?.name} size="lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile auth buttons */}
              <div className="mt-8 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <User className="w-4 h-4 mr-2" /> Profile
                      </Button>
                    </Link>
                    {session?.user?.role === 'admin' && (
                      <Link href="/admin/users" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full text-primary">
                          <Shield className="w-4 h-4 mr-2" /> Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full text-red-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent text-white border-0">
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}