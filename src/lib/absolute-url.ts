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

  // For client-side requests in production, just use relative URLs
  if (typeof window !== 'undefined') {
    return normalizePath;
  }

  // In local development, use the NEXTAUTH_URL or localhost
  if (process.env.NEXTAUTH_URL) {
    return `${process.env.NEXTAUTH_URL}${normalizePath}`;
  }

  // Final fallback for server-side in non-Vercel environments
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000${normalizePath}`;
  }

  // For other deployment platforms, just use the path
  return normalizePath;
} 