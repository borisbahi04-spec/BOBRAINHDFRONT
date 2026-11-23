// Service CRUD générique (API NestJS + buildFilterFromApiSearchParams)
import queryString from 'query-string'
import { returnResponse } from 'src/myCustomFunctions'
import HttpService from '../HttpService'

export interface ListParams {
  q?: string
  page?: number
  perPage?: number
  relations?: string
  /** filtres exacts : { 'role.id': '…', isActive: true } */
  filters?: Record<string, string | boolean | undefined | null>
}

export const crudList = (uri: string, { q, page = 1, perPage = 25, relations, filters = {} }: ListParams = {}) => {
  const where: any[] = []
  if (q?.trim()) where.push({ value: q.trim() })
  Object.entries(filters).forEach(([attribute, value]) => {
    if (value !== undefined && value !== null && value !== '') where.push({ value, attribute })
  })
  const query = queryString.stringify(
    { relations, where: where.length ? JSON.stringify(where) : undefined, page, per_page: perPage },
    { skipNull: true, skipEmptyString: true }
  )
  return returnResponse(new HttpService().getData(`${uri}?${query}`))
}

export const crudGet = (uri: string, id: string, relations?: string) =>
  returnResponse(new HttpService().getData(`${uri}/${id}${relations ? `?relations=${relations}` : ''}`))

export const crudCreate = (uri: string, dto: object) => returnResponse(new HttpService().postData(dto, uri))

export const crudUpdate = (uri: string, id: string, dto: object) => returnResponse(new HttpService().patchDataBy(id, dto, uri))

/** DELETE : renvoie {} si succès (204), le corps JSON d'erreur sinon */
export const crudDelete = async (uri: string, id: string) => {
  const res: any = await returnResponse(new HttpService().deleteData(id, uri))
  if (res?.hasError) return res
  if (typeof res?.json !== 'function') return res ?? {}
  if (res.ok) {
    try {
      return (await res.json()) ?? {}
    } catch {
      return {}
    }
  }
  try {
    const body = await res.json()
    return { errors: body?.errors ?? [body?.message ?? `HTTP ${res.status}`], ...body }
  } catch {
    return { errors: [`HTTP ${res.status}`] }
  }
}
