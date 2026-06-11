// proxy.ts — PROJECT ROOT
// NextAuth v5 beta compatible version

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Pages only logged-in users can see
const PROTECTED_PAGES = ['/profile', '/dashboard', '/settings']

// Pages only guests can see (logged-in users get redirected to home)
const GUEST_ONLY_PAGES = ['/auth/login', '/auth/signup']

// Admin only pages
const ADMIN_PAGES = ['/admin']

export default auth(function proxy(req) {
  const { pathname } = req.nextUrl
  const session      = req.auth
  const isLoggedIn   = !!session?.user

  // ── Guest-only pages: redirect logged-in users to home ──────────
  if (isLoggedIn && GUEST_ONLY_PAGES.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ── Protected pages: redirect guests to login ───────────────────
  if (!isLoggedIn && PROTECTED_PAGES.some(p => pathname.startsWith(p))) {
    const url = new URL('/auth/login', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // ── Admin pages: redirect non-admins ───────────────────────────
  if (ADMIN_PAGES.some(p => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    if (session?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all routes except static files and next internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}