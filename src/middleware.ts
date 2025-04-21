import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware ensures that API URLs work correctly in all environments
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  
  // Add custom headers that our API routes can use to detect the host
  requestHeaders.set('x-url', request.url)
  requestHeaders.set('x-hostname', request.nextUrl.hostname)
  
  // Add Vercel-specific information if available
  if (process.env.VERCEL_URL) {
    requestHeaders.set('x-vercel-url', process.env.VERCEL_URL)
  }
  
  // Log request information for debugging
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('API Request:', {
      url: request.url,
      path: request.nextUrl.pathname,
      hostname: request.nextUrl.hostname,
      vercelUrl: process.env.VERCEL_URL || 'not set',
      method: request.method,
    })
  }
  
  return NextResponse.next({
    request: {
      // Apply the new headers
      headers: requestHeaders,
    },
  })
}

// Only run middleware on API routes
export const config = {
  matcher: ['/api/:path*'],
} 