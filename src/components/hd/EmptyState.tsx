import { ReactNode } from 'react'
import Icon from 'src/@core/components/icon'

const EmptyState = ({ icon = 'mdi:inbox-outline', title, text, action }: { icon?: string; title: string; text?: string; action?: ReactNode }) => (
  <div className='flex flex-col items-center justify-center px-6 py-14 text-center'>
    <span className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-harvest-50 text-harvest-600'>
      <Icon icon={icon} fontSize={28} />
    </span>
    <p className='m-0 text-base font-bold text-gray-800'>{title}</p>
    {text && <p className='m-0 mt-1 max-w-sm text-sm text-gray-500'>{text}</p>}
    {action && <div className='mt-4'>{action}</div>}
  </div>
)

export default EmptyState
