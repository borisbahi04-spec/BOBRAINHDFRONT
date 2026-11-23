import { useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { getSingledatarequester } from 'src/redux/reducers/requester/requester-reducer'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import Preview from 'src/views/pages/requester/preview/Preview'

const RequesterPreview = ({ data }: { data: any }) => {
  const { settings, saveSettings } = useSettings()
  const dispatch = useDispatch()

  useEffect(() => {
    saveSettings({ ...settings, iconPage: 'mdi:file-document-outline', titlePage: "DETAILS DE LA DEMANDE D'INTERVENTION" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getSingledatarequester(data))
  }, [dispatch, data])

  if (data && data.data === null) return <ExpiredSessionDialog />

  return <Preview />
}

RequesterPreview.acl = {
  action: UserAction.Read,
  subject: EntityAbility.REQUESTER
}
RequesterPreview.authGuard = true

export async function getServerSideProps(context: { req?: any; query: any }) {
  const { req, query } = context
  const session: any = await getSession({ req })
  if (!session?.user?.token) {
    return { redirect: { destination: '/login', permanent: false } }
  }
  try {
    const res = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYREQUESTER}/${query.id}`, {
      headers: { 'x-user-claims': `${session.user.token}` }
    })
    const data = await res.json()
    if (!data || data.errors) return { notFound: true }

    return { props: { data } }
  } catch (e) {
    return { redirect: { destination: '/login', permanent: false } }
  }
}

export default RequesterPreview
