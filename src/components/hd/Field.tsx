import { ReactNode } from 'react'
import Icon from 'src/@core/components/icon'
import { cn } from './cn'

interface FieldProps {
  id: string
  label: string
  required?: boolean
  /** Mention « facultatif » affichée après le libellé */
  optionalLabel?: string
  error?: string
  help?: ReactNode
  counter?: ReactNode
  className?: string
  children: ReactNode
}

/** Enveloppe d'un champ : libellé, aide, compteur et message d'erreur accessibles. */
const Field = ({ id, label, required, optionalLabel, error, help, counter, className, children }: FieldProps) => (
  <div className={cn('min-w-0', className)}>
    <label htmlFor={id} className='hd-label'>
      {label}
      {required && (
        <span className='ml-0.5 text-red-500' aria-hidden>
          *
        </span>
      )}
      {optionalLabel && <span className='ml-1.5 text-xs font-normal text-gray-400'>({optionalLabel})</span>}
    </label>
    {children}
    <div className='mt-1.5 flex min-h-[1.25rem] items-start justify-between gap-3 text-xs'>
      {error ? (
        <p id={`${id}-error`} role='alert' className='m-0 flex items-center gap-1 text-red-600'>
          <Icon icon='mdi:alert-circle-outline' fontSize={14} />
          {error}
        </p>
      ) : help ? (
        <p id={`${id}-help`} className='m-0 text-gray-500'>
          {help}
        </p>
      ) : (
        <span />
      )}
      {counter && <span className='shrink-0 tabular-nums text-gray-400'>{counter}</span>}
    </div>
  </div>
)

export default Field
