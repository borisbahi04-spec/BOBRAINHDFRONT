// Accueil — inspiré des interfaces « chatbot » : salutation, barre de recherche
// façon prompt, suggestions, puis tableau de bord (KPI, évolution, classements, à traiter).
import { FormEvent, ReactNode, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import Icon from 'src/@core/components/icon'
import { RootState } from 'src/redux/store'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useHd } from 'src/i18n/helpdesk'
import { returnResponse } from 'src/myCustomFunctions'
import HttpService from 'src/myservices/HttpService'
import { getSearchrequestersService } from 'src/myservices/requester/requester-service'
import { LangSwitch, PriorityBadge, StatusBadge, cn } from 'src/components/hd'
import { labAgentName } from 'src/views/pages/requester/shared/options'
import { RankBars, TrendBars } from './charts'

type Period = 'last28Days' | 'currentMonth' | 'lastMonth' | 'currentYear' | 'lastYear' | 'yearMinus2' | 'yearMinus3'
const PERIODS: Period[] = ['last28Days', 'currentMonth', 'lastMonth', 'currentYear', 'lastYear', 'yearMinus2', 'yearMinus3']
/** Années passées : libellé = l'année elle-même (ex : 2025, 2024, 2023) */
const YEAR_OFFSET: Partial<Record<Period, number>> = { lastYear: 1, yearMinus2: 2, yearMinus3: 3 }

