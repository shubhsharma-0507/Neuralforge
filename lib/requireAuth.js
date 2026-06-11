// lib/requireAuth.js
// Reusable auth check for ALL API routes
// Usage: const { session, error } = await requireAuth()

import { auth } from '@/lib/auth'

export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    return {
      session: null,
      error: Response.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    }
  }

  return { session, error: null }
}

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user) {
    return {
      session: null,
      error: Response.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    }
  }

  if (session.user.role !== 'admin') {
    return {
      session: null,
      error: Response.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }
  }

  return { session, error: null }
}