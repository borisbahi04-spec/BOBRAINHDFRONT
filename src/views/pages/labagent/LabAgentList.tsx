import { useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { Button, ConfirmDialog, EmptyState, PageHeader, Pagination, cn } from 'src/components/hd'
import { deleteLabAgentService, listLabAgentsService } from 'src/myservices/labagent/labagent-service'
import LabAgentForm from './LabAgentForm'

const name = (a: any) => [a?.lastName, a?.firstName].filter(Boolean).join(' ')

const LabAgentList = () => {
  const { t } = useHd()
  const ability = useContext(AbilityContext)
  const canManage = ability.can(UserAction.Create, EntityAbility.STATION) || ability.can(UserAction.Manage, EntityAbility.All)

  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [active, setActive] = useState<'' | 'true' | 'false'>('true')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null | undefined>(undefined) // undefined = fermé, null = création
  const [toDelete, setToDelete] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const h = setTimeout(() => {
      setDebounced(q)
      setPage(1)
    }, 350)
    return () => clearTimeout(h)
  }, [q])

  const load = useCallback(async () => {
    setLoading(true)
    const res: any = await listLabAgentsService(debounced, active, page, perPage)
    setLoading(false)
    if (isApiError(res) || !Array.isArray(res?.data)) {
      setRows([])
      setTotal(0)
      return toast.error(extractApiError(res, t('common.unexpectedError')))
    }
    setRows(res.data)
    setTotal(res.total ?? res.data.length)
  }, [debounced, active, page, perPage, t])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    setDeleting(true)
    const res: any = await deleteLabAgentService(toDelete.id)
    setDeleting(false)
    setToDelete(null)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(res?.deactivated ? t('labAgent.deactivated') : t('labAgent.deleted'))
    load()
  }

  return (
    <div className='w-full font-sans'>
      <PageHeader
        icon='mdi:flask-outline'
        title={t('labAgent.title')}
        subtitle={t('labAgent.subtitle')}
        actions={
          canManage && (
            <Button icon='mdi:plus' onClick={() => setEditing(null)}>
              {t('labAgent.add')}
            </Button>
          )
        }
      />

      <div className='hd-card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Icon icon='mdi:magnify' fontSize={18} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input type='search' className='hd-input pl-10' placeholder={t('labAgent.searchPlaceholder')} value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select
          className='hd-input sm:w-56'
          value={active}
          onChange={e => {
            setActive(e.target.value as any)
            setPage(1)
          }}
        >
          <option value='true'>{t('labAgent.onlyActive')}</option>
          <option value='false'>{t('common.inactive')}</option>
          <option value=''>{t('common.all')}</option>
        </select>
      </div>

      <div className='hd-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='bg-brand-600 text-xs uppercase tracking-wide text-white'>
                <th className='px-4 py-3'>{t('labAgent.matricule')}</th>
                <th className='px-4 py-3'>{t('labAgent.lastName')}</th>
                <th className='px-4 py-3'>{t('labAgent.firstName')}</th>
                <th className='px-4 py-3'>{t('labAgent.phone')}</th>
                <th className='px-4 py-3'>{t('labAgent.status')}</th>
                {canManage && <th className='px-4 py-3 text-right'>{t('list.cols.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: canManage ? 6 : 5 }).map((__, j) => (
                        <td key={j} className='px-4 py-3.5'>
                          <div className='h-3 animate-pulse rounded bg-gray-200' />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map(a => (
                    <tr key={a.id} className='border-0 border-b border-solid border-gray-100 even:bg-gray-50/60 hover:bg-brand-50'>
                      <td className='px-4 py-3 font-mono font-semibold text-brand-700'>{a.matricule}</td>
                      <td className='px-4 py-3 font-semibold'>{a.lastName}</td>
                      <td className='px-4 py-3'>{a.firstName || '—'}</td>
                      <td className='px-4 py-3 tabular-nums'>{a.phoneNumber || '—'}</td>
                      <td className='px-4 py-3'>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                            a.isActive ? 'bg-leaf-50 text-leaf-700 ring-leaf-100' : 'bg-gray-100 text-gray-500 ring-gray-200'
                          )}
                        >
                          {a.isActive ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      {canManage && (
                        <td className='whitespace-nowrap px-4 py-3 text-right'>
                          <button type='button' title={t('common.edit')} onClick={() => setEditing(a)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-brand-700'>
                            <Icon icon='mdi:pencil-outline' fontSize={18} />
                          </button>
                          <button type='button' title={t('common.delete')} onClick={() => setToDelete(a)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-red-600'>
                            <Icon icon='mdi:trash-can-outline' fontSize={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && rows.length === 0 && <EmptyState icon='mdi:flask-empty-outline' title={t('common.noResult')} />}
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

      <LabAgentForm
        open={editing !== undefined}
        agent={editing}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined)
          load()
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        danger
        loading={deleting}
        title={t('common.delete')}
        message={t('labAgent.confirmDelete', { name: name(toDelete) })}
        confirmLabel={t('common.delete')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default LabAgentList
