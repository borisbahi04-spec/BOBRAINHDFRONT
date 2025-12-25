import { ReactNode, ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (!router.isReady) return

    // 🚫 PAS de redirection pendant le loading
    if (status === 'unauthenticated') {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }, [status, router.isReady, router])

  // ⏳ Pendant le loading → fallback
  if (status === 'loading') {
    return fallback
  }

  // ❌ Non authentifié → fallback (le redirect est déjà lancé)
  if (status === 'unauthenticated') {
    return fallback
  }

  // ✅ Authentifié
  return <>{children}</>
}

export default AuthGuard
