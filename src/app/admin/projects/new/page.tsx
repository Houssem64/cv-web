'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';

export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.description || !formData.fullDescription || !formData.featuredImage || !formData.tags) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Convert comma-separated tags to array
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to create project');
      }
      
      // Redirect to projects list page on success
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
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
        <h1 className="text-2xl font-bold text-white">Add New Project</h1>
        <Link
          href="/admin/projects"
          className="text-white hover:text-gray-300"
        >
          &larr; Back to Projects
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-black rounded-lg shadow p-6 border border-gray-800 text-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-gray-900 text-white"
              required
            />
          </div>
          
          {/* Short Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
              Short Description <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-gray-900 text-white"
              required
              maxLength={500}
            />
            <p className="mt-1 text-sm text-gray-400">Max 500 characters</p>
          </div>
          
          {/* Full Description */}
          <div>
            <label htmlFor="fullDescription" className="block text-sm font-medium text-white mb-1">
              Full Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-gray-900 text-white"
              required
            ></textarea>
          </div>
          
          {/* Featured Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Featured Image <span className="text-red-400">*</span>
            </label>
            <div className="mt-1 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => featuredInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Featured Image'}
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
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span className="text-sm text-gray-300">Uploading...</span>
                  </div>
                )}
              </div>
              
              {/* Featured Image Preview */}
              {featuredPreview && (
                <div className="relative w-full h-48 overflow-hidden rounded-md border border-gray-700">
                  <Image
                    src={featuredPreview}
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
            </div>
          </div>
          
          {/* Additional Images Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Additional Images
            </label>
            <div className="mt-1 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => additionalInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Additional Images'}
                </button>
                <input
                  type="file"
                  ref={additionalInputRef}
                  onChange={handleAdditionalImagesChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </div>
              
              {/* Additional Images Preview */}
              {additionalPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {additionalPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32 overflow-hidden rounded-md border border-gray-700">
                        <Image
                          src={preview}
                          alt={`Additional Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-white mb-1">
              Tags <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-gray-900 text-white"
              placeholder="e.g. React, Next.js, TailwindCSS"
              required
            />
            <p className="mt-1 text-sm text-gray-400">Comma separated list of tags</p>
          </div>
          
          {/* Project Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-white mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-gray-900 text-white"
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-white mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-gray-900 text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          
          {/* Featured Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-white focus:ring-white border-gray-700 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-white">
              Feature this project on the homepage
            </label>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 