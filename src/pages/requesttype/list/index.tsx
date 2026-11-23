import { useEffect } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import ReferenceManager, { ReferenceConfig } from 'src/views/pages/hd/ReferenceManager'

const CONFIG: ReferenceConfig = {
  key: 'requestTypes',
  uri: 'requesttype',
  icon: 'mdi:shape-outline',
  subject: EntityAbility.BRANCH,
  fields: ['displayName', 'description']
}

const ListPage = () => {
  const { settings, saveSettings } = useSettings()
  useEffect(() => {
    saveSettings({ ...settings, iconPage: CONFIG.icon, titlePage: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ReferenceManager config={CONFIG} />
}

ListPage.acl = { action: UserAction.Read, subject: EntityAbility.BRANCH }
ListPage.authGuard = true

export default ListPage
