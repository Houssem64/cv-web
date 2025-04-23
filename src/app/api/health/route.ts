import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';

export async function GET() {
  let dbStatus = 'unknown';
  let error = null;
  
  try {
    // Try to connect to the database
    await dbConnect();
    
    // Check if we're connected
    const connected = mongoose.connection.readyState === 1;
    dbStatus = connected ? 'connected' : 'disconnected';
    
  } catch (err: any) {
    console.error('Health check error:', err);
    error = err.message;
    dbStatus = 'error';
  }
  
  const response = NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      error: error
    }
  });
  
  // Add CORS headers to ensure frontend can access the API
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');
  
  return response;
} 