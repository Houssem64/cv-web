import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// Sample project data - in a real application, this would come from a database
const projects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform built with Next.js and Stripe integration.',
    fullDescription: `
      This e-commerce platform was built to provide a seamless shopping experience for users while giving store owners powerful tools to manage their products, orders, and customers.
      
      The platform features a responsive design, product search and filtering, user authentication, shopping cart, checkout with Stripe payment integration, order history, and admin dashboard for product and order management.
      
      Technologies used include Next.js for server-side rendering and API routes, React for the UI components, Tailwind CSS for styling, MongoDB for the database, and Stripe for payment processing.
    `,
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    tags: ['Next.js', 'React', 'Stripe', 'Tailwind CSS'],
    link: 'https://example-ecommerce.com',
    githubLink: 'https://github.com/username/ecommerce-platform',
  },
  {
    id: '2',
    title: 'Social Media Dashboard',
    description: 'A comprehensive dashboard for managing social media accounts and analytics.',
    fullDescription: `
      This social media dashboard combines analytics from various platforms (Twitter, Facebook, Instagram, LinkedIn) into a single, intuitive interface for social media managers and marketers.
      
      The dashboard provides real-time metrics, audience insights, content performance analysis, and scheduling capabilities. Users can track engagement, growth, and conversion across all their social channels.
      
      Built with React for the frontend, Express and Node.js for the backend, with ChartJS for data visualization, and Material UI for the component library. The app integrates with various social media APIs and uses Redux for state management.
    `,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGFzaGJvYXJkfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    tags: ['React', 'ChartJS', 'Material UI', 'NodeJS'],
    link: 'https://social-dashboard-demo.com',
    githubLink: 'https://github.com/username/social-dashboard',
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'A Kanban-style task management application with real-time updates.',
    fullDescription: `
      This task management application helps teams organize their work using a Kanban board approach. Users can create projects, add tasks with descriptions and due dates, assign team members, and track progress.
      
      The app features drag-and-drop functionality, task filtering, labels and priorities, file attachments, and real-time updates when team members make changes.
      
      Built with React for the frontend with TypeScript for type safety, Firebase for real-time database and authentication, and Redux for state management. The responsive design works seamlessly across desktop and mobile devices.
    `,
    image: 'https://images.unsplash.com/photo-1540888747681-66ca5082b08d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFza3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['React', 'Firebase', 'TypeScript', 'Redux'],
    link: 'https://task-app-demo.com',
    githubLink: 'https://github.com/username/task-management',
  },
  {
    id: '4',
    title: 'Fitness Tracking App',
    description: 'A mobile-first fitness tracking application with workout plans and progress analytics.',
    fullDescription: `
      This fitness tracking application helps users track their workouts, set goals, and monitor their progress over time. The app includes a library of exercises with instructions, customizable workout plans, and progress visualization.
      
      Features include workout tracking with sets, reps, and weights, body measurements, personal records, nutrition tracking, and social sharing capabilities.
      
      Developed with React Native for cross-platform mobile compatibility, Firebase for backend and authentication, Redux for state management, and D3.js for data visualization and progress charts.
    `,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['React Native', 'Firebase', 'Redux', 'D3.js'],
    link: 'https://fitness-app-demo.com',
    githubLink: 'https://github.com/username/fitness-tracker',
  },
  {
    id: '5',
    title: 'Recipe Sharing Platform',
    description: 'A community-driven platform for sharing and discovering recipes from around the world.',
    fullDescription: `
      This recipe sharing platform enables food enthusiasts to discover, share, and save recipes from around the world. Users can browse recipes by category, cuisine, or dietary restrictions, save favorites, and share their own creations.
      
      Features include recipe uploads with step-by-step instructions and images, ingredient scaling, cooking time estimation, meal planning, and a social component with comments and ratings.
      
      Built with Vue.js for the frontend, Node.js and Express for the backend, MongoDB for the database, and includes responsive design for mobile and desktop users.
    `,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVjaXBlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    tags: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
    link: 'https://recipe-platform-demo.com',
    githubLink: 'https://github.com/username/recipe-platform',
  },
  {
    id: '6',
    title: 'Real Estate Listing Website',
    description: 'A property listing website with advanced search, filtering, and interactive maps.',
    fullDescription: `
      This real estate listing website helps buyers find properties and connects them with agents. The platform features property listings with detailed information, photos, and virtual tours.
      
      The site includes advanced search and filtering capabilities, interactive maps for location-based searching, mortgage calculators, saved searches with email alerts, and agent contact forms.
      
      Developed with React and Next.js for server-side rendering and SEO optimization, PostgreSQL for the database, and Leaflet for interactive maps. The responsive design provides an optimal experience across all devices.
    `,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['React', 'Next.js', 'Leaflet', 'PostgreSQL'],
    link: 'https://realestate-demo.com',
    githubLink: 'https://github.com/username/real-estate',
  },
];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="mb-8">
            <Link href="/projects" className="text-primary hover:underline mb-4 inline-block">
              &larr; Back to Projects
            </Link>
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Project Image */}
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl mb-8">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          
          {/* Project Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <div className="prose prose-lg max-w-none">
                {project.fullDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph.trim()}</p>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h3 className="text-xl font-bold mb-4">Project Links</h3>
              <div className="space-y-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full text-center"
                >
                  Live Demo
                </a>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-gray-800 text-white hover:bg-gray-700 w-full text-center"
                >
                  GitHub Repository
                </a>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Technologies</h3>
                <ul className="space-y-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 