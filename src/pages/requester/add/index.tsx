import { useEffect } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import AddCard from 'src/views/pages/requester/add/AddCard'

/** Création d'une demande d'intervention */
const RequesterAdd = () => {
  const { settings, saveSettings } = useSettings()

  useEffect(() => {
    saveSettings({ ...settings, iconPage: 'mdi:file-document-plus-outline', titlePage: 'CREATION DEMANDE INTERVENTION' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <AddCard />
}

RequesterAdd.acl = {
  action: UserAction.Create,
  subject: EntityAbility.REQUESTER
}
RequesterAdd.authGuard = true

export default RequesterAdd
