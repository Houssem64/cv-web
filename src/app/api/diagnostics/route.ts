import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

// GET /api/diagnostics - Get system diagnostics information
export async function GET(req: NextRequest) {
  const diagnosticInfo = {
    environment: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL || 'not set',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
    headers: Object.fromEntries(req.headers),
    mongodb: 'not tested',
    serverTime: new Date().toISOString(),
  };

  // Test MongoDB connection
  try {
    await dbConnect();
    diagnosticInfo.mongodb = 'connected successfully';
  } catch (error) {
    console.error('MongoDB connection error in diagnostics:', error);
    diagnosticInfo.mongodb = `connection error: ${error instanceof Error ? error.message : String(error)}`;
  }

  const response = NextResponse.json(diagnosticInfo, { status: 200 });

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}