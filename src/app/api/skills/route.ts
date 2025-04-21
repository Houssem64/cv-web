import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skills';

// GET /api/skills - Get all skills
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get skills, sorted by category and then by name
    const skills = await Skill.find({}).sort({ category: 1, name: 1 });
    
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST /api/skills - Create a new skill (protected, admin only)
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
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }
    
    // Create the new skill
    const skill = await Skill.create(body);
    
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
} 