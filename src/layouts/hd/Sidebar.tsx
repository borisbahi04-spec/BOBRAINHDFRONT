import { FormEvent, useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { HD_NAV, HdNavItem } from 'src/navigation/hd'
import { useHd } from 'src/i18n/helpdesk'
import { cn } from 'src/components/hd'
import RecentRequests from './RecentRequests'
import UserMenu from './UserMenu'

interface Props {
  collapsed: boolean
  onToggle: () => void
  /** mode tiroir mobile : ferme le tiroir après navigation */
  onNavigate?: () => void
  mobile?: boolean
}

/**
 * Barre latérale inspirée des interfaces « chatbot » :
 * marque + bouton « Nouvelle demande », recherche, navigation,
 * historique des demandes récentes, carte utilisateur en pied.
 */
const Sidebar = ({ collapsed, onToggle, onNavigate, mobile }: Props) => {
  const router = useRouter()
  const ability = useContext(AbilityContext)
  const { t } = useHd()
  const [q, setQ] = useState('')
  const [adminOpen, setAdminOpen] = useState(true)

  const can = (i: HdNavItem) => !ability || ability.can(i.action as any, i.subject)
  const visible = (i: HdNavItem): boolean => (i.children ? i.children.some(visible) : can(i))
  const isActive = (path?: string) => !!path && (router.pathname === path || router.pathname.startsWith(path.replace(/\/list$/, '/')))
  const canCreate = !ability || ability.can(UserAction.Create, EntityAbility.REQUESTER)
  const canReadRequests = !ability || ability.can(UserAction.Read, EntityAbility.REQUESTER)

  const search = (e: FormEvent) => {
    e.preventDefault()
    router.push({ pathname: '/requester/list', query: q.trim() ? { value: q.trim() } : {} })
    setQ('')
    onNavigate?.()
  }

  const linkCls = (active: boolean) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm no-underline transition',
      collapsed && 'justify-center px-0',
      active ? 'bg-white font-semibold text-brand-700 shadow-card' : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
    )

  const renderLink = (i: HdNavItem, nested = false) => (
    <li key={i.key}>
      <Link href={i.path!} onClick={onNavigate} title={collapsed ? t(`nav.${i.key}`) : undefined} className={cn(linkCls(isActive(i.path)), nested && !collapsed && 'pl-9')}>
        <Icon icon={i.icon} fontSize={nested ? 17 : 19} className='shrink-0' />
        {!collapsed && <span className='truncate'>{t(`nav.${i.key}`)}</span>}
      </Link>
    </li>
  )

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-0 border-r border-solid border-gray-200 bg-[#F7F7F5] font-sans transition-[width] duration-200',
        collapsed ? 'w-[68px]' : 'w-[272px]'
      )}
    >
      {/* Marque + repli */}
      <div className={cn('flex shrink-0 items-center gap-2 px-3', collapsed ? 'h-auto flex-col justify-center pt-3' : 'h-16')}>
        {collapsed ? (
          <Link href='/home' onClick={onNavigate} title='BOBRAIN Helpdesk' className='flex'>
            <img src='/images/bobrain-mark.png' alt='BOBRAIN' className='h-9 w-9 object-contain' />
          </Link>
        ) : (
          <Link href='/home' onClick={onNavigate} className='flex min-w-0 flex-1 items-center gap-2 no-underline'>
            <img src='/images/bobrain-logo.png' alt='BOBRAIN' className='h-10 w-auto max-w-[150px] object-contain' />
            <span className='rounded-md bg-harvest-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-harvest-700'>Helpdesk</span>
          </Link>
        )}
        <button
          type='button'
          onClick={onToggle}
          title={mobile ? t('common.close') : collapsed ? t('nav.expand') : t('nav.collapse')}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-gray-500 hover:bg-gray-200/70 hover:text-gray-900'
        >
          <Icon icon={mobile ? 'mdi:close' : collapsed ? 'mdi:dock-left' : 'mdi:dock-left'} fontSize={20} />
        </button>
      </div>

      {/* Nouvelle demande */}
      {canCreate && (
        <div className='px-3 pb-2'>
          <Link
            href='/requester/add'
            onClick={onNavigate}
            title={collapsed ? t('nav.newRequest') : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border border-solid border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 no-underline shadow-card transition hover:border-brand-300 hover:text-brand-700',
              collapsed && 'justify-center px-0'
            )}
          >
            <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-harvest-500 text-white'>
              <Icon icon='mdi:plus' fontSize={16} />
            </span>
            {!collapsed && t('nav.newRequest')}
          </Link>
        </div>
      )}

      {/* Recherche */}
      {!collapsed && canReadRequests && (
        <form onSubmit={search} className='px-3 pb-2'>
          <label className='relative block'>
            <Icon icon='mdi:magnify' fontSize={17} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className='w-full rounded-lg border border-solid border-transparent bg-gray-200/50 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-300 focus:bg-white'
            />
          </label>
        </form>
      )}

      {/* Navigation + récents */}
      <nav className='min-h-0 flex-1 overflow-y-auto px-3 pb-3'>
        <ul className='m-0 list-none space-y-0.5 p-0'>
          {HD_NAV.filter(visible).map(i =>
            i.children ? (
              <li key={i.key}>
                {!collapsed ? (
                  <button
                    type='button'
                    onClick={() => setAdminOpen(o => !o)}
                    className='mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border-0 bg-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600'
                  >
                    {t(`nav.${i.key}`)}
                    <Icon icon={adminOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'} fontSize={16} />
                  </button>
                ) : (
                  <div className='mx-auto my-2 h-px w-8 bg-gray-200' />
                )}
                {(adminOpen || collapsed) && <ul className='m-0 list-none space-y-0.5 p-0'>{i.children.filter(can).map(c => renderLink(c, false))}</ul>}
              </li>
            ) : (
              renderLink(i)
            )
          )}
        </ul>

        {!collapsed && canReadRequests && <RecentRequests onNavigate={onNavigate} />}
      </nav>

      {/* Utilisateur */}
      <div className='shrink-0 border-0 border-t border-solid border-gray-200 p-2'>
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  )
}

export default Sidebar
