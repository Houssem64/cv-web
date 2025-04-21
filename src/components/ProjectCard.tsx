"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '../types/project';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const ProjectCard = ({ id, title, description, image, tags }: ProjectCardProps) => {
  // Default placeholder image if none provided
  const imageSrc = image || '/images/placeholder.jpg';
  
  return (
    <div className="card group hover:scale-[1.01] transition-transform duration-200">
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-[#3490dc] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/projects/${id}`} className="btn btn-primary">
        View Project
      </Link>
    </div>
  );
};

export default ProjectCard; 