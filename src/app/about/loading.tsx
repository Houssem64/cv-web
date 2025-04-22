"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section Skeleton */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-md mb-4 animate-pulse" />
            <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          </motion.section>
          
          {/* About Content Skeleton */}
          <motion.section 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="relative h-[500px] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse" />
            
            <div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
                ))}
              </div>
            </div>
          </motion.section>
          
          {/* Skills Section Skeleton */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="h-8 w-36 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
} 