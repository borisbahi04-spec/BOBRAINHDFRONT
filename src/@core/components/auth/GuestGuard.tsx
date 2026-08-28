// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useSession } from 'next-auth/react'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const router = useRouter()
  const { status } = useSession();

  useEffect(() => {
    if (!router.isReady || status === 'loading') {
      return
    }

    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [router.isReady, router.route, status])

  if (status === 'loading' || status === 'authenticated') {
    return fallback
  }

  return <>{children}</>
}


export default GuestGuard
