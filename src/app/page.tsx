import Image from "next/image";
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { getFeaturedProjects, getAllSkills } from '../lib/api';
import { Project } from '../types/project';
import { Skill } from '../types/skill';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let featuredProjects: Project[] = [];
  let skills: Skill[] = [];
  let projectsError: string | null = null;
  let skillsError: string | null = null;
  
  try {
    featuredProjects = await getFeaturedProjects();
  } catch (error) {
    console.error('Error in page component:', error);
    projectsError = 'Failed to load projects';
  }
  
  try {
    skills = await getAllSkills();
  } catch (error) {
    console.error('Error in page component:', error);
    skillsError = 'Failed to load skills';
  }
  
  return (
    <main className="min-h-screen dark:bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 lg:pt-24 pb-16 bg-gradient-to-br from-[#3490dc]/10 to-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 dark:text-white">
              Backend Developer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
              I specialize in building robust and scalable backend systems with Java and Spring Boot. 
              Creating efficient APIs, microservices, and database solutions that power modern applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/projects" className="btn btn-primary">
                View My Work
              </Link>
              <Link href="/contact" className="btn bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white">Featured Projects</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Some of my recent work</p>
          </div>
          
          {projectsError ? (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{projectsError}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">There might be an issue with the database connection.</p>
              <Link href="/admin/login" className="btn btn-primary mt-4">
                Try Admin Login
              </Link>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No projects found. Add some projects from the admin panel.</p>
              <Link href="/admin/login" className="btn btn-primary mt-4">
                Go to Admin
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  id={project._id}
                  title={project.title}
                  description={project.description}
                  image={project.featuredImage}
                  tags={project.tags}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/projects" className="btn btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white">Skills</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Technologies I work with</p>
          </div>
          
          {skillsError ? (
            <div className="text-center p-8 bg-white dark:bg-black rounded-lg shadow-sm dark:shadow-gray-900/20">
              <p className="text-red-600 dark:text-red-400">{skillsError}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">There might be an issue with the database connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills && skills.length > 0 ? 
                skills.map(skill => (
                  <div key={skill._id} className="bg-white dark:bg-black rounded-lg shadow-md dark:shadow-gray-800/40 p-6 transition-shadow hover:shadow-lg text-center py-6">
                    <p className="font-medium dark:text-white">{skill.name}</p>
                    {skill.category !== 'Uncategorized' && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">{skill.category}</span>
                    )}
                  </div>
                ))
              : 
                <div className="col-span-full text-center py-6 dark:text-gray-300">
                  <p>Skills data is currently unavailable.</p>
                </div>
              }
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-[#3490dc] dark:bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Backend Solution?</h2>
          <p className="text-xl opacity-90 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your requirements for scalable APIs, microservices, or database architecture to power your applications.
            Let&apos;s discuss your requirements for scalable APIs, microservices, or database architecture to power your applications.          </p>
          <Link href="/contact" className="btn bg-white dark:bg-gray-800 text-[#3490dc] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            Get in Touch
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
