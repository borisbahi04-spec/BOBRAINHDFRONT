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
  const { data: session } = useSession();


  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (session) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  if (session !== null) {

    return fallback
  }

  return <>{children}</>
}


export default GuestGuard
