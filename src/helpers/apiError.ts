/** Extrait un message lisible d'une réponse d'erreur de l'API (formats variés). */
export const extractApiError = (res: any, fallback = 'Erreur'): string => {
  const out: string[] = []
  const walk = (v: any) => {
    if (!v) return
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(res?.errors)
  if (!out.length) walk(res?.message)
  if (!out.length && res?.error?.message) out.push(res.error.message)
  return Array.from(new Set(out)).join(' • ') || fallback
}

/** Une réponse est en erreur si elle porte errors / hasError / statusCode >= 400 */
export const isApiError = (res: any) =>
  !res || !!res.errors || !!res.hasError || (typeof res.statusCode === 'number' && res.statusCode >= 400)
