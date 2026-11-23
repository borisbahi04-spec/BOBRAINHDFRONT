import type { Option } from 'src/components/hd'
import { crudList } from 'src/myservices/hd/crud'

const rows = (res: any): any[] => (Array.isArray(res?.data) ? res.data : [])

export const toRoleOption = (r: any): Option | null =>
  r?.id ? { id: r.id, label: r.displayName || r.name, hint: r.isForOperator ? 'operator' : r.name } : null
export const toNamedOption = (r: any): Option | null => (r?.id ? { id: r.id, label: r.displayName ?? '' } : null)

export const loadRoles = async (q: string) => rows(await crudList('role', { q, perPage: 30 })).map(toRoleOption).filter(Boolean) as Option[]
export const loadDepartments = async (q: string) =>
  rows(await crudList('department', { q, perPage: 30 })).map(toNamedOption).filter(Boolean) as Option[]
export const loadBranches = async (q: string) => rows(await crudList('branch', { q, perPage: 30 })).map(toNamedOption).filter(Boolean) as Option[]
