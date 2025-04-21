export interface Project {
  _id: string;
  title: string;
  description: string;
  fullDescription: string;
  featuredImage: string;
  images: string[];
  tags: string[];
  link?: string;
  githubLink?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
} 