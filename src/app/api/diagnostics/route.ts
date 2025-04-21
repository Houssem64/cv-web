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

  return NextResponse.json(diagnosticInfo, { status: 200 });
} 