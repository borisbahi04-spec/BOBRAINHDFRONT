import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import UserForm from 'src/views/pages/hd/users/UserForm'

const Page = () => {
  const router = useRouter()
  const { settings, saveSettings } = useSettings()
  useEffect(() => {
    saveSettings({ ...settings, iconPage: '', titlePage: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const id = typeof router.query.id === 'string' ? router.query.id : undefined

  return <UserForm />
}

Page.acl = { action: UserAction.Create, subject: EntityAbility.USER }
Page.authGuard = true

export default Page
