"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header Skeleton */}
          <div className="max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-10 w-3/4 bg-gray-200 rounded-md mb-4 animate-pulse" />
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
              <div className="h-5 w-full bg-gray-200 rounded-md mb-2 animate-pulse" />
              <div className="h-5 w-5/6 bg-gray-200 rounded-md mb-8 animate-pulse" />
            </motion.div>
          </div>
          
          {/* Featured Image Skeleton */}
          <motion.div
            className="max-w-4xl mx-auto mb-8 relative h-[50vh] min-h-[400px] rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          </motion.div>
          
          {/* Image Gallery Skeleton */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded-md mb-4 animate-pulse" />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </motion.div>
          </div>
          
          {/* Project Details Skeleton */}
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-40 bg-gray-200 rounded-md mb-4 animate-pulse" />
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 w-full bg-gray-200 rounded-md animate-pulse" />
              ))}
            </motion.div>
          </div>
        </div>
      </article>
    </div>
  );
} 