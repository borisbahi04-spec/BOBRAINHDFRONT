import { useEffect } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import ReferenceManager, { ReferenceConfig } from 'src/views/pages/hd/ReferenceManager'

const CONFIG: ReferenceConfig = {
  key: 'departments',
  uri: 'department',
  icon: 'mdi:domain',
  subject: EntityAbility.DEPARTMENT,
  fields: ['displayName', 'description', 'isActive']
}

const ListPage = () => {
  const { settings, saveSettings } = useSettings()
  useEffect(() => {
    saveSettings({ ...settings, iconPage: CONFIG.icon, titlePage: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ReferenceManager config={CONFIG} />
}

ListPage.acl = { action: UserAction.Read, subject: EntityAbility.DEPARTMENT }
ListPage.authGuard = true

export default ListPage
