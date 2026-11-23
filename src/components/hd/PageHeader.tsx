import { ReactNode } from 'react'
import Icon from 'src/@core/components/icon'
import LangSwitch from './LangSwitch'

interface Props {
  icon: string
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}

/** En-tête de page charte DKL : pastille verte, titre, actions, bascule de langue. */
const PageHeader = ({ icon, title, subtitle, actions }: Props) => (
  <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
    <div className='flex min-w-0 items-center gap-3'>
      <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-card'>
        <Icon icon={icon} fontSize={22} />
      </span>
      <div className='min-w-0'>
        <h1 className='m-0 truncate text-xl font-bold text-brand-700'>{title}</h1>
        {subtitle && <p className='m-0 mt-0.5 truncate text-sm text-gray-500'>{subtitle}</p>}
      </div>
    </div>
    <div className='flex flex-wrap items-center gap-2'>
      {actions}
      <LangSwitch />
    </div>
  </div>
)

export default PageHeader
