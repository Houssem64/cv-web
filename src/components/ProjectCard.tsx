"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Project } from '../types/project';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const ProjectCard = ({ id, title, description, image, tags }: ProjectCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Default placeholder image if none provided
  const imageSrc = image || '/images/placeholder.jpg';
  
  return (
    <Link href={`/projects/${id}`} className="block">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md dark:shadow-gray-900/20 p-4 transition-all duration-300 h-full cursor-pointer flex flex-col"
      >
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
          <div className={`absolute inset-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-full h-full animate-pulse bg-gray-300 dark:bg-gray-600" />
          </div>
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            loading="lazy"
            onLoadingComplete={() => setImageLoaded(true)}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            placeholder="blur"
          />
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[3rem] flex-grow">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          <span 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                    text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 
                    dark:bg-gray-800 dark:hover:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900
                    transition-colors duration-200"
          >
            View Project
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProjectCard; 