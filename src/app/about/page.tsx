import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAboutData } from '@/lib/api';
import { About } from '@/types/about';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const aboutData = await getAboutData();
  
  // Fallback if no data is available
  if (!aboutData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-900/20 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Unable to load about information.</p>
              <p className="text-gray-500 dark:text-gray-400">Please try again later.</p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen dark:bg-black">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">{aboutData.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              {aboutData.subtitle}
            </p>
          </section>
          
          {/* About Content */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-md dark:shadow-gray-900/20">
              <Image
                src={aboutData.profileImage}
                alt="Developer"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 dark:text-white">My Journey</h2>
              <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                {aboutData.bio.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
          
          {/* Skills Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutData.skills.map((skillCategory: About['skills'][0], index: number) => (
                <div key={index} className="card bg-white dark:bg-gray-900 shadow dark:shadow-gray-900/20">
                  <h3 className="text-xl font-bold mb-4 text-primary dark:text-white">{skillCategory.title}</h3>
                  <ul className="space-y-2">
                    {skillCategory.items.map((skill: string, skillIndex: number) => (
                      <li key={skillIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                        <span className="w-2 h-2 bg-primary dark:bg-white rounded-full mr-2"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          
          {/* Experience Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 dark:text-white">Work Experience</h2>
            <div className="space-y-8">
              {aboutData.experiences.map((experience: About['experiences'][0], index: number) => (
                <div key={index} className="border-l-4 border-primary dark:border-white pl-6 py-2">
                  <h3 className="text-xl font-bold dark:text-white">{experience.title}</h3>
                  <p className="text-primary dark:text-gray-400 mb-2">{experience.company} | {experience.period}</p>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {experience.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Education Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 dark:text-white">Education</h2>
            <div className="space-y-8">
              {aboutData.education.map((edu: About['education'][0], index: number) => (
                <div key={index} className="border-l-4 border-primary dark:border-white pl-6 py-2">
                  <h3 className="text-xl font-bold dark:text-white">{edu.degree}</h3>
                  <p className="text-primary dark:text-gray-400 mb-2">{edu.institution} | {edu.period}</p>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Info */}
          {aboutData.contactInfo && (
            <section className="mt-16 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">Contact Information</h2>
              <div className="space-y-2">
                {aboutData.contactInfo.location && (
                  <p className="text-lg dark:text-gray-300"><strong className="dark:text-white">Location:</strong> {aboutData.contactInfo.location}</p>
                )}
                {aboutData.contactInfo.phone && (
                  <p className="text-lg dark:text-gray-300"><strong className="dark:text-white">Phone:</strong> {aboutData.contactInfo.phone}</p>
                )}
                {aboutData.contactInfo.email && (
                  <p className="text-lg dark:text-gray-300"><strong className="dark:text-white">Email:</strong> {aboutData.contactInfo.email}</p>
                )}
                <div className="flex space-x-4 mt-4">
                  {aboutData.contactInfo.linkedin && (
                    <a href={aboutData.contactInfo.linkedin} className="btn bg-blue-600 dark:bg-gray-800 text-white hover:bg-blue-700 dark:hover:bg-gray-700">LinkedIn Profile</a>
                  )}
                  {aboutData.contactInfo.github && (
                    <a href={aboutData.contactInfo.github} className="btn bg-gray-800 text-white hover:bg-gray-900">GitHub Profile</a>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Certifications */}
          {aboutData.certifications && aboutData.certifications.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8 dark:text-white">Licenses & Certifications</h2>
              <div className="space-y-8">
                {aboutData.certifications.map((cert, index) => (
                  <div key={index} className="border-l-4 border-primary dark:border-white pl-6 py-2">
                    <h3 className="text-xl font-bold dark:text-white">{cert.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{cert.issuer} - {cert.year}</p>
                    {cert.credential && <p className="text-lg dark:text-gray-300">Credential ID: {cert.credential}</p>}
                    {cert.url && <p className="text-lg dark:text-gray-300">Verify at: {cert.url}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 