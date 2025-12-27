// src/utils/backendUrl.ts
export function getBackendUrl(path = '', isServerSide = false): string {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI;
  if (!uri) throw new Error('NEXT_PUBLIC_BACKEND_URI missing');

  if (isServerSide) {
    // Node.js côté serveur (NextAuth authorize)
    const host = process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://127.0.0.1';
    const port = process.env.NEXT_PUBLIC_BACKEND_PORT || '3336';
    const base = `${host}:${port}/${uri}`;

return path ? `${base}/${path}` : base;
  } else {
    // Frontend → URL relative pour Nginx
    return path ? `/${uri}/${path}` : `/${uri}`;
  }
}

export function getBackendPublicUri(): string {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI

  if (!uri) {
    throw new Error('NEXT_PUBLIC_BACKEND_URI is not defined')
  }

  // normalisation
  return uri.startsWith('/') ? uri : `/${uri}`
}
