import { ReactNode } from 'react'
import Icon from 'src/@core/components/icon'
import { cn } from './cn'

/** Section de formulaire : titre + aide à gauche, champs à droite */
const FormSection = ({ icon, title, help, children, cols = 2 }: { icon: string; title: string; help?: string; children: ReactNode; cols?: 1 | 2 }) => (
  <section className='grid gap-6 border-0 border-b border-solid border-gray-100 px-6 py-6 last:border-b-0 lg:grid-cols-[240px_1fr]'>
    <div>
      <div className='flex items-center gap-2'>
        <span className='flex h-7 w-7 items-center justify-center rounded-full bg-harvest-500 text-white'>
          <Icon icon={icon} fontSize={16} />
        </span>
        <h2 className='m-0 text-sm font-bold uppercase tracking-wide text-brand-700'>{title}</h2>
      </div>
      {help && <p className='m-0 mt-2 text-sm text-gray-500'>{help}</p>}
    </div>
    <div className={cn('grid min-w-0 gap-x-5 gap-y-1', cols === 2 && 'md:grid-cols-2')}>{children}</div>
  </section>
)

export default FormSection