const Card = ({ title, action, children, className }: { title: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) => (
  <section className={cn('hd-card p-5', className)}>
    <div className='mb-4 flex items-center justify-between gap-3'>
      <h2 className='m-0 text-sm font-bold text-brand-700'>{title}</h2>
      {action}
    </div>
    {children}
  </section>
)

const Home = () => {
  const router = useRouter()
  const { t, lang } = useHd()
  const ability = useContext(AbilityContext)
  const session = useSelector((state: RootState) => state.auth?.getuserprofile?.session)
  const can = (a: UserAction, s: string) => !ability || ability.can(a, s)

  const [q, setQ] = useState('')
  const [period, setPeriod] = useState<Period>('last28Days')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [todo, setTodo] = useState<any[] | null>(null)
  const [trendTable, setTrendTable] = useState(false)

  const firstName = session?.userData?.firstName || session?.username || ''

  useEffect(() => {
    setLoading(true)
    returnResponse(new HttpService().getData(`stat/interventions?period=${period}`)).then((res: any) => {
      setStats(res?.globalStats ? res : null)
      setLoading(false)
    })
  }, [period])

  useEffect(() => {
    // demandes à approuver puis en traitement (les plus anciennes d'abord : priorité au retard)
    Promise.all([
      getSearchrequestersService({ status: 'Open' }, { page: 1, per_page: 6 }),
      getSearchrequestersService({ status: 'Approved' }, { page: 1, per_page: 6 })
    ]).then(([a, b]: any[]) => {
      const rows = [...(a?.data ?? []), ...(b?.data ?? [])]
      const rank = (p: string) => (p === 'Urgent' ? 0 : p === 'Important' ? 1 : 2)
      rows.sort((x, y) => rank(x.priority) - rank(y.priority) || new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime())
      setTodo(rows.slice(0, 6))
    })
  }, [])

  const ask = (e: FormEvent) => {
    e.preventDefault()
    router.push({ pathname: '/requester/list', query: q.trim() ? { value: q.trim() } : {} })
  }

  const chips = [
    can(UserAction.Create, EntityAbility.REQUESTER) && { key: 'new', icon: 'mdi:plus', href: '/requester/add' },
    { key: 'open', icon: 'mdi:circle-outline', href: '/requester/list?status=Open' },
    { key: 'urgent', icon: 'mdi:alert-outline', href: '/requester/list?priority=Urgent' },
    can(UserAction.Read, EntityAbility.STATION) && { key: 'agents', icon: 'mdi:flask-outline', href: '/labagent/list' }
  ].filter(Boolean) as { key: string; icon: string; href: string }[]

  const g = stats?.globalStats ?? {}
  const kpis = [
    { key: 'total', value: g.totalRequests, icon: 'mdi:clipboard-text-multiple-outline', href: '/requester/list' },
    { key: 'open', value: g.openRequests, icon: 'mdi:inbox-arrow-down-outline', href: '/requester/list?status=Open' },
    { key: 'approved', value: g.approvedRequests, icon: 'mdi:progress-wrench', href: '/requester/list?status=Approved' },
    { key: 'treated', value: g.treatedRequests, icon: 'mdi:wrench-check-outline', href: '/requester/list?status=Treated' },
    { key: 'closed', value: g.closedRequests, icon: 'mdi:lock-check-outline', href: '/requester/list?status=Closed' }
  ]

  const statusRows = [
    { s: 'Open', v: g.openRequests },
    { s: 'Approved', v: g.approvedRequests },
    { s: 'Treated', v: g.treatedRequests },
    { s: 'Closed', v: g.closedRequests },
    { s: 'Rejected', v: g.rejectedRequests },
    { s: 'Cancelled', v: g.cancelledRequests }
  ]
  const total = Math.max(1, g.totalRequests ?? 0)

  const locale = lang === 'en' ? 'en-GB' : 'fr-FR'
  const fmtBucket = (d: string, long = false) => {
    const parts = d.split('-').map(Number)
    const date = new Date(parts[0], parts[1] - 1, parts[2] ?? 1)
    return stats?.granularity === 'month'
      ? date.toLocaleDateString(locale, { month: long ? 'long' : 'short', year: long ? 'numeric' : undefined })
      : date.toLocaleDateString(locale, long ? { weekday: 'short', day: '2-digit', month: 'short' } : { day: '2-digit', month: '2-digit' })
  }

  const Skeleton = ({ h = 'h-40' }: { h?: string }) => <div className={cn('animate-pulse rounded-lg bg-gray-100', h)} />

  return (
    <div className='w-full font-sans'>
      {/* ===== Accueil façon chatbot ===== */}
      <div className='mx-auto max-w-3xl pb-8 pt-4 text-center'>
        <div className='mb-4 flex justify-end'>
          <LangSwitch />
        </div>
        <img src='/images/bobrain-mark.png' alt='BOBRAIN' className='mx-auto mb-4 block h-14 w-14 object-contain' />
        <h1 className='m-0 text-3xl font-bold text-brand-700'>{firstName ? t('home.hello', { name: firstName }) : t('home.helloAnon')}</h1>
        <p className='m-0 mt-2 text-base text-gray-500'>{t('home.tagline')}</p>

        <form onSubmit={ask} className='relative mt-6'>
          <Icon icon='mdi:magnify' fontSize={20} className='pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={t('home.askPlaceholder')}
            aria-label={t('home.askPlaceholder')}
            className='h-14 w-full rounded-2xl border border-solid border-gray-200 bg-white pl-12 pr-16 text-base text-gray-900 shadow-card outline-none transition placeholder:text-gray-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100'
            style={{ boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
          <button
            type='submit'
            aria-label={t('home.send')}
            className='absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border-0 bg-brand-600 text-white transition hover:bg-brand-700'
          >
            <Icon icon='mdi:arrow-up' fontSize={20} />
          </button>
        </form>

        <div className='mt-4 flex flex-wrap justify-center gap-2'>
          {chips.map(c => (
            <Link
              key={c.key}
              href={c.href}
              className='inline-flex items-center gap-1.5 rounded-full border border-solid border-gray-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 no-underline transition hover:border-brand-300 hover:text-brand-700'
            >
              <Icon icon={c.icon} fontSize={16} className={c.key === 'new' ? 'text-harvest-600' : 'text-gray-400'} />
              {t(`home.chips.${c.key}`)}
            </Link>
          ))}
        </div>
      </div>

      {/* ===== Filtre période (une seule ligne, au-dessus des graphiques) ===== */}
      <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
        <div role='tablist' className='inline-flex rounded-xl border border-solid border-gray-200 bg-white p-1'>
          {PERIODS.map(p => (
            <button
              key={p}
              type='button'
              role='tab'
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
              className={cn(
                'cursor-pointer rounded-lg border-0 px-3 py-1.5 text-xs font-semibold transition',
                period === p ? 'bg-brand-600 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'
              )}
            >
              {YEAR_OFFSET[p] ? new Date().getFullYear() - YEAR_OFFSET[p]! : t(`home.periods.${p}`)}
            </button>
          ))}
        </div>
      </div>

      {/* ===== KPI ===== */}
      <div className='mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5'>
        {kpis.map((k, i) => (
          <Link key={k.key} href={k.href} className='hd-card group block p-4 no-underline transition hover:border-brand-300'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{t(`home.kpi.${k.key}`)}</span>
              <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', i === 0 ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600')}>
                <Icon icon={k.icon} fontSize={18} />
              </span>
            </div>
            {loading ? (
              <div className='mt-3 h-8 w-16 animate-pulse rounded bg-gray-100' />
            ) : (
              <p className='m-0 mt-2 text-3xl font-bold tabular-nums text-gray-900'>{k.value ?? 0}</p>
            )}
          </Link>
        ))}
      </div>

      {/* ===== Évolution + statuts ===== */}
      <div className='mb-4 grid gap-4 xl:grid-cols-3'>
        <Card
          className='xl:col-span-2'
          title={
            <>
              {t('home.trend')}{' '}
              <span className='font-normal text-gray-400'>· {stats?.granularity === 'month' ? t('home.trendMonth') : t('home.trendDay')}</span>
            </>
          }
          action={
            <button type='button' onClick={() => setTrendTable(v => !v)} className='cursor-pointer border-0 bg-transparent text-xs font-semibold text-brand-600 hover:underline'>
              {trendTable ? t('home.showChart') : t('home.showTable')}
            </button>
          }
        >
          {loading ? (
            <Skeleton h='h-52' />
          ) : !stats?.trend?.length ? (
            <p className='m-0 py-16 text-center text-sm text-gray-400'>{t('home.noData')}</p>
          ) : trendTable ? (
            <div className='max-h-56 overflow-auto'>
              <table className='w-full border-collapse text-sm'>
                <thead>
                  <tr className='text-left text-xs uppercase text-gray-500'>
                    <th className='py-1.5'>{t('home.date')}</th>
                    <th className='py-1.5 text-right'>{t('home.kpi.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.trend.map((d: any) => (
                    <tr key={d.date} className='border-0 border-t border-solid border-gray-100'>
                      <td className='py-1.5'>{fmtBucket(d.date, true)}</td>
                      <td className='py-1.5 text-right tabular-nums'>{d.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <TrendBars
              data={stats.trend}
              formatLabel={d => fmtBucket(d)}
              formatTooltip={d => `${fmtBucket(d.date, true)} · ${t('home.requests', { count: d.total })}`}
            />
          )}
        </Card>

        <Card title={t('home.byStatus')}>
          {loading ? (
            <Skeleton />
          ) : (
            <ul className='m-0 list-none space-y-3 p-0'>
              {statusRows.map(r => (
                <li key={r.s}>
                  <div className='mb-1 flex items-center justify-between'>
                    <StatusBadge status={r.s} />
                    <span className='text-sm tabular-nums text-gray-700'>
                      <span className='font-bold'>{r.v ?? 0}</span>
                      <span className='ml-1.5 text-xs text-gray-400'>{Math.round(((r.v ?? 0) / total) * 100)}%</span>
                    </span>
                  </div>
                  <div className='h-1.5 overflow-hidden rounded-full bg-gray-100'>
                    <div className='h-full rounded-full bg-brand-500' style={{ width: `${((r.v ?? 0) / total) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* ===== À traiter + classements ===== */}
      <div className='grid gap-4 xl:grid-cols-3'>
        <Card
          title={t('home.todo')}
          action={
            <Link href='/requester/list?status=Open' className='text-xs font-semibold text-brand-600 no-underline hover:underline'>
              {t('home.seeAll')}
            </Link>
          }
        >
          {todo === null ? (
            <Skeleton />
          ) : todo.length === 0 ? (
            <div className='flex flex-col items-center py-8 text-center text-sm text-gray-500'>
              <span className='mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-leaf-50 text-leaf-600'>
                <Icon icon='mdi:check-all' fontSize={20} />
              </span>
              {t('home.todoEmpty')}
            </div>
          ) : (
            <ul className='m-0 list-none p-0'>
              {todo.map(r => (
                <li key={r.id} className='border-0 border-t border-solid border-gray-100 first:border-t-0'>
                  <Link href={`/requester/preview/${r.id}`} className='-mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 no-underline hover:bg-gray-50'>
                    <div className='min-w-0 flex-1'>
                      <p className='m-0 truncate text-sm font-semibold text-gray-900'>{r.description?.trim() || r.ticket}</p>
                      <p className='m-0 mt-0.5 truncate text-xs text-gray-500'>
                        {r.reference} · {r.station?.displayName ?? '—'}
                        {r.labAgent ? ` · ${labAgentName(r.labAgent)}` : ''}
                      </p>
                    </div>
                    <div className='flex shrink-0 flex-col items-end gap-1'>
                      <StatusBadge status={r.status} />
                      <PriorityBadge priority={r.priority} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={t('home.byAgent')}>
          {loading ? (
            <Skeleton />
          ) : (
            <RankBars
              empty={t('home.noData')}
              rows={(stats?.labAgentStats ?? []).map((a: any) => ({
                label: a.agent,
                hint: a.matricule,
                value: a.total,
                extra: a.open ? t('home.openCount', { count: a.open }) : undefined
              }))}
            />
          )}
        </Card>

        <Card title={t('home.byStation')}>
          {loading ? (
            <Skeleton />
          ) : (
            <RankBars
              empty={t('home.noData')}
              rows={[...(stats?.centreStats ?? [])]
                .sort((a: any, b: any) => b.total - a.total)
                .slice(0, 6)
                .map((c: any) => ({
                  label: c.centre,
                  value: c.total,
                  extra: c.open + c.approved ? t('home.openCount', { count: c.open + c.approved }) : undefined
                }))}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default Home
