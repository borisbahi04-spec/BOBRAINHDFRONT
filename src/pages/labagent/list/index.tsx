import { useEffect } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { PAGE_SETTINGS } from 'src/definitions/constantes'
import LabAgentList from 'src/views/pages/labagent/LabAgentList'

const LabAgentPage = () => {
  const { settings, saveSettings } = useSettings()

  useEffect(() => {
    saveSettings({ ...settings, iconPage: PAGE_SETTINGS.labAgents.icon, titlePage: PAGE_SETTINGS.labAgents.title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <LabAgentList />
}

// Même droits que le référentiel « Stations »
LabAgentPage.acl = {
  action: UserAction.Read,
  subject: EntityAbility.STATION
}
LabAgentPage.authGuard = true

export default LabAgentPage
