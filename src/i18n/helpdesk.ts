/* i18n FR / EN du module « Demandes d'intervention » */
import { useCallback, useEffect } from 'react'
import i18next from 'i18next'
import type { i18n as I18n } from 'i18next'
import { useTranslation } from 'react-i18next'
import fr from './helpdesk.fr'
import en from './helpdesk.en'

export const HD_NS = 'helpdesk'
export const LANG_STORAGE_KEY = 'hd.lang'
export type HdLang = 'fr' | 'en'

export const registerHelpdeskI18n = (i18n: I18n) => {
  if (!i18n.hasResourceBundle('fr', HD_NS)) i18n.addResourceBundle('fr', HD_NS, fr, true, true)
  if (!i18n.hasResourceBundle('en', HD_NS)) i18n.addResourceBundle('en', HD_NS, en, true, true)
}

/** Restaure la langue mémorisée (côté client uniquement).
 *  Utilise l'instance globale : ce hook est appelé dans _app, hors <I18nextProvider>. */
export const useRestoreLanguage = () => {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY)
      if ((saved === 'fr' || saved === 'en') && saved !== i18next.language) i18next.changeLanguage(saved)
    } catch {
      /* stockage indisponible : on garde le français */
    }
  }, [])
}

/** Hook du module : t(), langue courante, changement de langue, locale de formatage. */
export const useHd = () => {
  const { t: rawT, i18n } = useTranslation(HD_NS)
  // t() typé « string » (i18next renvoie DefaultTFuncReturn)
  const t = useCallback((key: string, options?: Record<string, unknown> | string): string => String(rawT(key, options as any) ?? key), [rawT])
  const lang: HdLang = i18n.language?.startsWith('en') ? 'en' : 'fr'

  const setLang = useCallback(
    (l: HdLang) => {
      i18n.changeLanguage(l)
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, l)
      } catch {
        /* ignore */
      }
    },
    [i18n]
  )

  const formatDate = useCallback(
    (value?: string | Date | null, withTime = true) => {
      if (!value) return '—'
      const d = new Date(value)
      if (isNaN(d.getTime())) return '—'
      return d.toLocaleString(lang === 'en' ? 'en-GB' : 'fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(withTime && { hour: '2-digit', minute: '2-digit' })
      })
    },
    [lang]
  )

  return { t, lang, setLang, formatDate }
}
