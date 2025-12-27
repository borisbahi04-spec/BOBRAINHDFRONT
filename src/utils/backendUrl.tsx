export function getBackendUrl(path = ''): string {
  const address = process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://127.0.0.1';
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT || '3336';
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI || 'flash-backend/api/v1';

  const base = `${address}:${port}/${uri}`;

  return path ? `${base}/${path}` : base;
}

export function getBackendPublicUri(): string {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI

  if (!uri) {
    throw new Error('NEXT_PUBLIC_BACKEND_URI is not defined')
  }

  // normalisation
  return uri.startsWith('/') ? uri : `/${uri}`
}
