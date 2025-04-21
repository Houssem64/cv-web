export interface About {
  _id: string;
  title: string;
  subtitle: string;
  profileImage: string;
  bio: string[];
  skills: {
    title: string;
    items: string[];
  }[];
  experiences: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    description: string;
  }[];
  contactInfo?: {
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
  };
  certifications?: {
    title: string;
    issuer: string;
    year: string;
    credential?: string;
    url?: string;
  }[];
  createdAt: string;
  updatedAt: string;
} 