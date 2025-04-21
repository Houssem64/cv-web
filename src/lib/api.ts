import { Project } from '../types/project';
import { About } from '../types/about';
import { Skill } from '../types/skill';
import { Contact } from '../types/contact';

// Helper function to get the base URL
function getBaseUrl() {
  // Check if we're running on the server
  if (typeof window === 'undefined') {
    // Server-side - use environment variable or default to localhost
    return process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }
  // Client-side - use the window location
  return window.location.origin;
}

// Fetch all projects
export async function getAllProjects(): Promise<Project[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/projects`, { 
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/projects?featured=true`, { 
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/projects/${id}`, { 
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

// Fetch about me data
export async function getAboutData(): Promise<About | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/about`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch about data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

// Update about me data
export async function updateAboutData(data: Partial<About>): Promise<About | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/about`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update about data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating about data:', error);
    return null;
  }
}

// Reset about me data (deletes existing and creates a new one with defaults)
export async function resetAboutData(): Promise<About | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/about`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset about data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error resetting about data:', error);
    return null;
  }
}

// Fetch all skills
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/skills`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

// Create a new skill
export async function createSkill(data: {name: string, category?: string}): Promise<Skill | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create skill');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating skill:', error);
    return null;
  }
}

// Update a skill
export async function updateSkill(id: string, data: {name: string, category?: string}): Promise<Skill | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/skills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update skill');
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating skill with ID ${id}:`, error);
    return null;
  }
}

// Delete a skill
export async function deleteSkill(id: string): Promise<boolean> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/skills/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete skill');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting skill with ID ${id}:`, error);
    return false;
  }
}

// Fetch contact information
export async function getContactInfo(): Promise<Contact | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/contact`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contact information');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching contact information:', error);
    return null;
  }
}

// Update contact information
export async function updateContactInfo(data: Partial<Contact>): Promise<Contact | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update contact information');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating contact information:', error);
    return null;
  }
} 