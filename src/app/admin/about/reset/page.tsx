'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { resetAboutData, updateAboutData } from '@/lib/api';
import { About } from '@/types/about';

// Custom data for Houssem Mehouachi
const customData: Partial<About> = {
  title: "About Me - Houssem Mehouachi",
  subtitle: "Backend Developer specialized in Java & Spring Boot",
  profileImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  bio: [
    "I'm a passionate backend developer from Tunisia specializing in Java and Spring Boot development. With a strong foundation in server-side technologies, I've worked on designing and implementing robust, scalable RESTful APIs and microservices architecture.",
    "My journey began with a fascination for building secure, efficient backend systems that power modern applications. This led me to pursue specialized education in backend development and Java frameworks.",
    "Today, I focus on developing enterprise-grade applications using Spring Boot, JPA/Hibernate, and relational databases. I'm particularly interested in creating well-architected systems with clean code principles, proper testing coverage, and scalable infrastructure.",
    "When I'm not coding, you can find me exploring new technologies, contributing to open-source Java projects, or enhancing my knowledge of cloud deployment with technologies like Docker and Kubernetes."
  ],
  skills: [
    {
      title: "Backend Development",
      items: [
        "Java, Spring Boot, Spring MVC",
        "JPA/Hibernate, JDBC",
        "MySQL, PostgreSQL",
        "RESTful APIs, Microservices",
        "Maven, Gradle"
      ]
    },
    {
      title: "DevOps & Tools",
      items: [
        "Git, GitHub, CI/CD",
        "Docker, Kubernetes basics",
        "JUnit, Mockito, Testing",
        "IntelliJ IDEA, Eclipse",
        "Linux, Bash scripting"
      ]
    },
    {
      title: "Additional Skills",
      items: [
        "Node.js, Express",
        "JavaScript, TypeScript",
        "React.js basics",
        "Problem Solving",
        "System Architecture Design"
      ]
    }
  ],
  experiences: [
    {
      title: "Backend Developer Intern",
      company: "DOTCOM",
      period: "Sep 2023",
      description: "Designed and implemented RESTful APIs using Spring Boot and Java. Created efficient database schemas with MySQL and integrated JPA/Hibernate for ORM. Developed unit tests with JUnit and Mockito to ensure code quality and stability."
    },
    {
      title: "IT Systems Analyst Intern",
      company: "TIBH",
      period: "Oct 2021 - Mar 2022",
      description: "Diagnosed complex IT issues, developed automated scripts for system maintenance, and implemented data recovery solutions. Gained valuable experience in system architecture and troubleshooting that enhances my backend development approach."
    },
    {
      title: "IT Support Intern",
      company: "Autoliv (ASW3)",
      period: "Dec 2020 - Jan 2021",
      description: "Monitored computer systems and network infrastructure, diagnosed system failures, and implemented technical solutions. Developed skills in problem-solving and system optimization that translate well to backend development."
    }
  ],
  education: [
    {
      degree: "BTS Web Development - Backend Focus",
      institution: "IMSET, Nabeul",
      period: "Oct 2022 - Jun 2024",
      description: "Specialized in Java backend development, Spring Boot framework, and database management. Completed capstone projects building scalable RESTful APIs and microservices."
    },
    {
      degree: "BTP Computer Microsystem Maintenance",
      institution: "Centre Sectoriel de Formation en Maintenance de Nabeul",
      period: "Sep 2020 - Jun 2022",
      description: "Studied system architecture, troubleshooting methodologies, and IT infrastructure management. Gained technical foundation that supports my backend development career."
    }
  ],
  contactInfo: {
    location: "Tunisia",
    phone: "+21629712343",
    email: "houssem.dev@outlook.com",
    linkedin: "https://linkedin.com/in/yourusername",
    github: "https://github.com/yourusername"
  },
  certifications: [
    {
      title: "Google IT Support",
      issuer: "Coursera",
      year: "2023",
      credential: "MC62C9DPUSRD",
      url: ""
    },
    {
      title: "EF SET English Certificate 76/100 (C2 Proficient)",
      issuer: "EF Standard English Test (EF SET)",
      year: "2020",
      credential: "",
      url: "cert.efset.org/VNNQK8"
    },
    {
      title: "Full-Stack Development Track",
      issuer: "Udacity",
      year: "2020",
      credential: "",
      url: ""
    }
  ]
};

export default function ResetAboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset and update the About data? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // First, reset the data
      await resetAboutData();
      
      // Then, update with custom data
      const result = await updateAboutData(customData);
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/about');
        }, 2000);
      } else {
        throw new Error('Failed to update about data with custom values');
      }
    } catch (error) {
      console.error('Error in reset and update process:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Reset & Update About Data</h1>
        <Link
          href="/admin/dashboard"
          className="text-primary hover:text-primary/80"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <p className="mb-4">
            This action will delete the current About data and replace it with custom prepared data about Houssem Mehouachi.
          </p>
          <p className="text-red-600 font-semibold mb-4">
            Warning: This action cannot be undone. The current About data will be permanently deleted.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            About data has been successfully reset and updated! Redirecting to About page...
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {loading ? 'Processing...' : 'Reset & Update With Custom Data'}
          </button>
          
          <Link
            href="/admin/about"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
} 