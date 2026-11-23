import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import type { Option } from 'src/components/hd'
import type { RequesterFilters } from 'src/myservices/requester/requester-service'
import { rememberRequesterList } from '../shared/listReturn'

/**
 * État des filtres de la liste, synchronisé avec l'URL
 * (lien partageable, conservé au rafraîchissement / retour arrière).
 * Les filtres « entité » gardent aussi le libellé pour l'affichage.
 */
export interface FilterState {
  value: string
  status: string
  priority: string
  startdate: string
  enddate: string
  requesttype: Option | null
  station: Option | null
  labAgent: Option | null
  operator: Option | null
  createdBy: Option | null
}

export const EMPTY_FILTERS: FilterState = {
  value: '',
  status: '',
  priority: '',
  startdate: '',
  enddate: '',
  requesttype: null,
  station: null,
  labAgent: null,
  operator: null,
  createdBy: null
}

const ENTITY_KEYS = ['requesttype', 'station', 'labAgent', 'operator', 'createdBy'] as const
const SCALAR_KEYS = ['value', 'status', 'priority', 'startdate', 'enddate'] as const

const encodeOpt = (o: Option | null) => (o ? `${o.id}|${o.label}` : undefined)
const decodeOpt = (v: unknown): Option | null => {
  if (typeof v !== 'string' || !v) return null
  const [id, ...rest] = v.split('|')
  return id ? { id, label: rest.join('|') || id } : null
}

export const useRequesterFilters = () => {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [ready, setReady] = useState(false)

  // Lecture initiale depuis l'URL
  useEffect(() => {
    if (!router.isReady || ready) return
    const q = router.query
    const next: FilterState = { ...EMPTY_FILTERS }
    SCALAR_KEYS.forEach(k => {
      if (typeof q[k] === 'string') (next as any)[k] = q[k]
    })
    ENTITY_KEYS.forEach(k => {
      ;(next as any)[k] = decodeOpt(q[k])
    })
    setFilters(next)
    if (q.page) setPage(Math.max(1, Number(q.page) || 1))
    if (q.per_page) setPerPage(Number(q.per_page) || 25)
    setReady(true)
  }, [router.isReady, router.query, ready])

  // Écriture dans l'URL (shallow : pas de rechargement)
  useEffect(() => {
    if (!ready) return
    // on conserve les paramètres d'URL qui ne sont pas des filtres
    const query: Record<string, string> = {}
    Object.entries(router.query).forEach(([k, v]) => {
      if (![...SCALAR_KEYS, ...ENTITY_KEYS, 'page', 'per_page'].includes(k as any) && typeof v === 'string') query[k] = v
    })
    SCALAR_KEYS.forEach(k => {
      if (filters[k]) query[k] = filters[k]
    })
    ENTITY_KEYS.forEach(k => {
      const enc = encodeOpt(filters[k])
      if (enc) query[k] = enc
    })
    if (page > 1) query.page = String(page)
    if (perPage !== 25) query.per_page = String(perPage)
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false })
    // mémorise la vue filtrée pour le bouton « Retour » du détail
    rememberRequesterList(new URLSearchParams(query).toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, perPage, ready])

  const update = useCallback((patch: Partial<FilterState>) => {
    setFilters(f => ({ ...f, ...patch }))
    setPage(1) // tout changement de filtre ramène à la page 1
  }, [])

  const clear = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }, [])

  const activeCount = useMemo(
    () =>
      SCALAR_KEYS.filter(k => k !== 'value' && filters[k]).length +
      ENTITY_KEYS.filter(k => filters[k]).length +
      (filters.value ? 1 : 0),
    [filters]
  )

  const invalidRange = !!filters.startdate && !!filters.enddate && filters.enddate < filters.startdate

  /** Filtres au format API */
  const apiFilters: RequesterFilters = useMemo(
    () => ({
      value: filters.value,
      status: filters.status,
      priority: filters.priority,
      startdate: invalidRange ? '' : filters.startdate,
      enddate: invalidRange ? '' : filters.enddate,
      requesttypeId: filters.requesttype?.id,
      stationId: filters.station?.id,
      labAgentId: filters.labAgent?.id,
      operatorId: filters.operator?.id,
      createdById: filters.createdBy?.id
    }),
    [filters, invalidRange]
  )

  return { filters, update, clear, activeCount, invalidRange, apiFilters, page, setPage, perPage, setPerPage, ready }
}
