/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";
import queryString from "query-string";

const requesterUri='requester';
export const REQUESTER_RELATIONS="station,requesttype,branch,labAgent,operator,createdBy,approvedBy,rejectedBy,closedBy,cancelledBy,treatedBy";
const relations=REQUESTER_RELATIONS;

export const  requestersService = ()=>{
  const Url  = `${requesterUri}?relations=${relations}`;

const http = new HttpService();
return returnResponse(http.getData(Url))
}




/** Filtres de la liste des demandes */
export interface RequesterFilters {
  value?: string
  status?: string
  priority?: string
  requesttypeId?: string
  stationId?: string
  labAgentId?: string
  operatorId?: string
  createdById?: string
  startdate?: string // YYYY-MM-DD
  enddate?: string // YYYY-MM-DD
}

/** Construit le paramètre `where` attendu par l'API (buildFilterFromApiSearchParams) */
export const buildRequesterWhere = (f: RequesterFilters = {}) => {
  const where: any[] = []
  if (f.value?.trim()) where.push({ value: f.value.trim() })
  if (f.requesttypeId) where.push({ value: f.requesttypeId, attribute: 'requesttype.id' })
  if (f.stationId) where.push({ value: f.stationId, attribute: 'station.id' })
  if (f.labAgentId) where.push({ value: f.labAgentId, attribute: 'labAgent.id' })
  if (f.operatorId) where.push({ value: f.operatorId, attribute: 'operator.id' })
  if (f.createdById) where.push({ value: f.createdById, attribute: 'createdBy.userId' })
  if (f.status) where.push({ value: f.status, attribute: 'status' })
  if (f.priority) where.push({ value: f.priority, attribute: 'priority' })

  // Période : bornes inclusives (la fin couvre toute la journée)
  if (f.startdate && f.enddate) {
    where.push({ value: [`${f.startdate} 00:00:00`, `${f.enddate} 23:59:59`], attribute: 'createdAt', type: 'between' })
  } else if (f.startdate) {
    where.push({ value: `${f.startdate} 00:00:00`, attribute: 'createdAt', type: 'greaterThanOrEquals' })
  } else if (f.enddate) {
    where.push({ value: f.enddate, attribute: 'createdAt', type: 'lessThanOrEquals' })
  }
  return where
}

export const getSearchrequestersService = (requester: RequesterFilters | string, pgquery: any) => {
  const filters: RequesterFilters = typeof requester === 'string' ? { value: requester } : requester ?? {}
  const query = queryString.stringify(
    { relations, where: JSON.stringify(buildRequesterWhere(filters)) },
    { arrayFormat: 'index', skipNull: true, skipEmptyString: true }
  )
  const Url = `${requesterUri}?${query}&page=${pgquery?.page ?? 1}&per_page=${pgquery?.per_page ?? 25}`
  const http = new HttpService()
  return returnResponse(http.getData(Url))
}

/** Opératrices sélectionnables (rôle opérateur) */
export const lookupOperatorsService = (q = '') => {
  const http = new HttpService()
  return returnResponse(http.getData(`${requesterUri}/lookups/operators?${queryString.stringify({ q, limit: 20 })}`))
}

/** Agents labo (actifs, sauf all=true) */
export const lookupLabAgentsService = (q = '', all = false) => {
  const http = new HttpService()
  return returnResponse(
    http.getData(`${requesterUri}/lookups/lab-agents?${queryString.stringify({ q, all: all ? 'true' : undefined, limit: 20 })}`)
  )
}

export const getByIdrequestersService = (id:string)=>{
  const Url  = `${requesterUri}/${id}?relations=${relations}`;
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}

export const postStatusrequesterService = (requesterId:string,status:string)=>{
  const http = new HttpService();
  const added_url=`${requesterUri}/${requesterId}/statusupdate/${status}`
return returnResponse(http.postData({remark:'ras'},added_url))
}


export const createrequesterService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,requesterUri))
}

export const updaterequesterService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,requesterUri))
}


export const deleterequesterService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,requesterUri))
}

