import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/ProjectCard';

// Sample project data - in a real application, this would come from a database
const projects = [
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
  {
    id: '4',
    title: 'Fitness Tracking App',
    description: 'A mobile-first fitness tracking application with workout plans and progress analytics.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['React Native', 'Firebase', 'Redux', 'D3.js'],
  },
  {
    id: '5',
    title: 'Recipe Sharing Platform',
    description: 'A community-driven platform for sharing and discovering recipes from around the world.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVjaXBlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    tags: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
  },
  {
    id: '6',
    title: 'Real Estate Listing Website',
    description: 'A property listing website with advanced search, filtering, and interactive maps.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['React', 'Next.js', 'Leaflet', 'PostgreSQL'],
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Projects Header */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Here's a collection of my recent work. Each project represents a unique challenge and solution.
          </p>
        </section>
        
        {/* Projects Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
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
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 