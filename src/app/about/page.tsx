import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold mb-4">About Me</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              I'm a passionate developer focused on creating beautiful, functional websites and applications.
            </p>
          </section>
          
          {/* About Content */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRldmVsb3BlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                alt="Developer"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">My Journey</h2>
              <div className="space-y-4 text-lg">
                <p>
                  With over 5 years of experience in web development, I've worked on a variety of projects, from small business websites to complex web applications. My journey began with a fascination for creating things online, which led me to pursue a degree in Computer Science.
                </p>
                <p>
                  After graduating, I worked at several tech companies where I honed my skills in frontend and backend development. During this time, I developed a passion for clean code, user-centric design, and solving complex technical challenges.
                </p>
                <p>
                  Today, I specialize in building modern web applications using technologies like React, Next.js, Node.js, and various databases. I'm particularly interested in creating intuitive user experiences and scalable architectures.
                </p>
                <p>
                  When I'm not coding, you can find me exploring the outdoors, reading about new technologies, or contributing to open-source projects.
                </p>
              </div>
            </div>
          </section>
          
          {/* Skills Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold mb-4 text-primary">Frontend Development</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    React, Next.js, Vue.js
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    JavaScript, TypeScript
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    HTML5, CSS3, Sass
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Tailwind CSS, Material UI
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Responsive Design, Accessibility
                  </li>
                </ul>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-4 text-primary">Backend Development</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Node.js, Express
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    MongoDB, PostgreSQL
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    REST APIs, GraphQL
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Authentication, Security
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Firebase, AWS
                  </li>
                </ul>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-4 text-primary">Tools & Others</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Git, GitHub, CI/CD
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Docker, Kubernetes
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Testing (Jest, Cypress)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Agile Methodologies
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    UI/UX Design Principles
                  </li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Experience Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Work Experience</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="text-xl font-bold">Senior Frontend Developer</h3>
                <p className="text-gray-600 mb-2">TechCorp Inc. | 2020 - Present</p>
                <p className="text-lg">
                  Lead development of multiple web applications using React and Next.js. Implemented CI/CD pipelines, mentored junior developers, and improved application performance by 35%.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="text-xl font-bold">Full Stack Developer</h3>
                <p className="text-gray-600 mb-2">WebSolutions | 2018 - 2020</p>
                <p className="text-lg">
                  Developed and maintained various client websites and web applications. Worked with Node.js, Express, MongoDB, and React. Collaborated with designers and product managers.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="text-xl font-bold">Junior Web Developer</h3>
                <p className="text-gray-600 mb-2">Digital Agency | 2016 - 2018</p>
                <p className="text-lg">
                  Built responsive websites for clients using HTML, CSS, JavaScript, and WordPress. Participated in client meetings and implemented feedback in a timely manner.
                </p>
              </div>
            </div>
          </section>
          
          {/* Education Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Education</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="text-xl font-bold">Bachelor of Science in Computer Science</h3>
                <p className="text-gray-600 mb-2">University of Technology | 2012 - 2016</p>
                <p className="text-lg">
                  Focused on software engineering, algorithms, and web development. Graduated with honors and participated in various coding competitions.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="text-xl font-bold">Web Development Bootcamp</h3>
                <p className="text-gray-600 mb-2">Code Academy | 2016</p>
                <p className="text-lg">
                  Intensive 3-month bootcamp focusing on modern web technologies and development practices. Completed multiple projects as part of the curriculum.
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