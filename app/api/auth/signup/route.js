// app/api/auth/signup/route.js
export const runtime = 'nodejs'

import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return Response.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (name.trim().length < 2) {
      return Response.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      return Response.json(
        { error: 'Password must contain uppercase, lowercase and a number' },
        { status: 400 }
      )
    }

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return Response.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: hashedPassword,
      provider: 'credentials',
      role:     'user',
    })

    return Response.json(
      {
        message: 'Account created successfully',
        user: {
          id:    newUser._id.toString(),
          name:  newUser.name,
          email: newUser.email,
          role:  newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[signup] error:', error)

    if (error.code === 11000) {
      return Response.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}