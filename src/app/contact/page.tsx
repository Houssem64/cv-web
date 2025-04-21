"use client";

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null as string | null
  });
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setStatus({ submitting: true, success: false, error: null });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
      
      setStatus({
        submitting: false,
        success: true,
        error: null
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error: unknown) {
      setStatus({
        submitting: false,
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.
            </p>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <section>
              <div className="card shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
                
                {status.success && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded">
                    Your message has been sent successfully. I'll get back to you soon!
                  </div>
                )}
                
                {status.error && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
                    {status.error}
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="btn btn-primary w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </section>
            
            {/* Contact Information */}
            <section>
              <div className="card shadow-lg h-full">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Email</h3>
                    <p className="text-gray-700">contact@example.com</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Phone</h3>
                    <p className="text-gray-700">+1 (123) 456-7890</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
                    <p className="text-gray-700">
                      San Francisco, CA<br />
                      United States
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Connect</h3>
                    <div className="flex space-x-4">
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-primary transition-colors"
                      >
                        GitHub
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-primary transition-colors"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-primary transition-colors"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Working Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 9am - 5pm<br />
                      Weekend: By appointment
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          {/* FAQ Section */}
    
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 