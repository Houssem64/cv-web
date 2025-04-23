import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins - temporarily allow all origins
const allowedOrigins = [
  'https://houssem-mehouachi.netlify.app',
  'http://localhost:3000',
  // Temporarily allowing all origins
  '*'
];

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    // Allow any origin temporarily
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  // Handle actual requests
  const response = NextResponse.next();

  // Allow any origin temporarily
  response.headers.set('Access-Control-Allow-Origin', '*');

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

// Configure which routes the middleware will run on
export const config = {
  matcher: [
    // Match all API routes including auth
    '/api/:path*',
  ],
}; 