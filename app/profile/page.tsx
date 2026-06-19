"use client"
// app/profile/page.tsx

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Shield, Calendar, LogOut,
  Edit3, Check, X, Loader2, Camera, ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session?.user?.name])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) return null

  const { user } = session

  const initials = user.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const joinedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  // ── Photo upload ────────────────────────────────────────────────
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG and WebP images allowed')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB')
      return
    }

    setIsUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res = await fetch('/api/user/upload-photo', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      // ── KEY FIX: update session with Cloudinary URL ─────────────
      // This stores URL in JWT token — persists across refreshes
      await update({ image: data.imageUrl })

      setSuccess('Photo updated successfully!')
      setTimeout(() => setSuccess(''), 4000)

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ── Name update ─────────────────────────────────────────────────
  const handleSaveName = async () => {
    const trimmed = name.trim()
    if (!trimmed || trimmed === user.name) { setIsEditing(false); return }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters'); return }

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')

      await update({ name: trimmed })

      setSuccess('Name updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 4000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setName(user.name || '')
    setError('')
  }

  // Avatar — always from session (Cloudinary URL stored in JWT)
  const avatarSrc = user.image || null

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handlePhotoChange}
        className="hidden"
      />

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account details</p>
          </div>

          {/* Avatar Card */}
          <div className="glass rounded-3xl p-8 border border-border/50 mb-6">
            <div className="flex items-center gap-6">

              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                  {isUploading ? (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center gap-1">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                      <span className="text-white text-xs">Uploading...</span>
                    </div>
                  ) : avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="w-24 h-24 object-cover"
                      // Add timestamp to force reload after update
                      key={avatarSrc}
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                {/* Camera button */}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  title="Change photo"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  {user.role === 'admin' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-3">{user.email}</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="w-3 h-3" />
                  {isUploading ? 'Uploading...' : 'Change profile photo'}
                </button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or WebP · Max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="glass rounded-3xl p-8 border border-border/50 mb-6 space-y-6">
            <h3 className="text-lg font-semibold">Account Details</h3>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
              >
                <Check className="w-4 h-4" /> {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <X className="w-4 h-4" /> {error}
              </motion.div>
            )}

            {/* Name */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                  {isEditing ? (
                    <input
                      value={name}
                      onChange={e => { setName(e.target.value); setError('') }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveName()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      autoFocus
                      className="w-full px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <p className="text-sm font-medium">{user.name}</p>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleSaveName}
                    disabled={isSaving}
                    className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50"
                  >
                    {isSaving
                      ? <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      : <Check className="w-4 h-4 text-primary" />
                    }
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsEditing(true); setName(user.name || '') }}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
                >
                  <Edit3 className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="border-t border-border/50" />

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-border/50" />

            {/* Role */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Account Role</p>
                <p className="text-sm font-medium capitalize">{user.role || 'user'}</p>
              </div>
            </div>

            <div className="border-t border-border/50" />

            {/* Member Since */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                <p className="text-sm font-medium">{joinedDate}</p>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="glass rounded-3xl p-8 border border-red-500/20 bg-red-500/5">
            <h3 className="text-lg font-semibold mb-2">Sign Out</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You will be redirected to the home page after signing out.
            </p>
            <Button
              onClick={async () => {
                await signOut({ redirect: false })
                window.location.href = '/'
              }}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}