// Mémorise la dernière vue filtrée de la liste des demandes,
// pour y revenir (bouton « Retour », après suppression…) avec les mêmes filtres.
const KEY = 'hd.requester.listUrl'
const BASE = '/requester/list'

export const rememberRequesterList = (search: string) => {
  try {
    window.sessionStorage.setItem(KEY, search ? `${BASE}?${search}` : BASE)
  } catch {
    /* stockage indisponible */
  }
}

export const requesterListHref = (): string => {
  try {
    const v = window.sessionStorage.getItem(KEY)
    return v && v.startsWith(BASE) ? v : BASE
  } catch {
    return BASE
  }
}
