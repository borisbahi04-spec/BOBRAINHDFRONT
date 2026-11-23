import queryString from 'query-string'
import { returnResponse } from 'src/myCustomFunctions'
import HttpService from '../HttpService'

const uri = 'labagent'

export interface LabAgentDto {
  matricule: string
  lastName: string
  firstName?: string
  phoneNumber?: string
  isActive?: boolean
}

export const listLabAgentsService = (q: string, active: '' | 'true' | 'false', page = 1, perPage = 25) => {
  const query = queryString.stringify({ q, active, page, per_page: perPage }, { skipEmptyString: true, skipNull: true })
  return returnResponse(new HttpService().getData(`${uri}?${query}`))
}

export const createLabAgentService = (dto: LabAgentDto) => returnResponse(new HttpService().postData(dto, uri))

export const updateLabAgentService = (id: string, dto: Partial<LabAgentDto>) =>
  returnResponse(new HttpService().patchDataBy(id, dto, uri))

export const deleteLabAgentService = async (id: string) => {
  const res: any = await returnResponse(new HttpService().deleteData(id, uri))
  try {
    return typeof res?.json === 'function' ? await res.json() : res
  } catch {
    return {}
  }
}
