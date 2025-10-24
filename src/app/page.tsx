'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Logo } from '@/components/Logo'

export default function Home() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Simple timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, [])

  useEffect(() => {
    if (isInitialized) {
      if (user) {
        router.push('/portal')
      } else {
        router.push('/login')
      }
    }
  }, [user, isInitialized, router])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo width={180} height={64} className="mx-auto mb-4" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
