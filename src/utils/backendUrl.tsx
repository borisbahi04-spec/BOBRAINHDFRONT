export function getBackendUrl(path = ''): string {
  const address = process.env.NEXT_PUBLIC_BACKEND_HOST
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI

  if (!address || !uri || !port) {
    throw new Error('Backend env variables missing')
  }

  const base = port
    ? `${address}:${port}/${uri}`
    : `${address}/${uri}`

  return path ? `${base}/${path}` : base
}


export function getBackendPublicUri(): string {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI

  if (!uri) {
    throw new Error('NEXT_PUBLIC_BACKEND_URI is not defined')
  }

  // normalisation
  return uri.startsWith('/') ? uri : `/${uri}`
}
