import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

// GET /api/projects/[id] - Get a single project
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Fix for Next.js 15.3.1 requirement to await params
    const resolvedParams = await Promise.resolve(params);
    const projectId = resolvedParams.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const response =  NextResponse.json(project, { status: 200 });
    return response;
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project (protected, admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fix for Next.js 15.3.1 requirement to await params
    const resolvedParams = await Promise.resolve(params);
    const projectId = resolvedParams.id;
    const body = await req.json();

    // Check if project exists
    const existingProject = await Project.findById(projectId);
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Remove any 'image' property if it exists
    if ('image' in body) {
      delete body.image;
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      body,
      { new: true, runValidators: true }
    );

    const response =  NextResponse.json(updatedProject, { status: 200 });
    return response;
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project (protected, admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fix for Next.js 15.3.1 requirement to await params
    const resolvedParams = await Promise.resolve(params);
    const projectId = resolvedParams.id;
    
    // Check if project exists
    const existingProject = await Project.findById(projectId);
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete project
    await Project.findByIdAndDelete(projectId);

    const response = NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 