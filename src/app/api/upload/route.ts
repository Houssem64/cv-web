import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { generateUniqueFileName, uploadFileToR2 } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    // Check for authentication
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate a unique file name
    const uniqueFileName = generateUniqueFileName(file.name);
    
    // Upload the file to Cloudflare R2
    const fileUrl = await uploadFileToR2(buffer, uniqueFileName, file.type);

    const response =  NextResponse.json({ url: fileUrl }, { status: 200 });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 