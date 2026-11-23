import Icon from 'src/@core/components/icon'
import { useHd } from 'src/i18n/helpdesk'
import { cn } from './cn'

const STATUS_STYLE: Record<string, { cls: string; icon: string }> = {
  Open: { cls: 'bg-sky-50 text-sky-700 ring-sky-200', icon: 'mdi:circle-outline' },
  Approved: { cls: 'bg-brand-50 text-brand-700 ring-brand-200', icon: 'mdi:check-circle-outline' },
  Treated: { cls: 'bg-leaf-50 text-leaf-700 ring-leaf-100', icon: 'mdi:wrench-check-outline' },
  Closed: { cls: 'bg-gray-100 text-gray-700 ring-gray-200', icon: 'mdi:lock-check-outline' },
  Cancelled: { cls: 'bg-gray-50 text-gray-500 ring-gray-200', icon: 'mdi:cancel' },
  Rejected: { cls: 'bg-red-50 text-red-700 ring-red-200', icon: 'mdi:close-circle-outline' }
}

const PRIORITY_STYLE: Record<string, string> = {
  Normal: 'bg-gray-400',
  Important: 'bg-harvest-500',
  Urgent: 'bg-red-500'
}

export const StatusBadge = ({ status }: { status?: string }) => {
  const { t } = useHd()
  if (!status) return <span className='text-gray-400'>—</span>
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Closed
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        s.cls
      )}
    >
      <Icon icon={s.icon} fontSize={13} />
      {t(`status.${status}`, status)}
    </span>
  )
}

export const PriorityBadge = ({ priority }: { priority?: string }) => {
  const { t } = useHd()
  if (!priority) return <span className='text-gray-400'>—</span>
  return (
    <span className='inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-gray-700'>
      <span className={cn('h-2 w-2 rounded-full', PRIORITY_STYLE[priority] ?? 'bg-gray-400')} />
      {t(`priority.${priority}`, priority)}
    </span>
  )
}
