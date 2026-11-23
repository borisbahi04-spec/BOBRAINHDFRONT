import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import RoleForm from 'src/views/pages/hd/roles/RoleForm'

const Page = () => {
  const router = useRouter()
  const { settings, saveSettings } = useSettings()
  useEffect(() => {
    saveSettings({ ...settings, iconPage: '', titlePage: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const id = typeof router.query.id === 'string' ? router.query.id : undefined

  return id ? <RoleForm id={id} key={id} /> : null
}

Page.acl = { action: UserAction.Edit, subject: EntityAbility.ROLE }
Page.authGuard = true

export default Page
