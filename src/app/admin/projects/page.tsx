'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';

interface Project {
  _id: string;
  id?: string; // Keep for backward compatibility
  title: string;
  description: string;
  image?: string;
  featuredImage?: string; // Support for newer field name
  featured: boolean;
  tags: string[];
  link: string;
  github: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjects() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/projects/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter((project) => project._id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <Link
            href="/admin/projects/new"
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-black rounded-lg p-8 text-center border border-gray-800">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">Get started by creating a new project</p>
            <Link
              href="/admin/projects/new"
              className="px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-md font-medium"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-black rounded-lg shadow-md overflow-hidden border border-gray-800"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/4 h-48">
                    {project.featuredImage || project.image ? (
                      <Image
                        src={project.featuredImage || project.image || ''}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-500"
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
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                          {project.title}
                          {project.featured && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-yellow-400">
                              Featured
                            </span>
                          )}
                        </h2>
                        <p className="text-gray-400 line-clamp-2 mb-4">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className="px-3 py-1.5 bg-white hover:bg-gray-200 text-black rounded-md text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => confirmDelete(project._id)}
                        className="px-3 py-1.5 bg-white hover:bg-gray-200 text-black rounded-md text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-black rounded-lg p-6 max-w-md w-full border border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-white hover:bg-gray-200 text-red-600 rounded-md font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 