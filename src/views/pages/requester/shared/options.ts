import type { Option } from 'src/components/hd'
import { getSearchstationsService } from 'src/myservices/station/station-service'
import { getSearchrequesttypesService } from 'src/myservices/requesttype/requesttype-service'
import { lookupLabAgentsService, lookupOperatorsService } from 'src/myservices/requester/requester-service'
import { RST_getSearchUsersService } from 'src/myservices/User/UserService'

const rows = (res: any): any[] => (Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [])

export const toStationOption = (s: any): Option | null => (s?.id ? { id: s.id, label: s.displayName ?? '' } : null)
export const toRequestTypeOption = (r: any): Option | null => (r?.id ? { id: r.id, label: r.displayName ?? '' } : null)

export const labAgentName = (a: any) => [a?.lastName, a?.firstName].filter(Boolean).join(' ') || a?.displayName || ''
export const toLabAgentOption = (a: any): Option | null =>
  a?.id ? { id: a.id, label: labAgentName(a), hint: a.matricule, disabled: a.isActive === false } : null

export const userName = (u: any) =>
  u?.displayName || [u?.lastName, u?.firstName].filter(Boolean).join(' ') || u?.username || ''
export const toOperatorOption = (u: any): Option | null =>
  u?.id ? { id: u.id, label: userName(u), hint: u.username } : null

export const loadStations = async (q: string) =>
  rows(await getSearchstationsService(q, { page: 1, per_page: 20 })).map(toStationOption).filter(Boolean) as Option[]

export const loadRequestTypes = async (q: string) =>
  rows(await getSearchrequesttypesService(q, { page: 1, per_page: 20 })).map(toRequestTypeOption).filter(Boolean) as Option[]

export const loadLabAgents = async (q: string) =>
  rows(await lookupLabAgentsService(q)).map(toLabAgentOption).filter(Boolean) as Option[]

/** Pour les filtres : inclut les agents désactivés */
export const loadAllLabAgents = async (q: string) =>
  rows(await lookupLabAgentsService(q, true))
    .map(a => ({ ...toLabAgentOption(a)!, disabled: false }))
    .filter(Boolean) as Option[]

export const loadOperators = async (q: string) =>
  rows(await lookupOperatorsService(q)).map(toOperatorOption).filter(Boolean) as Option[]


/** Demandeurs (utilisateurs) — filtre « Demandeur » */
export const loadUsers = async (q: string) =>
  rows(await RST_getSearchUsersService({ value: q }, { page: 1, per_page: 20 }))
    .map(u => ({ id: u.id, label: userName(u), hint: u.username }))
    .filter(o => o.id) as Option[]
