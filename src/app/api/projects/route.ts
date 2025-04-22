import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

// GET /api/projects - Get all projects
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const featured = req.nextUrl.searchParams.get('featured') === 'true';
    
    let query = {};
    if (featured) {
      query = { featured: true };
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    const response = NextResponse.json(projects, { status: 200 });
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
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
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 