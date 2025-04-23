import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

// GET /api/projects - Get all projects
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/projects - Attempting to connect to database...');
    await dbConnect();
    console.log('GET /api/projects - Database connected successfully');
    
    const featured = req.nextUrl.searchParams.get('featured') === 'true';
    
    let query = {};
    if (featured) {
      query = { featured: true };
      console.log('GET /api/projects - Fetching featured projects only');
    } else {
      console.log('GET /api/projects - Fetching all projects');
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    console.log(`GET /api/projects - Retrieved ${projects.length} projects`);
    
    const response = NextResponse.json(projects, { status: 200 });
    // Add CORS headers to ensure frontend can access the API
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching projects:', error.name, error.message);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error info based on the error type
    let errorMessage = 'Failed to fetch projects';
    if (error.name === 'MongoNetworkError') {
      errorMessage = 'Database connection error. Please check network connectivity.';
    } else if (error.name === 'MongoServerSelectionError') {
      errorMessage = 'Database server selection timeout. Ensure MongoDB Atlas IP access is configured.';
    }
    
    const errorResponse = NextResponse.json(
      { 
        error: errorMessage,
        errorType: error.name,
        message: error.message 
      },
      { status: 500 }
    );
    
    // Add CORS headers to ensure frontend can access the error response
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return errorResponse;
  }
}

// POST /api/projects - Create a new project (protected, admin only)
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
    
    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'fullDescription', 'featuredImage', 'tags'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Delete any 'image' property if it exists to prevent validation errors
    if ('image' in body) {
      delete body.image;
    }
    
    // Create new project
    const project = await Project.create(body);
    
    const response = NextResponse.json(project, { status: 201 });
    return response;
  } catch (error: any) {
    console.error('Error creating project:', error.name, error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to create project', message: error.message },
      { status: 500 }
    );
  }
} 