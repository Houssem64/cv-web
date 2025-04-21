import mongoose, { Schema, Document } from 'mongoose';

export interface IAbout extends Document {
  title: string;
  subtitle: string;
  profileImage: string;
  bio: string[];
  skills: {
    title: string;
    items: string[];
  }[];
  experiences: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    description: string;
  }[];
  contactInfo?: {
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
  };
  certifications?: {
    title: string;
    issuer: string;
    year: string;
    credential?: string;
    url?: string;
  }[];
  updatedAt: Date;
}

const AboutSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      default: 'About Me',
    },
    subtitle: {
      type: String,
      required: [true, 'Please provide a subtitle'],
      default: "I'm a passionate developer focused on creating beautiful, functional websites and applications.",
    },
    profileImage: {
      type: String,
      required: [true, 'Please provide a profile image URL'],
      default: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRldmVsb3BlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    },
    bio: {
      type: [String],
      required: [true, 'Please provide a bio'],
      default: [
        "With over 5 years of experience in web development, I've worked on a variety of projects, from small business websites to complex web applications. My journey began with a fascination for creating things online, which led me to pursue a degree in Computer Science.",
        "After graduating, I worked at several tech companies where I honed my skills in frontend and backend development. During this time, I developed a passion for clean code, user-centric design, and solving complex technical challenges.",
        "Today, I specialize in building modern web applications using technologies like React, Next.js, Node.js, and various databases. I'm particularly interested in creating intuitive user experiences and scalable architectures.",
        "When I'm not coding, you can find me exploring the outdoors, reading about new technologies, or contributing to open-source projects."
      ],
    },
    skills: {
      type: [{
        title: String,
        items: [String],
      }],
      default: [
        {
          title: 'Frontend Development',
          items: ['React, Next.js, Vue.js', 'JavaScript, TypeScript', 'HTML5, CSS3, Sass', 'Tailwind CSS, Material UI', 'Responsive Design, Accessibility'],
        },
        {
          title: 'Backend Development',
          items: ['Node.js, Express', 'MongoDB, PostgreSQL', 'REST APIs, GraphQL', 'Authentication, Security', 'Firebase, AWS'],
        },
        {
          title: 'Tools & Others',
          items: ['Git, GitHub, CI/CD', 'Docker, Kubernetes', 'Testing (Jest, Cypress)', 'Agile Methodologies', 'UI/UX Design Principles'],
        },
      ],
    },
    experiences: {
      type: [{
        title: String,
        company: String,
        period: String,
        description: String,
      }],
      default: [
        {
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          period: '2020 - Present',
          description: 'Lead development of multiple web applications using React and Next.js. Implemented CI/CD pipelines, mentored junior developers, and improved application performance by 35%.',
        },
        {
          title: 'Full Stack Developer',
          company: 'WebSolutions',
          period: '2018 - 2020',
          description: 'Developed and maintained various client websites and web applications. Worked with Node.js, Express, MongoDB, and React. Collaborated with designers and product managers.',
        },
        {
          title: 'Junior Web Developer',
          company: 'Digital Agency',
          period: '2016 - 2018',
          description: 'Built responsive websites for clients using HTML, CSS, JavaScript, and WordPress. Participated in client meetings and implemented feedback in a timely manner.',
        },
      ],
    },
    education: {
      type: [{
        degree: String,
        institution: String,
        period: String,
        description: String,
      }],
      default: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          period: '2012 - 2016',
          description: 'Focused on software engineering, algorithms, and web development. Graduated with honors and participated in various coding competitions.',
        },
        {
          degree: 'Web Development Bootcamp',
          institution: 'Code Academy',
          period: '2016',
          description: 'Intensive 3-month bootcamp focusing on modern web technologies and development practices. Completed multiple projects as part of the curriculum.',
        },
      ],
    },
    contactInfo: {
      type: {
        location: String,
        phone: String,
        email: String,
        linkedin: String,
        github: String,
      },
      default: {
        location: 'Tunisia',
        phone: '+216 12 345 678',
        email: 'contact@example.com',
        linkedin: 'https://linkedin.com/in/example',
        github: 'https://github.com/example',
      },
    },
    certifications: {
      type: [{
        title: String,
        issuer: String,
        year: String,
        credential: String,
        url: String,
      }],
      default: [
        {
          title: 'Web Development Certification',
          issuer: 'Coursera',
          year: '2022',
          credential: 'ABC123456',
          url: 'https://coursera.org/verify/ABC123456',
        },
        {
          title: 'Professional Developer Certification',
          issuer: 'Microsoft',
          year: '2021',
          credential: 'MS-DEV-12345',
          url: 'https://microsoft.com/verify/MS-DEV-12345',
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema); 