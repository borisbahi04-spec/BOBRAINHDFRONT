// Liste des demandes d'intervention — Tailwind, charte DKL, FR/EN
import { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import Icon from 'src/@core/components/icon'
import { RootState } from 'src/redux/store'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { enumStatus, PriorityEnum } from 'src/definitions/enum'
import { SESSIONEXPIRECODE } from 'src/myCustomFunctions'
import { getSearchrequestersService } from 'src/myservices/requester/requester-service'
import { extractApiError } from 'src/helpers/apiError'
import { useHd } from 'src/i18n/helpdesk'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import { Button, EmptyState, PageHeader, Pagination, PriorityBadge, SearchSelect, StatusBadge, cn } from 'src/components/hd'

import { useRequesterFilters } from './useRequesterFilters'
import { labAgentName, loadAllLabAgents, loadOperators, loadRequestTypes, loadStations, loadUsers, userName } from '../shared/options'

const isoDay = (d: Date) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return z.toISOString().slice(0, 10)
}

const TicketChips = ({ value }: { value?: string }) => {
  const items = String(value ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  if (!items.length) return <span className='text-gray-400'>—</span>
  return (
    <div className='flex flex-wrap items-center gap-1' title={items.join(', ')}>
      {items.slice(0, 1).map(tk => (
        <span key={tk} className='whitespace-nowrap rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700'>
          {tk}
        </span>
      ))}
      {items.length > 1 && <span className='text-xs font-semibold text-gray-500'>+{items.length - 1}</span>}
    </div>
  )
}

const RequesterList = () => {
  const router = useRouter()
  const ability = useContext(AbilityContext)
  const { t, formatDate } = useHd()
  const session = useSelector((state: RootState) => state.auth?.getuserprofile?.session)
  const isOperator = !!session?.role?.isForOperator

  const { filters, update, clear, activeCount, invalidRange, apiFilters, page, setPage, perPage, setPerPage, ready } =
    useRequesterFilters()

  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [search, setSearch] = useState('')
  const reqId = useRef(0)

  // champ de recherche « debouncé » (400 ms)
  useEffect(() => setSearch(filters.value), [filters.value])
  useEffect(() => {
    if (search === filters.value) return
    const h = setTimeout(() => update({ value: search }), 400)
    return () => clearTimeout(h)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  // ouvrir le panneau si des filtres avancés sont actifs (ex : lien partagé)
  useEffect(() => {
    if (filters.requesttype || filters.station || filters.labAgent || filters.operator || filters.createdBy) setShowMore(true)
  }, [ready]) // eslint-disable-line react-hooks/exhaustive-deps

  // Chargement des données
  useEffect(() => {
    if (!ready) return
    const current = ++reqId.current
    setLoading(true)
    setError(null)
    getSearchrequestersService(apiFilters, { page, per_page: perPage }).then((res: any) => {
      if (current !== reqId.current) return
      setLoading(false)
      if (res?.code === SESSIONEXPIRECODE || res?.statusCode === 401) return setExpired(true)
      if (res?.errors || res?.hasError || !Array.isArray(res?.data)) {
        setRows([])
        setTotal(0)
        return setError(extractApiError(res, t('common.unexpectedError')))
      }
      setRows(res.data)
      setTotal(res.total ?? res.data.length)
    })
  }, [apiFilters, page, perPage, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  if (expired) return <ExpiredSessionDialog />

  const canCreate = ability.can(UserAction.Create, EntityAbility.REQUESTER)
  const canEdit = ability.can(UserAction.Edit, EntityAbility.REQUESTER)

  const today = isoDay(new Date())
  const weekAgo = isoDay(new Date(Date.now() - 6 * 86400000))
  const quick = [
    { key: 'open', icon: 'mdi:circle-outline', on: filters.status === enumStatus.Open, toggle: () => update({ status: filters.status === enumStatus.Open ? '' : enumStatus.Open }) },
    { key: 'urgent', icon: 'mdi:alert-outline', on: filters.priority === PriorityEnum.Urgent, toggle: () => update({ priority: filters.priority === PriorityEnum.Urgent ? '' : PriorityEnum.Urgent }) },
    { key: 'today', icon: 'mdi:calendar-today', on: filters.startdate === today && filters.enddate === today, toggle: () => (filters.startdate === today && filters.enddate === today ? update({ startdate: '', enddate: '' }) : update({ startdate: today, enddate: today })) },
    { key: 'week', icon: 'mdi:calendar-week', on: filters.startdate === weekAgo && filters.enddate === today, toggle: () => (filters.startdate === weekAgo && filters.enddate === today ? update({ startdate: '', enddate: '' }) : update({ startdate: weekAgo, enddate: today })) }
  ]

  return (
    <div className='w-full font-sans'>
      <PageHeader
        icon='mdi:clipboard-list-outline'
        title={t('list.title')}
        subtitle={t('list.subtitle', { count: total })}
        actions={
          canCreate && (
            <Button icon='mdi:plus' onClick={() => router.push('/requester/add')}>
              {t('list.newRequest')}
            </Button>
          )
        }
      />

      {/* ================= FILTRES ================= */}
      <div className='hd-card mb-4 p-4'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,2fr)_1fr_1fr_1fr_1fr]'>
          <div className='relative'>
            <Icon icon='mdi:magnify' fontSize={18} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='search'
              className='hd-input pl-10'
              placeholder={t('list.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label={t('list.searchPlaceholder')}
            />
          </div>
          <select className='hd-input' value={filters.status} onChange={e => update({ status: e.target.value })} aria-label={t('list.status')}>
            <option value=''>{t('list.allStatuses')}</option>
            {Object.values(enumStatus).map(s => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
          <select className='hd-input' value={filters.priority} onChange={e => update({ priority: e.target.value })} aria-label={t('list.priority')}>
            <option value=''>{t('list.allPriorities')}</option>
            {Object.values(PriorityEnum).map(p => (
              <option key={p} value={p}>
                {t(`priority.${p}`)}
              </option>
            ))}
          </select>
          <label className='relative block'>
            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400'>{t('list.from')}</span>
            <input type='date' className='hd-input pl-14' value={filters.startdate} max={filters.enddate || undefined} onChange={e => update({ startdate: e.target.value })} />
          </label>
          <label className='relative block'>
            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400'>{t('list.to')}</span>
            <input
              type='date'
              className={cn('hd-input pl-14', invalidRange && 'hd-input-error')}
              value={filters.enddate}
              min={filters.startdate || undefined}
              onChange={e => update({ enddate: e.target.value })}
            />
          </label>
        </div>
        {invalidRange && <p className='m-0 mt-2 text-xs text-red-600'>{t('list.invalidRange')}</p>}

        {/* Recherche multiple « AY-00023|AY-00001 » : une puce par valeur */}
        {(() => {
          const terms = Array.from(new Set(search.split('|').map(s => s.trim()).filter(Boolean)))
          if (!search.includes('|')) return search ? null : <p className='m-0 mt-2 text-xs text-gray-400'>{t('list.multiHint')}</p>
          return (
            <div className='mt-2 flex flex-wrap items-center gap-1.5'>
              <span className='text-xs font-semibold text-gray-500'>{t('list.multiTerms', { count: terms.length })} :</span>
              {terms.map(term => (
                <span key={term} className='inline-flex items-center gap-1 rounded-md bg-brand-50 py-0.5 pl-2 pr-1 font-mono text-xs text-brand-700'>
                  {term}
                  <button
                    type='button'
                    aria-label={t('common.delete')}
                    onClick={() => setSearch(terms.filter(x => x !== term).join('|'))}
                    className='flex cursor-pointer rounded border-0 bg-transparent p-0.5 text-brand-600 hover:bg-brand-100'
                  >
                    <Icon icon='mdi:close' fontSize={12} />
                  </button>
                </span>
              ))}
            </div>
          )
        })()}

        {showMore && (
          <div className='mt-3 grid animate-fade-in gap-3 md:grid-cols-2 xl:grid-cols-5'>
            <SearchSelect value={filters.requesttype} onChange={o => update({ requesttype: o })} loadOptions={loadRequestTypes} icon='mdi:shape-outline' placeholder={t('list.requestType')} />
            {!isOperator && (
              <SearchSelect value={filters.station} onChange={o => update({ station: o })} loadOptions={loadStations} icon='mdi:factory' placeholder={t('list.station')} />
            )}
            <SearchSelect value={filters.labAgent} onChange={o => update({ labAgent: o })} loadOptions={loadAllLabAgents} icon='mdi:flask-outline' placeholder={t('list.labAgent')} />
            <SearchSelect value={filters.operator} onChange={o => update({ operator: o })} loadOptions={loadOperators} icon='mdi:account-tie-outline' placeholder={t('list.operator')} />
            {!isOperator && (
              <SearchSelect value={filters.createdBy} onChange={o => update({ createdBy: o })} loadOptions={loadUsers} icon='mdi:account-outline' placeholder={t('list.requester')} />
            )}
          </div>
        )}

        <div className='mt-3 flex flex-wrap items-center gap-2'>
          {quick.map(q => (
            <button
              key={q.key}
              type='button'
              onClick={q.toggle}
              aria-pressed={q.on}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid px-3 py-1 text-xs font-semibold transition',
                q.on ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-700'
              )}
            >
              <Icon icon={q.icon} fontSize={14} />
              {t(`list.quick.${q.key}`)}
            </button>
          ))}
          <span className='mx-1 hidden h-5 w-px bg-gray-200 sm:block' />
          <Button variant='ghost' size='sm' icon={showMore ? 'mdi:chevron-up' : 'mdi:tune-variant'} onClick={() => setShowMore(v => !v)}>
            {t('list.moreFilters')}
          </Button>
          {activeCount > 0 && (
            <Button variant='ghost' size='sm' icon='mdi:filter-remove-outline' onClick={clear} className='text-red-600 hover:bg-red-50'>
              {t('list.clearFilters')} ({activeCount})
            </Button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className='hd-card overflow-hidden'>
        {error && (
          <div className='flex items-center gap-2 border-0 border-b border-solid border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
            <Icon icon='mdi:alert-circle-outline' fontSize={18} /> {error}
          </div>
        )}

        {/* Desktop */}
        <div className='hidden overflow-x-auto lg:block'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='bg-brand-600 text-xs uppercase tracking-wide text-white'>
                {(['reference', 'date', 'ticket', 'station', 'type', 'labAgent', 'operator', 'priority', 'status'] as const).map(c => (
                  <th key={c} className={cn('whitespace-nowrap px-4 py-3 font-semibold', (c === 'type' || c === 'operator') && 'hidden 2xl:table-cell')}>
                    {t(`list.cols.${c}`)}
                  </th>
                ))}
                <th className='px-4 py-3 text-right font-semibold'>{t('list.cols.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`} className='border-0 border-b border-solid border-gray-100'>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className='px-4 py-3.5'>
                        <div className='h-3 animate-pulse rounded bg-gray-200' />
                      </td>
                    ))}
                  </tr>
                ))}
              {!loading &&
                rows.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/requester/preview/${r.id}`)}
                    className='cursor-pointer border-0 border-b border-solid border-gray-100 transition even:bg-gray-50/60 hover:bg-brand-50'
                  >
                    <td className='whitespace-nowrap px-4 py-3 font-semibold text-brand-700'>{r.reference}</td>
                    <td className='whitespace-nowrap px-4 py-3 tabular-nums text-gray-600'>{formatDate(r.createdAt)}</td>
                    <td className='px-4 py-3'>
                      <TicketChips value={r.ticket} />
                    </td>
                    <td className='max-w-[160px] truncate px-4 py-3'>{r.station?.displayName ?? '—'}</td>
                    <td className='hidden max-w-[160px] truncate px-4 py-3 2xl:table-cell'>{r.requesttype?.displayName ?? '—'}</td>
                    <td className='max-w-[160px] truncate px-4 py-3'>{r.labAgent ? labAgentName(r.labAgent) : '—'}</td>
                    <td className='hidden max-w-[140px] truncate px-4 py-3 2xl:table-cell'>{r.operator ? userName(r.operator) : '—'}</td>
                    <td className='px-4 py-3'>
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className='px-4 py-3'>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className='whitespace-nowrap px-4 py-3 text-right' onClick={e => e.stopPropagation()}>
                      {canEdit && r.status === enumStatus.Open && (
                        <Link href={`/requester/edit/${r.id}`} title={t('common.edit')} className='inline-flex rounded-md p-1.5 text-gray-500 hover:bg-white hover:text-brand-700'>
                          <Icon icon='mdi:pencil-outline' fontSize={18} />
                        </Link>
                      )}
                      <Link href={`/requester/preview/${r.id}`} title={t('common.view')} className='inline-flex rounded-md p-1.5 text-gray-500 hover:bg-white hover:text-brand-700'>
                        <Icon icon='mdi:eye-outline' fontSize={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / tablette : cartes */}
        <div className='lg:hidden [&>*+*]:border-0 [&>*+*]:border-t [&>*+*]:border-solid [&>*+*]:border-gray-100'>
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='space-y-2 p-4'>
                <div className='h-3 w-1/3 animate-pulse rounded bg-gray-200' />
                <div className='h-3 w-2/3 animate-pulse rounded bg-gray-200' />
              </div>
            ))}
          {!loading &&
            rows.map(r => (
              <Link key={r.id} href={`/requester/preview/${r.id}`} className='block p-4 text-inherit no-underline hover:bg-brand-50'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='m-0 font-semibold text-brand-700'>{r.reference}</p>
                    <p className='m-0 mt-0.5 text-xs text-gray-500'>{formatDate(r.createdAt)}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className='mt-2'>
                  <TicketChips value={r.ticket} />
                </div>
                <div className='mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600'>
                  <span className='truncate'>
                    <Icon icon='mdi:factory' fontSize={12} /> {r.station?.displayName ?? '—'}
                  </span>
                  <span className='truncate'>
                    <Icon icon='mdi:flask-outline' fontSize={12} /> {r.labAgent ? labAgentName(r.labAgent) : '—'}
                  </span>
                  <span className='truncate'>
                    <Icon icon='mdi:account-tie-outline' fontSize={12} /> {r.operator ? userName(r.operator) : '—'}
                  </span>
                  <PriorityBadge priority={r.priority} />
                </div>
              </Link>
            ))}
        </div>

        {!loading && rows.length === 0 && (
          <EmptyState
            icon='mdi:clipboard-search-outline'
            title={t('list.emptyTitle')}
            text={t('list.emptyText')}
            action={
              activeCount > 0 ? (
                <Button variant='secondary' icon='mdi:filter-remove-outline' onClick={clear}>
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
    </div>
  )
}

export default RequesterList
