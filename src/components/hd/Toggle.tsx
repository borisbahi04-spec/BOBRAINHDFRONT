import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  help?: string
}

/** Interrupteur on/off (checkbox stylée) */
const Toggle = forwardRef<HTMLInputElement, Props>(({ label, help, id, ...rest }, ref) => (
  <label htmlFor={id} className='flex cursor-pointer items-start gap-3 py-1.5'>
    <span className='relative mt-0.5 inline-flex shrink-0'>
      <input id={id} ref={ref} type='checkbox' className='peer sr-only' {...rest} />
      <span className='h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100' />
      <span className='absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4' />
    </span>
    <span>
      <span className='block text-sm font-semibold text-gray-800'>{label}</span>
      {help && <span className='block text-xs text-gray-500'>{help}</span>}
    </span>
  </label>
))
Toggle.displayName = 'Toggle'

export default Toggle
