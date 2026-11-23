import { useEffect } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { PAGE_SETTINGS } from 'src/definitions/constantes'
import RequesterList from 'src/views/pages/requester/list/RequesterList'

/**
 * Liste des demandes.
 * Les données sont chargées côté client (filtres + pagination serveur,
 * état synchronisé dans l'URL) : plus de 4 appels SSR à chaque affichage.
 */
const List = () => {
  const { settings, saveSettings } = useSettings()

  useEffect(() => {
    saveSettings({ ...settings, iconPage: PAGE_SETTINGS.requester.icon, titlePage: PAGE_SETTINGS.requester.title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <RequesterList />
}

List.acl = {
  action: UserAction.Read,
  subject: EntityAbility.REQUESTER
}
List.authGuard = true

export default List
