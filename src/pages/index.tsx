// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { getSession } from 'next-auth/react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { EntityAbility, UserAction } from 'src/configs/Action'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  else
  return '/'
}

export const getDashboardRoute = () => {
  return '/home'
}


const Home = () => {
  // ** Hooks
  const router = useRouter()
  useEffect(() => {
      router.replace(getDashboardRoute())
  },[router])

return <Spinner />
}


export async function getServerSideProps() {

return {
    props: {  },
  };
}
Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Home.acl = {
  action:UserAction.Read,
  subject:EntityAbility.BRANCH
}

export default Home
