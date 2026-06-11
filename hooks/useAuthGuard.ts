"use client"
// hooks/useAuthGuard.ts
// Use this hook in any component that needs login protection
// Returns: { isLoggedIn, showModal, closeModal, guardedAction }

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function useAuthGuard() {
  const { data: session, status } = useSession()
  const [showModal, setShowModal] = useState(false)

  const isLoggedIn  = !!session?.user
  const isLoading   = status === 'loading'

  // Wrap any action — if not logged in, show modal instead
  const guardedAction = (action: () => void) => {
    if (isLoading) return   // wait for session to load
    if (!isLoggedIn) {
      setShowModal(true)
      return
    }
    action()
  }

  const closeModal = () => setShowModal(false)

  return { isLoggedIn, isLoading, showModal, closeModal, guardedAction, session }
}