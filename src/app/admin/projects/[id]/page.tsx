'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';

// Placeholder image to use when no image URL is available
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

// Helper function to get image src with fallback to placeholder
const getImageSrc = (src: string | null) => {
  return src && src.trim().length > 0 ? src : PLACEHOLDER_IMAGE;
};

interface Project {
  _id: string;
  title: string;
  description: string;
  fullDescription: string;
  featuredImage: string;
  images: string[];
  tags: string[];
  link?: string;
  githubLink?: string;
  featured: boolean;
}

// Use simple type instead of interface for Next.js 15.3.1 compatibility
type Props = {
  params: { id: string }
}

export default function EditProject({ params }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    featuredImage: '',
    images: [] as string[],
    tags: '',
    link: '',
    githubLink: '',
    featured: false,
  });
  
  // Store resolved params ID
  const [projectId, setProjectId] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setProjectId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (status !== 'authenticated' || !projectId) return;
      
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const project: Project = await response.json();
        
        // Handle potential legacy projects that use 'image' instead of 'featuredImage'
        const featuredImg = 'featuredImage' in project ? 
          project.featuredImage : 
          (project as any).image || '';
        
        setFormData({
          title: project.title,
          description: project.description,
          fullDescription: project.fullDescription,
          featuredImage: featuredImg,
          images: project.images || [],
          tags: project.tags.join(', '),
          link: project.link || '',
          githubLink: project.githubLink || '',
          featured: project.featured,
        });
        
        // Set preview image from existing project image
        if (featuredImg) {
          setFeaturedPreview(featuredImg);
        }
        
        // Set additional previews
        if (project.images && project.images.length > 0) {
          setAdditionalPreviews(project.images);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId) return;
    
    // Form validation
    if (!formData.title || !formData.description || !formData.fullDescription || !formData.featuredImage || !formData.tags) {
      setError('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    // Convert comma-separated tags to array
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update project');
      }
      
      // Redirect to projects list page on success
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setFeaturedPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image to R2
    await uploadImage(file, true);
  };

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array
    const filesArray = Array.from(files);
    
    // Preview the selected images
    const newPreviews: string[] = [];
    
    for (const file of filesArray) {
      // Create preview for each file
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newPreviews.push(result);
        if (newPreviews.length === filesArray.length) {
          setAdditionalPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
      
      // Upload each image
      await uploadImage(file, false);
    }
  };

  const uploadImage = async (file: File, isFeatured: boolean) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Update the form with the image URL
      if (isFeatured) {
        setFormData(prev => ({
          ...prev,
          featuredImage: data.url,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
      }
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      setIsUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newPreviews = [...additionalPreviews];
    newPreviews.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
    
    setAdditionalPreviews(newPreviews);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isNew = projectId === 'new';
  const pageTitle = isNew ? 'Add New Project' : 'Edit Project';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-md flex items-center font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Projects
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-800 text-white px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-black rounded-lg p-6 space-y-6 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Basic Info */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="A brief summary of your project (displayed in cards and lists)"
                  required
                />
              </div>

              <div>
                <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="Detailed description of your project (Markdown supported)"
                  required
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                  Tags <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="React, TypeScript, Tailwind (comma separated)"
                  required
                />
              </div>
            </div>

            {/* Right column - Images & Links */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Featured Image <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col space-y-2">
                  {featuredPreview ? (
                    <div className="relative border border-gray-600 rounded-md overflow-hidden h-48">
                      <Image
                        src={featuredPreview}
                        alt="Featured preview"
                        className="object-cover"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="border border-gray-600 rounded-md p-8 text-center bg-gray-900">
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-400">No featured image selected</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => featuredInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-gray-200 text-black rounded-md text-sm flex-1 font-medium"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Choose Image'}
                    </button>
                    <input
                      type="file"
                      ref={featuredInputRef}
                      onChange={handleFeaturedImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {formData.featuredImage && (
                      <input
                        type="text"
                        value={formData.featuredImage}
                        className="flex-1 px-3 py-1.5 rounded-md border border-gray-600 bg-gray-900 text-white text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                        readOnly
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Additional Images
                </label>
                <div className="flex flex-col space-y-2">
                  {additionalPreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {additionalPreviews.map((preview, index) => (
                        <div key={index} className="relative group border border-gray-600 rounded-md overflow-hidden h-24">
                          <Image
                            src={preview}
                            alt={`Preview ${index}`}
                            className="object-cover"
                            fill
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 bg-white hover:bg-gray-200 text-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-gray-600 rounded-md p-4 text-center bg-gray-900">
                      <p className="text-sm text-gray-400">No additional images selected</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => additionalInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white hover:bg-gray-200 text-black rounded-md text-sm font-medium"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Add Images'}
                  </button>
                  <input
                    type="file"
                    ref={additionalInputRef}
                    onChange={handleAdditionalImagesChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
                  Live Project URL
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="githubLink" className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="https://github.com/yourusername/repo"
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-white focus:ring-gray-500"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">
                    Featured Project (shown prominently on portfolio)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Link
              href="/admin/projects"
              className="px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-md font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-md flex items-center font-medium"
              disabled={submitting || isUploading}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 