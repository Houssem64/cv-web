"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function ProjectsLoading() {
  // Generate an array for skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-8 w-64 bg-gray-200 rounded-md mb-4 animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skeletonCards.map((index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-4 animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded-md mb-2 animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded-md mb-4 animate-pulse" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 