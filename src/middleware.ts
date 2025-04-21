import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware ensures that API URLs work correctly in all environments
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  
  // Add a custom header that our API routes can use to detect the host
  requestHeaders.set('x-url', request.url)
  requestHeaders.set('x-hostname', request.nextUrl.hostname)
  
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