// Surveille la session : 401 de l'API, inactivité, fin de validité du jeton, déconnexion depuis un autre onglet
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

import { useHd } from 'src/i18n/helpdesk'
import { getBackendPublicUri } from 'src/utils/backendUrl'
import {
  expireSession,
  getTokenExpiry,
  IDLE_TIMEOUT_MS,
  IDLE_WARNING_MS,
  LS_LAST_ACTIVITY,
  LS_LOGOUT,
  safeGet
} from 'src/helpers/sessionExpiry'
import Button from './Button'
import { Modal } from './Modal'

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'wheel'] as const
const CHECK_EVERY_MS = 5 * 1000
const KEEPALIVE_EVERY_MS = Math.min(4 * 60 * 1000, Math.floor(IDLE_TIMEOUT_MS / 3))

/* -------------------------- Intercepteur fetch (401) -------------------------- */

let interceptorInstalled = false

const headerValue = (init: RequestInit | undefined, input: RequestInfo | URL, name: string): string | null => {
  const read = (h: any) => {
    if (!h) return null
    if (typeof Headers !== 'undefined' && h instanceof Headers) return h.get(name)
    if (Array.isArray(h)) return h.find(([k]) => k.toLowerCase() === name)?.[1] ?? null
    const key = Object.keys(h).find(k => k.toLowerCase() === name)
    return key ? h[key] : null
  }
  return read(init?.headers) ?? (typeof Request !== 'undefined' && input instanceof Request ? input.headers.get(name) : null)
}

const installFetchInterceptor = () => {
  if (interceptorInstalled || typeof window === 'undefined') return
  interceptorInstalled = true

  let backendPath = ''
  try {
    backendPath = getBackendPublicUri()
  } catch {
    backendPath = ''
  }

  const originalFetch = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init)
    try {
      if (response.status === 401 && backendPath) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
        const token = headerValue(init, input, 'x-user-claims')
        const hadToken = !!token && token !== 'undefined' && token !== 'null'
        // 401 de l'API sur une requête authentifiée (pas la connexion elle-même) => session expirée
        if (url.includes(backendPath) && !url.includes('/auth/login') && hadToken) {
          expireSession('expired')
        }
      }
    } catch {
      /* ne jamais casser la requête d'origine */
    }
    return response
  }
}

/* --------------------------------- Watcher ---------------------------------- */

const SessionWatcher = () => {
  const { t } = useHd()
  const { data, status } = useSession()
  const token: string | undefined = (data as any)?.user?.token
  const [warning, setWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const lastActivity = useRef<number>(Date.now())
  const lastKeepAlive = useRef<number>(Date.now())

  const markActivity = useCallback(() => {
    const now = Date.now()
    // limite les écritures (au plus toutes les 5 s)
    if (now - lastActivity.current < 5000) return
    lastActivity.current = now
    try {
      window.localStorage.setItem(LS_LAST_ACTIVITY, String(now))
    } catch {
      /* ignore */
    }
  }, [])

  /** Ping l'API pour prolonger la session côté serveur (lastAccess) */
  const keepAlive = useCallback(() => {
    if (!token) return
    lastKeepAlive.current = Date.now()
    fetch(`${getBackendPublicUri()}/auth/user`, {
      headers: { 'Content-type': 'application/json', 'x-user-claims': token }
    }).catch(() => undefined)
  }, [token])

  const stayConnected = useCallback(() => {
    lastActivity.current = 0
    markActivity()
    setWarning(false)
    keepAlive()
  }, [keepAlive, markActivity])

  // Intercepteur 401 (installé une seule fois)
  useEffect(() => {
    if (status === 'authenticated') installFetchInterceptor()
  }, [status])

  // Activité utilisateur + déconnexion propagée entre onglets
  useEffect(() => {
    if (status !== 'authenticated') return
    lastActivity.current = Date.now()
    lastKeepAlive.current = Date.now()
    try {
      window.localStorage.setItem(LS_LAST_ACTIVITY, String(lastActivity.current))
    } catch {
      /* ignore */
    }

    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, markActivity, { passive: true }))
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_LOGOUT && e.newValue) {
        const reason = e.newValue.split(':')[1] === 'idle' ? 'idle' : 'expired'
        expireSession(reason, false)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, markActivity))
      window.removeEventListener('storage', onStorage)
    }
  }, [status, markActivity])

  // Contrôle périodique : inactivité, fin de validité du jeton, maintien de la session
  useEffect(() => {
    if (status !== 'authenticated') return
    const tokenExpiry = getTokenExpiry(token)

    const tick = () => {
      const now = Date.now()

      // fin de validité absolue du jeton
      if (tokenExpiry && now >= tokenExpiry) return expireSession('expired')

      // dernière activité, tous onglets confondus
      const shared = Number(safeGet(LS_LAST_ACTIVITY)) || 0
      const last = Math.max(lastActivity.current, shared)
      const idle = now - last

      if (idle >= IDLE_TIMEOUT_MS) return expireSession('idle')

      if (idle >= IDLE_TIMEOUT_MS - IDLE_WARNING_MS) {
        setWarning(true)
        setSecondsLeft(Math.max(0, Math.ceil((IDLE_TIMEOUT_MS - idle) / 1000)))
      } else {
        setWarning(false)
        // utilisateur actif : on prolonge la session côté API
        if (now - lastKeepAlive.current >= KEEPALIVE_EVERY_MS && idle < KEEPALIVE_EVERY_MS) keepAlive()
      }
    }

    tick()
    const id = window.setInterval(tick, CHECK_EVERY_MS)
    return () => window.clearInterval(id)
  }, [status, token, keepAlive])

  // compte à rebours affiché chaque seconde pendant l'avertissement
  useEffect(() => {
    if (!warning) return
    const id = window.setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [warning])

  if (status !== 'authenticated') return null

  return (
    <Modal
      open={warning}
      size='sm'
      onClose={stayConnected}
      title={t('session.idleTitle')}
      footer={
        <>
          <Button variant='secondary' onClick={() => expireSession('idle')}>
            {t('session.logout')}
          </Button>
          <Button icon='mdi:account-clock-outline' onClick={stayConnected}>
            {t('session.stay')}
          </Button>
        </>
      }
    >
      <p className='m-0 text-sm text-gray-600'>{t('session.idleText', { seconds: secondsLeft })}</p>
    </Modal>
  )
}

export default SessionWatcher
