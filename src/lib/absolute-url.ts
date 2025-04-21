/**
 * Helper to get absolute URLs for API routes in any environment
 * Works in both server components and client components
 */

export function getAbsoluteUrl(path: string = ''): string {
  const normalizePath = path.startsWith('/') ? path : `/${path}`;

  // In production on Vercel, use the Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${normalizePath}`;
  }

  // In local development, use the NEXTAUTH_URL or localhost
  if (process.env.NEXTAUTH_URL) {
    return `${process.env.NEXTAUTH_URL}${normalizePath}`;
  }

  // Fallback for client-side
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${normalizePath}`;
  }

  // Final fallback for server-side in non-Vercel environments
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000${normalizePath}`;
  }

  // For other deployment platforms, try to use the host header
  return normalizePath;
} 