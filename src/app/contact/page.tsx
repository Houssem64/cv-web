import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
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
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
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
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Send Message
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
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold mb-2">What services do you offer?</h3>
                <p className="text-gray-700">
                  I offer a range of web development services including frontend development, backend development, full-stack development, custom web applications, e-commerce solutions, and website maintenance.
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-2">How much do your services cost?</h3>
                <p className="text-gray-700">
                  Each project is unique, so pricing varies based on scope, complexity, and timeline. I provide detailed quotes after an initial consultation to understand your specific requirements.
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-2">How long does a typical project take?</h3>
                <p className="text-gray-700">
                  Project timelines depend on size and complexity. A simple website might take 2-4 weeks, while a complex web application could take several months. I'll provide a more accurate timeline during our consultation.
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-2">Do you offer maintenance after launch?</h3>
                <p className="text-gray-700">
                  Yes, I offer ongoing maintenance and support services to ensure your website or application continues to function optimally. This includes regular updates, security patches, and feature enhancements.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 