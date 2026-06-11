// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/auth/login',
    error:  '/auth/error',
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }
        await connectDB()
        const user = await User.findOne({
          email: (credentials.email as string).toLowerCase().trim(),
        }).select('+password')

        if (!user)          throw new Error('No account found with this email')
        if (!user.password) throw new Error('Please sign in with your social account')

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) throw new Error('Incorrect password')

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          image: user.image ?? null,
          role:  user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in
      if (user) {
        token.id    = user.id
        token.role  = (user as { role?: string }).role ?? 'user'
        token.email = user.email
        token.name  = user.name
        token.image = user.image ?? null
      }

      // update() called from client — update name OR image
      if (trigger === 'update') {
        if (session?.name)  token.name  = session.name
        if (session?.image) token.image = session.image
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id    = token.id    as string
        session.user.role  = token.role  as string
        session.user.email = token.email as string
        session.user.name  = token.name  as string
        session.user.image = token.image as string | null
      }
      return session
    },
  },
})