// // app/api/admin/users/route.ts
// // Protected route — only admin can see all users

// import { NextResponse } from 'next/server'
// import { auth } from '@/lib/auth'
// import { connectDB } from '@/lib/mongodb'
// import User from '@/lib/models/User'

// export async function GET() {
//   try {
//     // ── Auth check ───────────────────────────────────────────────
//     const session = await auth()

//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     if (session.user.role !== 'admin') {
//       return NextResponse.json({ error: 'Forbidden — Admins only' }, { status: 403 })
//     }

//     await connectDB()

//     // Return all users — never include passwords
//     const users = await User.find({})
//       .select('-password')
//       .sort({ createdAt: -1 }) // newest first

//     return NextResponse.json({
//       total: users.length,
//       users: users.map(u => ({
//         id:            u._id.toString(),
//         name:          u.name,
//         email:         u.email,
//         role:          u.role,
//         provider:      u.provider,
//         emailVerified: u.emailVerified,
//         createdAt:     u.createdAt,
//       })),
//     })
//   } catch (error) {
//     console.error('[admin/users] error:', error)
//     return NextResponse.json(
//       { error: 'Something went wrong' },
//       { status: 500 }
//     )
//   }
// }

// app/api/admin/users/route.js
export const runtime = 'nodejs'

import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { requireAdmin } from '@/lib/requireAuth'

export async function GET() {
  // ── Admin only ───────────────────────────────────────────────────
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })

    return Response.json({
      total: users.length,
      users: users.map(u => ({
        id:            u._id.toString(),
        name:          u.name,
        email:         u.email,
        role:          u.role,
        provider:      u.provider,
        emailVerified: u.emailVerified,
        createdAt:     u.createdAt,
      })),
    })
  } catch (err) {
    console.error('[admin/users] error:', err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}