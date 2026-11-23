// Liste des rôles — Tailwind, charte DKL, FR/EN
import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { crudDelete, crudList } from 'src/myservices/hd/crud'
import { Button, ConfirmDialog, EmptyState, PageHeader, Pagination, cn } from 'src/components/hd'

/** Modules pour lesquels le rôle a au moins un droit */
export const allowedModules = (permissions: any): string[] =>
  Object.entries(permissions ?? {})
    .filter(([, v]) => v === true || (v && typeof v === 'object' && Object.values(v as object).some(Boolean)))
    .map(([k]) => k)

const RoleList = () => {
  const router = useRouter()
  const { t } = useHd()
  const ability = useContext(AbilityContext)
  const can = (a: UserAction) => !ability || ability.can(a, EntityAbility.ROLE) || ability.can(UserAction.Manage, 'all')

  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
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
    const res: any = await crudList('role', { q: debounced, page, perPage })
    setLoading(false)
    if (isApiError(res) || !Array.isArray(res?.data)) {
      setRows([])
      setTotal(0)
      return toast.error(extractApiError(res, t('common.unexpectedError')))
    }
    setRows(res.data)
    setTotal(res.total ?? res.data.length)
  }, [debounced, page, perPage, t])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    setBusy(true)
    const res: any = await crudDelete('role', toDelete.id)
    setBusy(false)
    setToDelete(null)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('roles.deleted'))
    load()
  }

  const Flag = ({ on, icon, label, tone }: { on?: boolean; icon: string; label: string; tone: string }) =>
    on ? (
      <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', tone)}>
        <Icon icon={icon} fontSize={13} />
        {label}
      </span>
    ) : null

  return (
    <div className='w-full font-sans'>
      <PageHeader
        icon='mdi:shield-account-outline'
        title={t('roles.title')}
        subtitle={`${t('roles.subtitle')} · ${t('ref.count', { count: total })}`}
        actions={
          can(UserAction.Create) && (
            <Button icon='mdi:plus' onClick={() => router.push('/role/add')}>
              {t('roles.add')}
            </Button>
          )
        }
      />

      <div className='hd-card mb-4 p-4'>
        <div className='relative'>
          <Icon icon='mdi:magnify' fontSize={18} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input type='search' className='hd-input pl-10' placeholder={t('roles.searchPlaceholder')} value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className='hd-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='bg-brand-600 text-xs uppercase tracking-wide text-white'>
                <th className='px-4 py-3'>{t('roles.cols.role')}</th>
                <th className='px-4 py-3'>{t('roles.cols.options')}</th>
                <th className='px-4 py-3'>{t('roles.cols.modules')}</th>
                <th className='px-4 py-3'>{t('ref.status')}</th>
                <th className='px-4 py-3 text-right'>{t('list.cols.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className='px-4 py-4'>
                          <div className='h-3 animate-pulse rounded bg-gray-200' />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map(r => {
                    const mods = allowedModules(r.permissions)
                    return (
                      <tr
                        key={r.id}
                        onClick={() => can(UserAction.Edit) && router.push(`/role/edit/${r.id}`)}
                        className={cn('border-0 border-b border-solid border-gray-100 even:bg-gray-50/60 hover:bg-brand-50', can(UserAction.Edit) && 'cursor-pointer')}
                      >
                        <td className='px-4 py-3'>
                          <p className='m-0 font-semibold text-gray-900'>{r.displayName || r.name}</p>
                          <p className='m-0 font-mono text-xs text-gray-500'>{r.name}</p>
                        </td>
                        <td className='px-4 py-3'>
                          <div className='flex flex-wrap gap-1'>
                            <Flag on={r.adminPermission} icon='mdi:crown-outline' label={t('roles.admin')} tone='bg-harvest-50 text-harvest-700' />
                            <Flag on={r.isForOperator} icon='mdi:account-tie-outline' label={t('roles.isForOperator')} tone='bg-sky-50 text-sky-700' />
                            <Flag on={r.sendRequesterEmail} icon='mdi:email-outline' label={t('roles.sendRequesterEmail')} tone='bg-brand-50 text-brand-700' />
                            {!r.adminPermission && !r.isForOperator && !r.sendRequesterEmail && <span className='text-gray-400'>—</span>}
                          </div>
                        </td>
                        <td className='px-4 py-3'>
                          {r.adminPermission ? (
                            <span className='text-xs font-semibold text-harvest-700'>{t('roles.all')}</span>
                          ) : mods.length ? (
                            <div className='flex flex-wrap gap-1'>
                              {mods.map(m => (
                                <span key={m} className='rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700'>
                                  {t(`roles.entities.${m}`, m)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className='text-gray-400'>—</span>
                          )}
                        </td>
                        <td className='px-4 py-3'>
                          <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', r.isActive !== false ? 'bg-leaf-50 text-leaf-700 ring-leaf-100' : 'bg-gray-100 text-gray-500 ring-gray-200')}>
                            {r.isActive !== false ? t('common.active') : t('common.inactive')}
                          </span>
                        </td>
                        <td className='whitespace-nowrap px-4 py-3 text-right' onClick={e => e.stopPropagation()}>
                          {can(UserAction.Edit) && (
                            <button type='button' title={t('common.edit')} onClick={() => router.push(`/role/edit/${r.id}`)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-brand-700'>
                              <Icon icon='mdi:pencil-outline' fontSize={18} />
                            </button>
                          )}
                          {can(UserAction.Delete) && !r.adminPermission && (
                            <button type='button' title={t('common.delete')} onClick={() => setToDelete(r)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-red-600'>
                              <Icon icon='mdi:trash-can-outline' fontSize={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
        {!loading && rows.length === 0 && <EmptyState icon='mdi:shield-search' title={t('common.noResult')} />}
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
        message={t('roles.confirmDelete', { name: toDelete?.displayName || toDelete?.name || '' })}
        confirmLabel={t('common.delete')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default RoleList
