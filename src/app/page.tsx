import Image from "next/image";
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';

// Sample project data
const featuredProjects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform built with Next.js and Stripe integration.',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    tags: ['Next.js', 'React', 'Stripe', 'Tailwind CSS'],
  },
  {
    id: '2',
    title: 'Social Media Dashboard',
    description: 'A comprehensive dashboard for managing social media accounts and analytics.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGFzaGJvYXJkfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    tags: ['React', 'ChartJS', 'Material UI', 'NodeJS'],
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'A Kanban-style task management application with real-time updates.',
    image: 'https://images.unsplash.com/photo-1540888747681-66ca5082b08d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFza3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['React', 'Firebase', 'TypeScript', 'Redux'],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 lg:pt-24 pb-16 bg-gradient-to-br from-primary/10 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Creative Developer & Designer
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                I build beautiful, functional websites and applications that help businesses grow and succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/projects" className="btn btn-primary text-center">
                  View My Work
                </Link>
                <Link href="/contact" className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-center">
                  Contact Me
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg shadow-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1604964432806-254d07c11f32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGV2ZWxvcGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                alt="Developer"
                fill
                priority
                className="object-cover"
              />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
              />
            ))}
          </div>
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
            <h2 className="text-3xl font-bold">Skills & Expertise</h2>
            <p className="text-gray-600 mt-2">Technologies I work with</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'TailwindCSS', 'MongoDB', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker', 'Git'].map((skill) => (
              <div key={skill} className="card text-center py-6">
                <p className="font-medium">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start a project?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and see how I can help bring your ideas to life.
          </p>
          <Link href="/contact" className="btn bg-white text-primary hover:bg-gray-100 inline-block">
            Get in Touch
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
