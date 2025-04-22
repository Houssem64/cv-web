import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';


// This is a one-time migration route to convert old 'image' fields to 'featuredImage'
export async function GET(req: NextRequest) {
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

    // Check if connection is established
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }

    // Connect directly to the projects collection
    const db = mongoose.connection.db;
    const projectsCollection = db.collection('projects');
    
    // Find all projects that have 'image' field but no 'featuredImage'
    const projects = await projectsCollection.find({
      image: { $exists: true },
      featuredImage: { $exists: false }
    }).toArray();
    
    // Update each project to move 'image' to 'featuredImage'
    const updateResults = [];
    
    for (const project of projects) {
      const result = await projectsCollection.updateOne(
        { _id: project._id },
        { 
          $set: { featuredImage: project.image },
          $unset: { image: "" }
        }
      );
      updateResults.push({
        id: project._id,
        title: project.title,
        updated: result.modifiedCount > 0
      });
    }

      const response = NextResponse.json({
      message: 'Migration completed successfully',
      projectsUpdated: updateResults.length,
      details: updateResults
    }, { status: 200 }); // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response
  } catch (error) {
    console.error('Error migrating projects:', error);
    return NextResponse.json(
      { error: 'Failed to migrate projects' },
      { status: 500 }
    );
  }
} 