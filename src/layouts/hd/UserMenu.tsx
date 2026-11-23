import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { RootState } from 'src/redux/store'
import { useHd } from 'src/i18n/helpdesk'
import { cn } from 'src/components/hd'

export const initials = (name?: string) =>
  String(name ?? '?')
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('') || '?'

/** Carte utilisateur en bas de la sidebar + menu (profil, langue, déconnexion) */
const UserMenu = ({ collapsed }: { collapsed: boolean }) => {
  const router = useRouter()
  const { t, lang, setLang } = useHd()
  const session = useSelector((state: RootState) => state.auth?.getuserprofile?.session)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const u = session?.userData ?? {}
  const fullName = [u.lastName, u.firstName].filter(Boolean).join(' ') || session?.username || '—'
  const role = session?.role?.displayName || session?.role?.name || ''
  const branch = session?.targetBranch?.displayName || session?.branch?.displayName || ''

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const logout = async () => {
    await signOut({ redirect: false, callbackUrl: '/login' })
    router.push('/login')
  }

  const item = 'flex w-full cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'

  return (
    <div ref={ref} className='relative'>
      {open && (
        <div className='absolute bottom-full left-0 z-50 mb-2 w-64 animate-fade-in rounded-xl border border-solid border-gray-200 bg-white p-1.5 shadow-pop'>
          <div className='border-0 border-b border-solid border-gray-100 px-3 pb-2.5 pt-1.5'>
            <p className='m-0 truncate text-sm font-bold text-gray-900'>{fullName}</p>
            <p className='m-0 truncate text-xs text-gray-500'>
              {[role, branch].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button type='button' className={cn(item, 'mt-1')} onClick={() => (setOpen(false), router.push('/user-profile/account'))}>
            <Icon icon='mdi:account-circle-outline' fontSize={18} /> {t('nav.profile')}
          </button>
          <div className='flex items-center justify-between px-3 py-2 text-sm text-gray-700'>
            <span className='flex items-center gap-3'>
              <Icon icon='mdi:translate' fontSize={18} /> {t('nav.language')}
            </span>
            <span className='inline-flex rounded-md bg-gray-100 p-0.5'>
              {(['fr', 'en'] as const).map(l => (
                <button
                  key={l}
                  type='button'
                  onClick={() => setLang(l)}
                  className={cn(
                    'cursor-pointer rounded border-0 px-2 py-0.5 text-[11px] font-bold uppercase',
                    lang === l ? 'bg-white text-brand-700 shadow-card' : 'bg-transparent text-gray-500'
                  )}
                >
                  {l}
                </button>
              ))}
            </span>
          </div>
          <div className='my-1 h-px bg-gray-100' />
          <button type='button' className={cn(item, 'text-red-600 hover:bg-red-50')} onClick={logout}>
            <Icon icon='mdi:logout-variant' fontSize={18} /> {t('nav.logout')}
          </button>
        </div>
      )}

      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        title={fullName}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent p-2 text-left transition hover:bg-gray-200/60',
          collapsed && 'justify-center'
        )}
      >
        <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white'>
          {initials(fullName)}
        </span>
        {!collapsed && (
          <>
            <span className='min-w-0 flex-1'>
              <span className='block truncate text-sm font-semibold text-gray-900'>{fullName}</span>
              <span className='block truncate text-xs text-gray-500'>{role || branch}</span>
            </span>
            <Icon icon='mdi:unfold-more-horizontal' fontSize={18} className='text-gray-400' />
          </>
        )}
      </button>
    </div>
  )
}

export default UserMenu
