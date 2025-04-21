import { Project } from '../types/project';

// Fetch all projects
export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects', { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Fetch featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects?featured=true', { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured projects');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Fetch a single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${id}`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
} 