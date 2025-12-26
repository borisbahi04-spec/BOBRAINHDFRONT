/* eslint-disable react-hooks/rules-of-hooks */
import {  useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export async function auth() {
  const router = useRouter()


// eslint-disable-next-line react-hooks/rules-of-hooks
const { data: session, status } = useSession()

if (status === 'loading') {
  return null // ou spinner
}

if (!session) {
  router.replace('/login')

return null
}

return session
}
