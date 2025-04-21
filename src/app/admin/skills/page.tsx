'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { getAllSkills, createSkill, updateSkill, deleteSkill } from '@/lib/api';
import { Skill } from '@/types/skill';

export default function ManageSkills() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [formData, setFormData] = useState({ name: '', category: 'Uncategorized' });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Define common categories for skills
  const commonCategories = [
    'Uncategorized',
    'Programming Languages',
    'Frameworks',
    'Databases',
    'DevOps',
    'Tools',
    'Frontend',
    'Backend',
    'Cloud',
    'Mobile',
    'Other'
  ];
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch skills
  useEffect(() => {
    async function fetchSkills() {
      if (status !== 'authenticated') return;
      
      try {
        const skillsData = await getAllSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setError('Failed to load skills. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSkills();
  }, [status]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission for adding a new skill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Skill name is required');
      return;
    }
    
    setError('');
    setSuccess('');
    
    try {
      if (editingSkill) {
        // Update existing skill
        const updatedSkill = await updateSkill(editingSkill._id, formData);
        if (updatedSkill) {
          setSkills(skills.map(skill => 
            skill._id === editingSkill._id ? updatedSkill : skill
          ));
          setSuccess('Skill updated successfully');
          setEditingSkill(null);
        }
      } else {
        // Create new skill
        const newSkill = await createSkill(formData);
        if (newSkill) {
          setSkills([...skills, newSkill]);
          setSuccess('Skill added successfully');
        }
      }
      
      // Reset form
      setFormData({ name: '', category: 'Uncategorized' });
    } catch (error) {
      console.error('Error saving skill:', error);
      setError('Failed to save skill. Please try again.');
    }
  };
  
  // Handle edit button click
  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category
    });
    setError('');
    setSuccess('');
  };
  
  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    
    setError('');
    setSuccess('');
    
    try {
      const success = await deleteSkill(id);
      if (success) {
        setSkills(skills.filter(skill => skill._id !== id));
        setSuccess('Skill deleted successfully');
      }
    } catch (error) {
      console.error(`Error deleting skill with ID ${id}:`, error);
      setError('Failed to delete skill. Please try again.');
    }
  };
  
  // Handle cancel button click when editing
  const handleCancel = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: 'Uncategorized' });
    setError('');
    setSuccess('');
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
        <h1 className="text-2xl font-bold">Manage Skills</h1>
        <Link
          href="/admin/dashboard"
          className="text-primary hover:text-primary/80"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skill Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. Java, React, Docker"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {commonCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingSkill ? 'Update Skill' : 'Add Skill'}
              </button>
              
              {editingSkill && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Skills List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Skills</h2>
          
          {skills.length === 0 ? (
            <p className="text-gray-500">No skills found. Add your first skill using the form.</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {skills.map(skill => (
                <div 
                  key={skill._id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    {skill.category !== 'Uncategorized' && (
                      <p className="text-sm text-gray-500">{skill.category}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 