// app/api/auth/[...nextauth]/route.ts
// Force Node.js runtime — fixes "stream module not supported" error

export const runtime = 'nodejs'  // ← THIS IS THE KEY FIX

import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers