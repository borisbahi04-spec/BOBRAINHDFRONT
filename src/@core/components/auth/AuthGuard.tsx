// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { getSession, useSession } from 'next-auth/react'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const router = useRouter()
  const { status } = useSession();

  useEffect(
    () => {
      if (!router.isReady || status === 'loading') {
        return
      }

      //check expired session

      if (status === 'unauthenticated') {
        if (router.asPath !== '/') {
          router.replace({pathname: '/login',query: { returnUrl: router.asPath }})
        } else {
          router.replace('/login')
        }
      }
    },
    [router.isReady, router.asPath, status]
  )

  if (status === 'loading' || status === 'unauthenticated') {
    return fallback
  }

  return <>{children}</>
}


export default AuthGuard
