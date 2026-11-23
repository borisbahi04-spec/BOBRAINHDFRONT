import { useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import HomeView from 'src/views/pages/hd/home/Home'

/** Accueil : salutation façon chatbot + tableau de bord (données chargées côté client) */
const Home = () => {
  const { settings, saveSettings } = useSettings()
  useEffect(() => {
    saveSettings({ ...settings, iconPage: 'mdi:home-outline', titlePage: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <HomeView />
}

Home.acl = {
  action: UserAction.Read,
  subject: EntityAbility.BRANCH
}
Home.authGuard = true

export async function getServerSideProps(context: { req: any }) {
  const session = await getSession({ req: context.req })
  if (!session) return { redirect: { destination: '/login', permanent: false } }

  return { props: {} }
}

export default Home
