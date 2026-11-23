import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useHd } from 'src/i18n/helpdesk'
import Sidebar from './Sidebar'
import { HD_NAV, HdNavItem } from 'src/navigation/hd'

/** Libellé de la rubrique courante (bilingue), déduit de la navigation */
const findSection = (pathname: string): HdNavItem | undefined => {
  const flat = HD_NAV.flatMap(i => (i.children ? i.children : [i]))
  return flat.find(i => i.path && pathname.startsWith(i.path.replace(/\/list$/, '')))
}

const COLLAPSE_KEY = 'hd.sidebar.collapsed'

/**
 * Layout principal (style « chatbot ») :
 *  - sidebar à gauche, repliable (rail d'icônes), état mémorisé
 *  - tiroir plein écran sur mobile
 *  - zone de contenu épurée avec une barre supérieure minimale
 */
const HdLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const { settings } = useSettings()
  const { t } = useHd()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === '1')
    } catch {
      /* ignore */
    }
  }, [])

  // ferme le tiroir mobile à chaque navigation
  useEffect(() => {
    const close = () => setMobileOpen(false)
    router.events.on('routeChangeComplete', close)
    return () => router.events.off('routeChangeComplete', close)
  }, [router.events])

  const toggle = () =>
    setCollapsed(c => {
      try {
        window.localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1')
      } catch {
        /* ignore */
      }
      return !c
    })

  return (
    <div className='flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900'>
      {/* Desktop */}
      <div className='hidden h-full shrink-0 lg:block'>
        <Sidebar collapsed={collapsed} onToggle={toggle} />
      </div>

      {/* Mobile : tiroir */}
      {mobileOpen && (
        <div className='fixed inset-0 z-[1200] lg:hidden'>
          <div className='absolute inset-0 bg-gray-900/40' onClick={() => setMobileOpen(false)} />
          <div className='relative h-full w-[272px] animate-fade-in shadow-pop'>
            <Sidebar collapsed={false} mobile onToggle={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex h-14 shrink-0 items-center gap-3 border-0 border-b border-solid border-gray-100 bg-white/90 px-4 backdrop-blur lg:px-6'>
          <button
            type='button'
            onClick={() => setMobileOpen(true)}
            aria-label={t('nav.openMenu')}
            className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-gray-600 hover:bg-gray-100 lg:hidden'
          >
            <Icon icon='mdi:menu' fontSize={22} />
          </button>
          {(() => {
            const section = findSection(router.pathname)
            const isAdmin = section && HD_NAV.find(n => n.children?.includes(section))
            return (
              <p className='m-0 flex min-w-0 flex-1 items-center gap-1.5 truncate text-sm text-gray-500'>
                {isAdmin && (
                  <>
                    <span>{t('nav.admin')}</span>
                    <Icon icon='mdi:chevron-right' fontSize={16} className='text-gray-300' />
                  </>
                )}
                <span className='truncate font-semibold text-gray-800'>
                  {section ? t(`nav.${section.key}`) : settings?.titlePage ?? ''}
                </span>
              </p>
            )
          })()}
        </header>

        <main id='hd-main' className='min-h-0 flex-1 overflow-y-auto bg-[#FBFBFA]'>
          <div className='mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default HdLayout
