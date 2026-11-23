import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import Icon from 'src/@core/components/icon'
import { cn } from './cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
type Size = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: string
  loading?: boolean
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-200 border-transparent',
  secondary: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-200',
  ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 focus-visible:ring-gray-200',
  danger: 'bg-white text-red-600 border-red-200 hover:bg-red-50 focus-visible:ring-red-100',
  accent: 'bg-harvest-500 text-white hover:bg-harvest-600 focus-visible:ring-harvest-100 border-transparent'
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, disabled, className, children, type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-solid font-semibold',
        'outline-none transition focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading ? (
        <span className='h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent' />
      ) : (
        icon && <Icon icon={icon} fontSize={size === 'sm' ? 16 : 18} />
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'

export default Button
