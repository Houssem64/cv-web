import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import About from '@/models/About';

// GET /api/about - Get about me data
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Try to find an existing About document
    let aboutData = await About.findOne();
    
    // If no document exists, create a default one
    if (!aboutData) {
      aboutData = await About.create({});
    }
    
    return NextResponse.json(aboutData, { status: 200 });
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}

// PUT /api/about - Update about me data (protected, admin only)
export async function PUT(req: NextRequest) {
  try {
    // Check for authentication
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const body = await req.json();
    
    // Try to find an existing About document
    let aboutData = await About.findOne();
    
    // If no document exists, create a new one with the provided data
    if (!aboutData) {
      aboutData = await About.create(body);
    } else {
      // Update the existing document
      aboutData = await About.findByIdAndUpdate(
        aboutData._id,
        body,
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json(aboutData, { status: 200 });
  } catch (error) {
    console.error('Error updating about data:', error);
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    );
  }
}

// DELETE /api/about - Delete and reset about me data (protected, admin only)
export async function DELETE(req: NextRequest) {
  try {
    // Check for authentication
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Delete all existing About documents
    await About.deleteMany({});
    
    // Create a new document with default values
    const newAboutData = await About.create({});
    
    return NextResponse.json(newAboutData, { status: 200 });
  } catch (error) {
    console.error('Error resetting about data:', error);
    return NextResponse.json(
      { error: 'Failed to reset about data' },
      { status: 500 }
    );
  }
} 