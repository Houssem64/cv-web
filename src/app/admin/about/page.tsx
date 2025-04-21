'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { getAboutData, updateAboutData } from '@/lib/api';
import { About } from '@/types/about';

export default function EditAbout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for about data
  const [formData, setFormData] = useState<About | null>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      if (status !== 'authenticated') return;
      
      try {
        const data = await getAboutData();
        if (data) {
          setFormData(data);
          if (data.profileImage) {
            setPreviewImage(data.profileImage);
          }
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        setError('Failed to load about data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, [status]);
  
  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle bio changes (array of paragraphs)
  const handleBioChange = (index: number, value: string) => {
    if (!formData) return;
    
    const updatedBio = [...formData.bio];
    updatedBio[index] = value;
    
    setFormData({
      ...formData,
      bio: updatedBio,
    });
  };
  
  // Add new bio paragraph
  const addBioParagraph = () => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      bio: [...formData.bio, ''],
    });
  };
  
  // Remove bio paragraph
  const removeBioParagraph = (index: number) => {
    if (!formData) return;
    
    const updatedBio = formData.bio.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      bio: updatedBio,
    });
  };
  
  // Handle skills changes
  const handleSkillTitleChange = (index: number, value: string) => {
    if (!formData) return;
    
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      title: value,
    };
    
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };
  
  const handleSkillItemChange = (categoryIndex: number, itemIndex: number, value: string) => {
    if (!formData) return;
    
    const updatedSkills = [...formData.skills];
    const updatedItems = [...updatedSkills[categoryIndex].items];
    updatedItems[itemIndex] = value;
    
    updatedSkills[categoryIndex] = {
      ...updatedSkills[categoryIndex],
      items: updatedItems,
    };
    
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };
  
  const addSkillItem = (categoryIndex: number) => {
    if (!formData) return;
    
    const updatedSkills = [...formData.skills];
    updatedSkills[categoryIndex].items.push('');
    
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };
  
  const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
    if (!formData) return;
    
    const updatedSkills = [...formData.skills];
    updatedSkills[categoryIndex].items = updatedSkills[categoryIndex].items.filter((_, i) => i !== itemIndex);
    
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };
  
  // Handle experience changes
  const handleExperienceChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      experiences: updatedExperiences,
    });
  };
  
  const addExperience = () => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      experiences: [
        ...formData.experiences,
        {
          title: '',
          company: '',
          period: '',
          description: '',
        },
      ],
    });
  };
  
  const removeExperience = (index: number) => {
    if (!formData) return;
    
    const updatedExperiences = formData.experiences.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      experiences: updatedExperiences,
    });
  };
  
  // Handle education changes
  const handleEducationChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };
  
  const addEducation = () => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: '',
          institution: '',
          period: '',
          description: '',
        },
      ],
    });
  };
  
  const removeEducation = (index: number) => {
    if (!formData) return;
    
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };
  
  // Handle file upload for profile image
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image to R2
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
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
      setFormData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          profileImage: data.url,
        };
      });
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      setIsUploading(false);
    }
  };
  
  // Handle contact info changes
  const handleContactInfoChange = (field: string, value: string) => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      contactInfo: {
        ...formData.contactInfo,
        [field]: value,
      }
    });
  };
  
  // Handle certification changes
  const handleCertificationChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    
    const updatedCertifications = [...(formData.certifications || [])];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
  };
  
  // Add certification
  const addCertification = () => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      certifications: [
        ...(formData.certifications || []),
        {
          title: '',
          issuer: '',
          year: '',
          credential: '',
          url: '',
        },
      ],
    });
  };
  
  // Remove certification
  const removeCertification = (index: number) => {
    if (!formData) return;
    
    const updatedCertifications = (formData.certifications || []).filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      const result = await updateAboutData(formData);
      
      if (result) {
        router.push('/admin/dashboard');
      } else {
        throw new Error('Failed to update about data');
      }
    } catch (error) {
      console.error('Error updating about data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      setSubmitting(false);
    }
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
  
  if (!session || !formData) {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit About Me</h1>
        <div className="flex space-x-4">
          <Link
            href="/admin/about/reset"
            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm"
          >
            Reset & Add Custom Data
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-primary hover:text-primary/80"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Info */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
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
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <div className="mt-1 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
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
              {previewImage && (
                <div className="relative w-full h-48 overflow-hidden rounded-md border border-gray-300">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Hidden image URL input */}
              <input
                type="hidden"
                id="profileImage"
                name="profileImage"
                value={formData.profileImage}
                required
              />
            </div>
          </div>
          
          {/* Bio */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Bio</h2>
              <button
                type="button"
                onClick={addBioParagraph}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
              >
                Add Paragraph
              </button>
            </div>
            
            {formData.bio.map((paragraph, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-start">
                  <textarea
                    value={paragraph}
                    onChange={(e) => handleBioChange(index, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeBioParagraph(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    disabled={formData.bio.length <= 1}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Skills */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-medium mb-2">Skills</h2>
            
            {formData.skills.map((skillCategory, categoryIndex) => (
              <div key={categoryIndex} className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Title
                  </label>
                  <input
                    type="text"
                    value={skillCategory.title}
                    onChange={(e) => handleSkillTitleChange(categoryIndex, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Skills
                    </label>
                    <button
                      type="button"
                      onClick={() => addSkillItem(categoryIndex)}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
                    >
                      Add Skill
                    </button>
                  </div>
                  
                  {skillCategory.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleSkillItemChange(categoryIndex, itemIndex, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkillItem(categoryIndex, itemIndex)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={skillCategory.items.length <= 1}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Work Experience */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Work Experience</h2>
              <button
                type="button"
                onClick={addExperience}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
              >
                Add Experience
              </button>
            </div>
            
            {formData.experiences.map((experience, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-md font-medium">Experience #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.experiences.length <= 1}
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={experience.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={experience.period}
                    onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. 2020 - Present"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={experience.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Education */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Education</h2>
              <button
                type="button"
                onClick={addEducation}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
              >
                Add Education
              </button>
            </div>
            
            {formData.education.map((education, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-md font-medium">Education #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.education.length <= 1}
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={education.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={education.period}
                    onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. 2012 - 2016"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={education.description}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Contact Information */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-medium mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.contactInfo?.location || ''}
                  onChange={(e) => handleContactInfoChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. New York, USA"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.contactInfo?.phone || ''}
                  onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. +1 234 567 8900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. yourname@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.contactInfo?.linkedin || ''}
                  onChange={(e) => handleContactInfoChange('linkedin', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. https://linkedin.com/in/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.contactInfo?.github || ''}
                  onChange={(e) => handleContactInfoChange('github', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. https://github.com/username"
                />
              </div>
            </div>
          </div>
          
          {/* Certifications */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Certifications</h2>
              <button
                type="button"
                onClick={addCertification}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
              >
                Add Certification
              </button>
            </div>
            
            {(formData.certifications || []).map((certification, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-md font-medium">Certification #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={certification.title}
                      onChange={(e) => handleCertificationChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      value={certification.issuer}
                      onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={certification.year}
                    onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. 2023"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential ID (optional)
                  </label>
                  <input
                    type="text"
                    value={certification.credential || ''}
                    onChange={(e) => handleCertificationChange(index, 'credential', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification URL (optional)
                  </label>
                  <input
                    type="url"
                    value={certification.url || ''}
                    onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. https://example.com/verify/123"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 