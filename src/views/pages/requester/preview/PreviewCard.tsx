// Fiche détail d'une demande — Tailwind, charte DKL, FR/EN (imprimable)
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { RootState } from 'src/redux/store'
import { useHd } from 'src/i18n/helpdesk'
import { PriorityBadge, StatusBadge } from 'src/components/hd'
import { labAgentName, userName } from '../shared/options'

interface Props {
  printref?: any
  [key: string]: any
}

const Info = ({ icon, label, children }: { icon: string; label: string; children: ReactNode }) => (
  <div className='flex min-w-0 items-start gap-3'>
    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600'>
      <Icon icon={icon} fontSize={18} />
    </span>
    <div className='min-w-0'>
      <p className='m-0 text-[11px] font-semibold uppercase tracking-wide text-gray-500'>{label}</p>
      <div className='mt-0.5 break-words text-sm font-semibold text-gray-900'>{children || '—'}</div>
    </div>
  </div>
)

const TextBlock = ({ title, icon, accent, children }: { title: string; icon: string; accent: string; children?: string }) => (
  <div className={`rounded-lg border border-solid border-gray-200 border-l-4 ${accent} bg-white p-4`}>
    <p className='m-0 mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-700'>
      <Icon icon={icon} fontSize={16} />
      {title}
    </p>
    <p className='m-0 whitespace-pre-wrap text-sm leading-relaxed text-gray-800'>{children?.trim() || '—'}</p>
  </div>
)

const actorName = (a: any) =>
  [a?.userData?.lastName, a?.userData?.firstName].filter(Boolean).join(' ') || a?.username || a?.userData?.username || '—'

const PreviewCard = ({ printref }: Props) => {
  const data = useSelector((state: RootState) => state.requester.previewdata)
  const { t, formatDate } = useHd()

  if (!data) return null

  const tickets = String(data.ticket ?? '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)

  const history = [
    { key: 'created', who: data.createdBy, at: data.createdAt, icon: 'mdi:plus-circle-outline', dot: 'bg-sky-500' },
    { key: 'approved', who: data.approvedBy, at: data.approvedAt, icon: 'mdi:check-circle-outline', dot: 'bg-brand-600' },
    { key: 'rejected', who: data.rejectedBy, at: data.rejectedAt, icon: 'mdi:close-circle-outline', dot: 'bg-red-500' },
    { key: 'treated', who: data.treatedBy, at: data.treatedAt, icon: 'mdi:wrench-check-outline', dot: 'bg-leaf-500' },
    { key: 'cancelled', who: data.cancelledBy, at: data.cancelledAt, icon: 'mdi:cancel', dot: 'bg-gray-400' },
    { key: 'closed', who: data.closedBy, at: data.closedAt, icon: 'mdi:lock-check-outline', dot: 'bg-gray-700' }
  ]
    .filter(h => h.who)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

  return (
    <div ref={printref} className='hd-card overflow-hidden font-sans'>
      {/* En-tête */}
      <div className='flex flex-col gap-3 bg-brand-600 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <p className='m-0 text-[11px] font-bold uppercase tracking-widest text-leaf-100'>BOBRAIN HELPDESK</p>
          <h2 className='m-0 mt-1 text-xl font-bold'>{t('preview.title', { ref: data.reference })}</h2>
          <p className='m-0 mt-1 text-sm text-brand-100'>
            {t('preview.createdBy', { user: actorName(data.createdBy), date: formatDate(data.createdAt) })}
          </p>
        </div>
        <div className='flex items-center gap-3 rounded-lg bg-white px-3 py-2'>
          <PriorityBadge priority={data.priority} />
          <span className='h-4 w-px bg-gray-200' />
          <StatusBadge status={data.status} />
        </div>
      </div>

      {/* Informations */}
      <div className='grid gap-5 border-0 border-b border-solid border-gray-100 px-6 py-6 sm:grid-cols-2 xl:grid-cols-3'>
        <Info icon='mdi:ticket-confirmation-outline' label={t('form.ticket')}>
          <div className='flex flex-wrap gap-1'>
            {tickets.length
              ? tickets.map((tk: string) => (
                  <span key={tk} className='rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs'>
                    {tk}
                  </span>
                ))
              : '—'}
          </div>
        </Info>
        <Info icon='mdi:factory' label={t('form.station')}>
          {data.station?.displayName}
        </Info>
        <Info icon='mdi:shape-outline' label={t('form.requestType')}>
          {data.requesttype?.displayName}
        </Info>
        <Info icon='mdi:flask-outline' label={t('form.labAgent')}>
          {data.labAgent && (
            <>
              {labAgentName(data.labAgent)}
              <span className='ml-1 font-mono text-xs font-normal text-gray-500'>({data.labAgent.matricule})</span>
            </>
          )}
        </Info>
        <Info icon='mdi:account-tie-outline' label={t('form.operator')}>
          {data.operator && userName(data.operator)}
        </Info>
        <Info icon='mdi:domain' label={t('form.branch')}>
          {data.branch?.displayName}
        </Info>
      </div>

      {/* Problème & correction */}
      <div className='grid gap-4 px-6 py-6 lg:grid-cols-2'>
        <TextBlock title={t('preview.problem')} icon='mdi:alert-circle-outline' accent='border-l-harvest-500'>
          {data.description}
        </TextBlock>
        <TextBlock title={t('preview.correction')} icon='mdi:check-decagram-outline' accent='border-l-leaf-500'>
          {data.correction}
        </TextBlock>
        {data.title && !data.correction && (
          <p className='m-0 text-xs text-gray-500 lg:col-span-2'>
            {t('preview.legacyTitle')} : <span className='font-semibold text-gray-700'>{data.title}</span>
          </p>
        )}
      </div>

      {/* Historique */}
      <div className='border-0 border-t border-solid border-gray-100 bg-gray-50 px-6 py-5'>
        <p className='m-0 mb-4 text-xs font-bold uppercase tracking-wide text-brand-700'>{t('preview.history')}</p>
        <ol className='m-0 list-none space-y-4 p-0'>
          {history.map((h, i) => (
            <li key={h.key} className='relative flex gap-3 pl-0'>
              {i < history.length - 1 && <span className='absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-gray-200' />}
              <span className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${h.dot}`}>
                <Icon icon={h.icon} fontSize={16} />
              </span>
              <div className='min-w-0 pt-0.5'>
                <p className='m-0 text-sm font-semibold text-gray-900'>
                  {t(`preview.${h.key}`)} <span className='font-normal text-gray-500'>· {actorName(h.who)}</span>
                </p>
                <p className='m-0 text-xs tabular-nums text-gray-500'>{formatDate(h.at)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Pied de page charte (impression) */}
      <div className='flex items-center justify-between bg-brand-600 px-6 py-2 text-xs text-white'>
        <span>Dekel Agri-Vision · Helpdesk</span>
        <span className='flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-harvest-500 px-2 font-bold'>
          {data.reference}
        </span>
      </div>
    </div>
  )
}

export default PreviewCard
