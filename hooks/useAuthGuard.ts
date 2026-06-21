"use client"
// hooks/useAuthGuard.ts

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function useAuthGuard() {
  const { data: session, status } = useSession()
  const [showModal, setShowModal] = useState(false)

  const isLoggedIn = !!session?.user
  const isLoading  = status === 'loading'

  const guardedAction = (action: () => void | Promise<void>) => {
    if (isLoading) return
    if (!isLoggedIn) {
      setShowModal(true)
      return
    }
    // ── KEY FIX: properly call async action ──
    Promise.resolve(action()).catch(console.error)
  }

  const closeModal = () => setShowModal(false)

  return { isLoggedIn, isLoading, showModal, closeModal, guardedAction, session }
}