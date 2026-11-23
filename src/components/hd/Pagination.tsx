import Icon from 'src/@core/components/icon'
import { useHd } from 'src/i18n/helpdesk'

interface Props {
  page: number
  perPage: number
  total: number
  onPage: (page: number) => void
  onPerPage: (perPage: number) => void
}

const Pagination = ({ page, perPage, total, onPage, onPerPage }: Props) => {
  const { t } = useHd()
  const pages = Math.max(1, Math.ceil(total / perPage))
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  const btn =
    'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className='flex flex-col gap-3 border-0 border-t border-solid border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-2'>
        <select
          className='hd-input h-8 w-auto py-0 pr-8 text-xs'
          value={perPage}
          onChange={e => onPerPage(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>{t('common.perPage')}</span>
      </div>
      <div className='flex items-center gap-3'>
        <span className='tabular-nums'>{t('common.showing', { from, to, total })}</span>
        <div className='flex gap-1'>
          <button type='button' className={btn} disabled={page <= 1} onClick={() => onPage(1)}>
            <Icon icon='mdi:chevron-double-left' fontSize={18} />
          </button>
          <button type='button' className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)}>
            <Icon icon='mdi:chevron-left' fontSize={18} />
          </button>
          <span className='flex h-8 min-w-[3rem] items-center justify-center font-semibold tabular-nums text-gray-800'>
            {page} / {pages}
          </span>
          <button type='button' className={btn} disabled={page >= pages} onClick={() => onPage(page + 1)}>
            <Icon icon='mdi:chevron-right' fontSize={18} />
          </button>
          <button type='button' className={btn} disabled={page >= pages} onClick={() => onPage(pages)}>
            <Icon icon='mdi:chevron-double-right' fontSize={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
