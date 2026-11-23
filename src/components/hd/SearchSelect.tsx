import { KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { useHd } from 'src/i18n/helpdesk'
import { cn } from './cn'

export interface Option {
  id: string
  label: string
  hint?: string
  disabled?: boolean
}

interface Props {
  id?: string
  value: Option | null
  onChange: (option: Option | null) => void
  /** Recherche serveur (déjà « debouncée » par le composant) */
  loadOptions: (query: string) => Promise<Option[]>
  placeholder?: string
  icon?: string
  invalid?: boolean
  disabled?: boolean
  clearable?: boolean
  onBlur?: () => void
  'aria-describedby'?: string
}

/**
 * Liste déroulante avec recherche asynchrone (combobox ARIA) :
 * debounce 300 ms, navigation clavier (↑ ↓ Entrée Échap), effacement.
 */
const SearchSelect = ({
  id,
  value,
  onChange,
  loadOptions,
  placeholder,
  icon = 'mdi:magnify',
  invalid,
  disabled,
  clearable = true,
  onBlur,
  ...aria
}: Props) => {
  const { t } = useHd()
  const autoId = useId()
  const inputId = id ?? autoId
  const listId = `${inputId}-list`
  const wrapRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const reqId = useRef(0)

  const fetchOptions = useCallback(
    async (q: string) => {
      const current = ++reqId.current
      setLoading(true)
      try {
        const res = await loadOptions(q)
        if (current === reqId.current) {
          setOptions(res ?? [])
          setActive(0)
        }
      } catch {
        if (current === reqId.current) setOptions([])
      } finally {
        if (current === reqId.current) setLoading(false)
      }
    },
    [loadOptions]
  )

  // recherche « debouncée »
  useEffect(() => {
    if (!open) return
    const h = setTimeout(() => fetchOptions(query), 300)
    return () => clearTimeout(h)
  }, [query, open, fetchOptions])

  // fermeture au clic extérieur
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
        onBlur?.()
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onBlur])

  const select = (opt: Option) => {
    if (opt.disabled) return
    onChange(opt)
    setOpen(false)
    setQuery('')
    onBlur?.()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      setActive(a => Math.min(a + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && options[active]) {
        e.preventDefault()
        select(options[active])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={wrapRef} className='relative'>
      <div className='relative'>
        <span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400'>
          <Icon icon={icon} fontSize={18} />
        </span>
        <input
          id={inputId}
          type='text'
          role='combobox'
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete='list'
          aria-invalid={invalid || undefined}
          aria-describedby={aria['aria-describedby']}
          autoComplete='off'
          disabled={disabled}
          className={cn('hd-input pl-10 pr-16', invalid && 'hd-input-error', !open && value && 'font-medium')}
          placeholder={value ? value.label : placeholder}
          value={open ? query : value?.label ?? ''}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={e => {
            setQuery(e.target.value)
            if (!open) setOpen(true)
          }}
          onKeyDown={onKeyDown}
        />
        <span className='absolute inset-y-0 right-2 flex items-center gap-0.5'>
          {loading && (
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-solid border-brand-300 border-t-transparent' />
          )}
          {clearable && value && !disabled && (
            <button
              type='button'
              aria-label={t('common.reset')}
              className='flex cursor-pointer items-center rounded border-0 bg-transparent p-1 text-gray-400 hover:text-gray-700'
              onClick={() => {
                onChange(null)
                setQuery('')
              }}
            >
              <Icon icon='mdi:close' fontSize={16} />
            </button>
          )}
          <Icon icon='mdi:chevron-down' fontSize={18} className='text-gray-400' />
        </span>
      </div>

      {open && !disabled && (
        <ul
          id={listId}
          role='listbox'
          className='absolute z-50 m-0 mt-1 max-h-64 w-full animate-fade-in list-none overflow-auto rounded-lg border border-solid border-gray-200 bg-white p-1 shadow-pop'
        >
          {!loading && options.length === 0 && <li className='px-3 py-2.5 text-sm text-gray-500'>{t('common.noResult')}</li>}
          {options.map((opt, i) => {
            const selected = value?.id === opt.id
            return (
              <li
                key={opt.id}
                role='option'
                aria-selected={selected}
                aria-disabled={opt.disabled || undefined}
                onMouseEnter={() => setActive(i)}
                onMouseDown={e => {
                  e.preventDefault()
                  select(opt)
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm',
                  i === active && 'bg-brand-50',
                  selected && 'font-semibold text-brand-700',
                  opt.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <span className='min-w-0'>
                  <span className='block truncate'>{opt.label}</span>
                  {opt.hint && <span className='block truncate text-xs text-gray-500'>{opt.hint}</span>}
                </span>
                {selected && <Icon icon='mdi:check' fontSize={16} className='shrink-0 text-brand-600' />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default SearchSelect
