export function getBackendUrl(path = ''): string {
  // En prod, on utilise une URL relative pour que Next.js + Nginx gère le proxy
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI
  if (!uri) throw new Error('NEXT_PUBLIC_BACKEND_URI missing')

  return path ? `/${uri}/${path}` : `/${uri}`
}

export function getBackendPublicUri(): string {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI

  if (!uri) {
    throw new Error('NEXT_PUBLIC_BACKEND_URI is not defined')
  }

  // normalisation
  return uri.startsWith('/') ? uri : `/${uri}`
}
