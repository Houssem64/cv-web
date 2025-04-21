import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skills';

// GET /api/skills/[id] - Get a skill by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const skill = await Skill.findById(params.id);
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(skill, { status: 200 });
  } catch (error) {
    console.error(`Error fetching skill with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

// PUT /api/skills/[id] - Update a skill by ID (protected, admin only)
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
    
    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }
    
    const skill = await Skill.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(skill, { status: 200 });
  } catch (error) {
    console.error(`Error updating skill with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/[id] - Delete a skill by ID (protected, admin only)
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
    
    const skill = await Skill.findByIdAndDelete(params.id);
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Skill deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting skill with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
} 