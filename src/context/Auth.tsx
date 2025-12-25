import {  useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export async function auth() {
  const router = useRouter()

  const { data: session } = useSession()

  if (!session) {
    router.push('/login')

return null
  }

  return session
}
