// Déconnexion automatique quand la session a expiré (API 401, inactivité, fin de validité du jeton)
import { signOut } from 'next-auth/react'

export type ExpiryReason = 'expired' | 'idle'

/** Clés partagées entre onglets (localStorage) */
export const LS_LAST_ACTIVITY = 'hd:lastActivity'
export const LS_LOGOUT = 'hd:logout'

/** Inactivité max. côté navigateur (doit correspondre à APP_JWT_INACTIVE_SESSION_TTL de l'API) */
export const IDLE_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MS) || 15 * 60 * 1000

/** Délai d'avertissement avant la déconnexion pour inactivité */
export const IDLE_WARNING_MS = Math.min(60 * 1000, Math.floor(IDLE_TIMEOUT_MS / 3))

let expiring = false

const safeSet = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* stockage indisponible */
  }
}

export const safeGet = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Ferme la session NextAuth puis renvoie vers /login?expired=…&returnUrl=…
 * Idempotent : plusieurs appels simultanés (requêtes 401 en parallèle) ne déclenchent qu'une déconnexion.
 */
export const expireSession = async (reason: ExpiryReason = 'expired', broadcast = true) => {
  if (typeof window === 'undefined' || expiring) return
  expiring = true

  const { pathname, search } = window.location
  const onLogin = pathname.startsWith('/login')
  if (broadcast) safeSet(LS_LOGOUT, `${Date.now()}:${reason}`)

  try {
    await signOut({ redirect: false })
  } catch {
    /* on redirige quand même */
  }

  const query = new URLSearchParams({ expired: reason })
  const current = pathname + search
  if (!onLogin && current !== '/') query.set('returnUrl', current)
  window.location.replace(`/login?${query.toString()}`)
}

/** Lit l'expiration (ms) d'un JWT ; l'API met « exp » en millisecondes, le standard en secondes */
export const getTokenExpiry = (token?: string | null): number | null => {
  if (!token || typeof token !== 'string') return null
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')))
    const exp = Number(json?.exp)
    if (!exp) return null
    return exp > 1e12 ? exp : exp * 1000
  } catch {
    return null
  }
}

/** URL de retour sûre après reconnexion (chemin interne uniquement) */
export const safeReturnUrl = (value: unknown): string | null => {
  const v = Array.isArray(value) ? value[0] : value
  if (typeof v !== 'string' || !v.startsWith('/') || v.startsWith('//') || v.startsWith('/login')) return null
  return v
}
