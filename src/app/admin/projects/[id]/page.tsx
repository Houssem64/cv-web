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
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <Link
          href="/admin/projects"
          className="text-primary hover:text-primary/80"
        >
          &larr; Back to Projects
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={500}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Brief description for project cards (max 500 characters)</p>
          </div>
          
          <div>
            <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">Detailed description for the project page. Use blank lines for paragraphs.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => featuredInputRef.current?.click()}
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                  type="file"
                  ref={featuredInputRef}
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                  accept="image/*"
                />
                {isUploading && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#3490dc] mr-2"></div>
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                )}
              </div>
              
              {/* Image Preview */}
              {featuredPreview && (
                <div className="relative w-full h-48 overflow-hidden rounded-md border border-gray-300">
                  <Image
                    src={getImageSrc(featuredPreview)}
                    alt="Featured Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Hidden image URL input */}
              <input
                type="hidden"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                required
              />
              
              {formData.featuredImage && !isUploading && (
                <p className="text-xs text-green-600">
                  ✓ Image uploaded successfully
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Images
            </label>
            <div className="mt-1 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => additionalInputRef.current?.click()}
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Images'}
                </button>
                <input
                  type="file"
                  ref={additionalInputRef}
                  onChange={handleAdditionalImagesChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                {isUploading && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#3490dc] mr-2"></div>
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                )}
              </div>
              
              {/* Image Previews */}
              {additionalPreviews.map((preview, index) => (
                <div key={index} className="relative w-full h-48 overflow-hidden rounded-md border border-gray-300">
                  <Image
                    src={getImageSrc(preview)}
                    alt={`Additional Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, Next.js, Tailwind CSS"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Comma-separated list of technologies used</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Feature this project on the homepage
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/projects"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {submitting ? 'Saving...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 