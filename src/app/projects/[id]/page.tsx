import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProjectById } from '@/lib/api';
import ImageGallery from '@/components/ImageGallery';

// Default placeholder image
const placeholderImage = '/images/placeholder.jpg';

// Simple Props type for Next.js 15.3.1 compatibility
type Props = {
  params: { id: string }
}

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: Props) {
  // Fix for Next.js 15.3.1 requirement to await params
  const resolvedParams = await Promise.resolve(params);
  const project = await getProjectById(resolvedParams.id);
  
  if (!project) {
    notFound();
  }

  // Ensure we have a valid image URL or use placeholder
  const featuredImage = project.featuredImage || (project as any).image || placeholderImage;
  
  // Filter out empty image URLs and ensure valid ones for the gallery
  const validImages = (project.images || [])
    .filter(img => img && img.trim() !== '')
    .map(img => img || placeholderImage);
  
  // Include the featured image in the gallery if it's not already included
  const allGalleryImages = [featuredImage, ...validImages.filter(img => img !== featuredImage)];

  return (
    <main className="min-h-screen dark:bg-black">
      <Navbar />
      
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">{project.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{project.description}</p>
          </div>
          
          {/* Featured Image */}
          <div className="max-w-4xl mx-auto mb-8 relative h-[50vh] min-h-[400px] rounded-lg overflow-hidden shadow-lg dark:shadow-gray-800/40">
            <Image
              src={featuredImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Image Gallery with Swipe */}
          {allGalleryImages.length > 0 && (
            <div className="max-w-4xl mx-auto mb-12">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Project Gallery</h2>
              <Suspense fallback={<div className="dark:text-gray-300">Loading gallery...</div>}>
                <ImageGallery images={allGalleryImages} title={project.title} />
              </Suspense>
            </div>
          )}
          
          {/* Project Details */}
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert prose-headings:dark:text-white prose-p:dark:text-gray-300 prose-a:dark:text-gray-300 prose-strong:dark:text-white prose-code:dark:text-gray-300 prose-li:dark:text-gray-300">
            <div dangerouslySetInnerHTML={{ __html: project.fullDescription.replace(/\n/g, '<br />') }} />
            
            <div className="my-8 flex flex-wrap gap-4">
              {project.link && (
                <Link 
                  href={project.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Live Project
                </Link>
              )}
              
              {project.githubLink && (
                <Link 
                  href={project.githubLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-gray-800 text-white hover:bg-gray-700"
                >
                  View on GitHub
                </Link>
              )}
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <Link href="/projects" className="btn btn-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </article>
      
      <Footer />
    </main>
  );
} 