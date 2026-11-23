// Liste des utilisateurs — Tailwind, charte DKL, FR/EN
import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { crudDelete, crudList } from 'src/myservices/hd/crud'
import { Button, ConfirmDialog, EmptyState, Option, PageHeader, Pagination, SearchSelect, cn } from 'src/components/hd'
import { initials } from 'src/layouts/hd/UserMenu'
import { loadDepartments, loadRoles } from './options'

export const fullName = (u: any) => [u?.lastName, u?.firstName].filter(Boolean).join(' ') || u?.username || '—'

const UserList = () => {
  const router = useRouter()
  const { t } = useHd()
  const ability = useContext(AbilityContext)
  const can = (a: UserAction) => !ability || ability.can(a, EntityAbility.USER) || ability.can(UserAction.Manage, 'all')

  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [role, setRole] = useState<Option | null>(null)
  const [department, setDepartment] = useState<Option | null>(null)
  const [active, setActive] = useState<'' | 'true' | 'false'>('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState<any | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const h = setTimeout(() => {
      setDebounced(q)
      setPage(1)
    }, 350)
    return () => clearTimeout(h)
  }, [q])

  const load = useCallback(async () => {
    setLoading(true)
    const res: any = await crudList('user', {
      q: debounced,
      page,
      perPage,
      relations: 'role,branch,department',
      filters: { 'role.id': role?.id, 'department.id': department?.id, isActive: active === '' ? undefined : active === 'true' }
    })
    setLoading(false)
    if (isApiError(res) || !Array.isArray(res?.data)) {
      setRows([])
      setTotal(0)
      return toast.error(extractApiError(res, t('common.unexpectedError')))
    }
    setRows(res.data)
    setTotal(res.total ?? res.data.length)
  }, [debounced, page, perPage, role, department, active, t])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    setBusy(true)
    const res: any = await crudDelete('user', toDelete.id)
    setBusy(false)
    setToDelete(null)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('users.deleted'))
    load()
  }

  const filtersOn = !!(role || department || active || debounced)

  return (
    <div className='w-full font-sans'>
      <PageHeader
        icon='mdi:account-group-outline'
        title={t('users.title')}
        subtitle={`${t('users.subtitle')} · ${t('ref.count', { count: total })}`}
        actions={
          can(UserAction.Create) && (
            <Button icon='mdi:account-plus-outline' onClick={() => router.push('/user/add')}>
              {t('users.add')}
            </Button>
          )
        }
      />

      <div className='hd-card mb-4 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_180px]'>
        <div className='relative'>
          <Icon icon='mdi:magnify' fontSize={18} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input type='search' className='hd-input pl-10' placeholder={t('users.searchPlaceholder')} value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <SearchSelect value={role} onChange={o => (setRole(o), setPage(1))} loadOptions={loadRoles} icon='mdi:shield-account-outline' placeholder={t('users.allRoles')} />
        <SearchSelect value={department} onChange={o => (setDepartment(o), setPage(1))} loadOptions={loadDepartments} icon='mdi:domain' placeholder={t('users.allDepartments')} />
        <select className='hd-input' value={active} onChange={e => (setActive(e.target.value as any), setPage(1))}>
          <option value=''>{t('users.allStatuses')}</option>
          <option value='true'>{t('common.active')}</option>
          <option value='false'>{t('common.inactive')}</option>
        </select>
      </div>

      <div className='hd-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='bg-brand-600 text-xs uppercase tracking-wide text-white'>
                {(['user', 'contact', 'role', 'department', 'branch', 'status'] as const).map(c => (
                  <th key={c} className={cn('whitespace-nowrap px-4 py-3', (c === 'branch' || c === 'department') && 'hidden xl:table-cell')}>
                    {t(`users.cols.${c}`)}
                  </th>
                ))}
                <th className='px-4 py-3 text-right'>{t('list.cols.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className='px-4 py-4'>
                          <div className='h-3 animate-pulse rounded bg-gray-200' />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map(u => (
                    <tr
                      key={u.id}
                      onClick={() => can(UserAction.Edit) && router.push(`/user/edit/${u.id}`)}
                      className={cn('border-0 border-b border-solid border-gray-100 even:bg-gray-50/60 hover:bg-brand-50', can(UserAction.Edit) && 'cursor-pointer')}
                    >
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-3'>
                          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white', u.isActive === false ? 'bg-gray-300' : 'bg-brand-600')}>
                            {initials(fullName(u))}
                          </span>
                          <div className='min-w-0'>
                            <p className='m-0 truncate font-semibold text-gray-900'>{fullName(u)}</p>
                            <p className='m-0 truncate font-mono text-xs text-gray-500'>@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <p className='m-0 truncate text-gray-700'>{u.email || '—'}</p>
                        <p className='m-0 truncate text-xs tabular-nums text-gray-500'>{u.phoneNumber || ''}</p>
                      </td>
                      <td className='px-4 py-3'>
                        {u.role ? (
                          <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', u.role.isForOperator ? 'bg-harvest-50 text-harvest-700' : 'bg-brand-50 text-brand-700')}>
                            <Icon icon={u.role.isForOperator ? 'mdi:account-tie-outline' : 'mdi:shield-account-outline'} fontSize={13} />
                            {u.role.displayName || u.role.name}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className='hidden px-4 py-3 text-gray-700 xl:table-cell'>{u.department?.displayName ?? '—'}</td>
                      <td className='hidden px-4 py-3 text-gray-700 xl:table-cell'>{u.branch?.displayName ?? '—'}</td>
                      <td className='px-4 py-3'>
                        <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', u.isActive !== false ? 'bg-leaf-50 text-leaf-700 ring-leaf-100' : 'bg-gray-100 text-gray-500 ring-gray-200')}>
                          {u.isActive !== false ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-4 py-3 text-right' onClick={e => e.stopPropagation()}>
                        {can(UserAction.Edit) && (
                          <button type='button' title={t('common.edit')} onClick={() => router.push(`/user/edit/${u.id}`)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-brand-700'>
                            <Icon icon='mdi:pencil-outline' fontSize={18} />
                          </button>
                        )}
                        {can(UserAction.Delete) && (
                          <button type='button' title={t('common.delete')} onClick={() => setToDelete(u)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-red-600'>
                            <Icon icon='mdi:trash-can-outline' fontSize={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && rows.length === 0 && (
          <EmptyState
            icon='mdi:account-search-outline'
            title={t('common.noResult')}
            action={
              filtersOn ? (
                <Button
                  variant='secondary'
                  icon='mdi:filter-remove-outline'
                  onClick={() => {
                    setQ('')
                    setRole(null)
                    setDepartment(null)
                    setActive('')
                  }}
                >
                  {t('list.clearFilters')}
                </Button>
              ) : undefined
            }
          />
        )}
        {total > 0 && (
          <Pagination
            page={page}
            perPage={perPage}
            total={total}
            onPage={setPage}
            onPerPage={n => {
              setPerPage(n)
              setPage(1)
            }}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        danger
        loading={busy}
        title={t('common.delete')}
        message={t('users.confirmDelete', { name: toDelete ? fullName(toDelete) : '' })}
        confirmLabel={t('common.delete')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default UserList
