import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useHd } from 'src/i18n/helpdesk'
import { cn } from 'src/components/hd'
import { getSearchrequestersService } from 'src/myservices/requester/requester-service'

const DOT: Record<string, string> = {
  Open: 'bg-sky-500',
  Approved: 'bg-brand-500',
  Treated: 'bg-leaf-500',
  Closed: 'bg-gray-400',
  Cancelled: 'bg-gray-300',
  Rejected: 'bg-red-500'
}

/** Historique des dernières demandes — façon « conversations récentes » d'un chatbot */
const RecentRequests = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { t } = useHd()
  const router = useRouter()
  const [items, setItems] = useState<any[] | null>(null)
  const currentId = String(router.query.id ?? '')

  // rechargé à chaque changement de page (nouvelle demande, changement de statut…)
  useEffect(() => {
    let alive = true
    getSearchrequestersService({}, { page: 1, per_page: 8 }).then((res: any) => {
      if (alive) setItems(Array.isArray(res?.data) ? res.data : [])
    })
    return () => {
      alive = false
    }
  }, [router.asPath])

  return (
    <div className='mt-5'>
      <div className='flex items-center justify-between px-3 pb-1'>
        <p className='m-0 text-[11px] font-bold uppercase tracking-wider text-gray-400'>{t('nav.recent')}</p>
        <Link href='/requester/list' onClick={onNavigate} className='text-[11px] font-semibold text-brand-600 no-underline hover:underline'>
          {t('nav.seeAll')}
        </Link>
      </div>
      {items === null && (
        <div className='space-y-2 px-3 py-1'>
          {[0, 1, 2].map(i => (
            <div key={i} className='h-3 animate-pulse rounded bg-gray-200' />
          ))}
        </div>
      )}
      {items?.length === 0 && <p className='m-0 px-3 py-2 text-xs text-gray-400'>{t('nav.noRecent')}</p>}
      <ul className='m-0 list-none space-y-0.5 p-0'>
        {items?.map(r => {
          const active = currentId === r.id
          return (
            <li key={r.id}>
              <Link
                href={`/requester/preview/${r.id}`}
                onClick={onNavigate}
                title={r.description ?? r.reference}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm no-underline transition',
                  active ? 'bg-white font-semibold text-gray-900 shadow-card' : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                )}
              >
                <span className={cn('h-2 w-2 shrink-0 rounded-full', DOT[r.status] ?? 'bg-gray-300')} />
                <span className='min-w-0 flex-1'>
                  <span className='block truncate'>{r.description?.trim() || r.ticket || r.reference}</span>
                  <span className='block truncate text-[11px] text-gray-400'>
                    {r.reference} · {t(`status.${r.status}`)}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RecentRequests
