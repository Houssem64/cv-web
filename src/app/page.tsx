import Image from "next/image";
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { getFeaturedProjects, getAllSkills } from '../lib/api';

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();
  const skills = await getAllSkills();
  
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 lg:pt-24 pb-16 bg-gradient-to-br from-[#3490dc]/10 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Backend Developer
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl">
              I specialize in building robust and scalable backend systems with Java and Spring Boot. 
              Creating efficient APIs, microservices, and database solutions that power modern applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/projects" className="btn btn-primary">
                View My Work
              </Link>
              <Link href="/contact" className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <p className="text-gray-600 mt-2">Some of my recent work</p>
          </div>
          {featuredProjects.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No projects found. Add some projects from the admin panel.</p>
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
                  image={project.image}
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Skills</h2>
            <p className="text-gray-600 mt-2">Technologies I work with</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skills && skills.length > 0 ? 
              skills.map(skill => (
                <div key={skill._id} className="card text-center py-6">
                  <p className="font-medium">{skill.name}</p>
                  {skill.category !== 'Uncategorized' && (
                    <span className="text-sm text-gray-500 mt-1 block">{skill.category}</span>
                  )}
                </div>
              ))
            : 
              <div className="col-span-full text-center py-6">
                <p>Skills data is currently unavailable.</p>
              </div>
            }
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-[#3490dc] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Backend Solution?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let's discuss your requirements for scalable APIs, microservices, or database architecture to power your applications.
          </p>
          <Link href="/contact" className="btn bg-white text-[#3490dc] hover:bg-gray-100">
            Get in Touch
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
