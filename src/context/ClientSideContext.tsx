// ** React Imports
import { createContext, ReactNode, useContext } from 'react'
import { signOut } from "next-auth/react"

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config

export const SESSIONEXPIRECODE= 43;


// ** Defaults
const defaultProvider: any = {
  expireSession: () => Promise.resolve()
}

const ClientContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

export const useClientSide = () => useContext(ClientContext);

 const ClientSideProvider = ({ children }: Props) => {
  const router = useRouter()

  const userExpiredSession = () => {
      const loginRoute='/login';
      signOut({ redirect: false, callbackUrl:loginRoute })
      router.push(loginRoute)
  }

  const values = {
    expireSession: userExpiredSession
  }

return <ClientContext.Provider value={values}>{children}</ClientContext.Provider>

}
export { ClientContext, ClientSideProvider }


