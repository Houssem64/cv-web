import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { getAllProjects } from '@/lib/api';
import Image from 'next/image';
import { Project } from '@/types/project';

export const metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse through my portfolio of projects',
};

// Default placeholder image
const placeholderImage = '/images/placeholder.jpg';

const getImageSrc = (imageUrl: string | undefined): string => {
  return imageUrl && imageUrl.trim() !== '' ? imageUrl : placeholderImage;
};

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let projectsError: string | null = null;
  
  try {
    projects = await getAllProjects();
  } catch (error) {
    console.error('Error in projects page:', error);
    projectsError = 'Failed to load projects';
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collection of my work, including web applications, design projects, and more.
            </p>
          </div>

          {projectsError ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-red-600 mb-4">{projectsError}</p>
              <p className="text-gray-500 mb-6">There might be an issue with the database connection.</p>              
              <Link href="/" className="btn btn-primary">
                Return Home
              </Link>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No projects found.</p>
              <p className="text-gray-500 mb-6">Projects will appear here once they&apos;re added from the admin panel.</p>
              <Link href="/" className="btn btn-primary">
                Return Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  id={project._id}
                  title={project.title}
                  description={project.description}
                  image={getImageSrc(project.featuredImage)}
                  tags={project.tags}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
} 