// // app/api/user/update/route.js
// export const runtime = 'nodejs'

// import { connectDB } from '@/lib/mongodb'
// import User from '@/lib/models/User'
// import { auth } from '@/lib/auth'

// export async function PATCH(req) {
//   try {
//     const session = await auth()

//     if (!session?.user) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await req.json()
//     const { name } = body

//     if (!name || name.trim().length < 2) {
//       return Response.json(
//         { error: 'Name must be at least 2 characters' },
//         { status: 400 }
//       )
//     }

//     await connectDB()

//     const updatedUser = await User.findByIdAndUpdate(
//       session.user.id,
//       { name: name.trim() },
//       { new: true, select: '-password' }
//     )

//     if (!updatedUser) {
//       return Response.json({ error: 'User not found' }, { status: 404 })
//     }

//     return Response.json({
//       message: 'Profile updated successfully',
//       user: {
//         id:    updatedUser._id.toString(),
//         name:  updatedUser.name,
//         email: updatedUser.email,
//         role:  updatedUser.role,
//       }
//     })
//   } catch (error) {
//     console.error('[user/update] error:', error)
//     return Response.json(
//       { error: 'Something went wrong' },
//       { status: 500 }
//     )
//   }
// }


// app/api/user/update/route.js
// Profile name update — login required
export const runtime = 'nodejs'

import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function PATCH(req) {
  try {
    // Get session directly from auth() — most reliable method
    const session = await auth()

    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name } = body

    if (!name || name.trim().length < 2) {
      return Response.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name: name.trim() },
      { new: true, select: '-password' }
    )

    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({
      message: 'Profile updated successfully',
      user: {
        id:    updatedUser._id.toString(),
        name:  updatedUser.name,
        email: updatedUser.email,
        role:  updatedUser.role,
      }
    })
  } catch (err) {
    console.error('[user/update] error:', err)
    return Response.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}