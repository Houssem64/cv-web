import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { getAllProjects } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';

export const metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse through my portfolio of projects',
};

// Default placeholder image
const placeholderImage = '/images/placeholder.jpg';

const getProjectImageSrc = (project: Project) => {
  // Handle both new featuredImage and legacy image fields
  const imageUrl = project.featuredImage || (project as any).image || '';
  return imageUrl && imageUrl.trim() !== '' ? imageUrl : placeholderImage;
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

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

          {projects.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No projects found.</p>
              <p className="text-gray-500 mb-6">Projects will appear here once they're added from the admin panel.</p>
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
                  image={getProjectImageSrc(project)}
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