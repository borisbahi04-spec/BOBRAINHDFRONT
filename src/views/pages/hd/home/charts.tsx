// Petits graphiques sans dépendance (SVG / CSS), une seule teinte : vert Dekel
import { useState } from 'react'
import { cn } from 'src/components/hd'

/** Histogramme vertical (série unique) avec info-bulle au survol */
export const TrendBars = ({
  data,
  formatLabel,
  formatTooltip
}: {
  data: { date: string; total: number }[]
  formatLabel: (d: string) => string
  formatTooltip: (d: { date: string; total: number }) => string
}) => {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(1, ...data.map(d => d.total))
  const step = Math.max(1, Math.ceil(data.length / 8)) // ~8 libellés max sur l'axe
  const ticks = [max, Math.round(max / 2), 0]

  return (
    <div className='relative'>
      <div className='flex h-48 gap-3'>
        {/* axe Y discret */}
        <div className='flex flex-col justify-between py-0.5 text-right text-[10px] tabular-nums text-gray-400'>
          {ticks.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
        <div className='relative flex-1'>
          {/* grille */}
          {[0, 50, 100].map(p => (
            <div key={p} className='absolute inset-x-0 border-0 border-t border-dashed border-gray-100' style={{ top: `${p}%` }} />
          ))}
          <div className='absolute inset-0 flex items-end gap-[2px]'>
            {data.map((d, i) => (
              <div
                key={d.date}
                className='group relative flex h-full flex-1 cursor-default items-end'
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className={cn('w-full rounded-t transition-colors', hover === i ? 'bg-brand-700' : 'bg-brand-500')}
                  style={{ height: `${(d.total / max) * 100}%`, minHeight: d.total > 0 ? 3 : 0 }}
                />
                {hover === i && (
                  <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-pop'>
                    {formatTooltip(d)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='ml-8 mt-1.5 flex gap-[2px] text-[10px] text-gray-400'>
        {data.map((d, i) => (
          <span key={d.date} className='flex-1 overflow-visible whitespace-nowrap text-center'>
            {i % step === 0 ? formatLabel(d.date) : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Barres horizontales classées (série unique), libellé + valeur en texte */
export const RankBars = ({
  rows,
  empty
}: {
  rows: { label: string; hint?: string; value: number; extra?: string }[]
  empty: string
}) => {
  const max = Math.max(1, ...rows.map(r => r.value))
  if (!rows.length) return <p className='m-0 py-6 text-center text-sm text-gray-400'>{empty}</p>
  return (
    <ul className='m-0 list-none space-y-3 p-0'>
      {rows.map(r => (
        <li key={r.label + (r.hint ?? '')} title={`${r.label} : ${r.value}`}>
          <div className='mb-1 flex items-baseline justify-between gap-3 text-sm'>
            <span className='min-w-0 truncate font-semibold text-gray-800'>
              {r.label}
              {r.hint && <span className='ml-1.5 font-mono text-xs font-normal text-gray-400'>{r.hint}</span>}
            </span>
            <span className='shrink-0 tabular-nums text-gray-700'>
              <span className='font-bold'>{r.value}</span>
              {r.extra && <span className='ml-1.5 text-xs text-gray-400'>{r.extra}</span>}
            </span>
          </div>
          <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
            <div className='h-full rounded-full bg-brand-500' style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
