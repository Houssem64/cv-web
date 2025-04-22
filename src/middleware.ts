import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins
const allowedOrigins = [
  'https://cv-web-kappa.vercel.app',
  'https://cv-bkata4693-houssem64s-projects.vercel.app',
  'http://localhost:3000'
];

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin');
  
  // Get the response
  const response = NextResponse.next();

  // Check if the origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // For requests without origin (like direct browser requests)
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  // Add the remaining CORS headers
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

// Configure which routes the middleware will run on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all static files
    '/_next/static/:path*',
    // Match all routes
    '/:path*',
  ],
}; 