"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section Skeleton */}
          <section className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md mb-4 mx-auto animate-pulse" />
              <div className="h-5 w-96 bg-gray-200 dark:bg-gray-800 rounded-md mx-auto animate-pulse" />
            </motion.div>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form Skeleton */}
            <section>
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800/40 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse" />
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </div>
                    <div>
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  </div>
                  
                  <div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  </div>
                  
                  <div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  </div>
                  
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
                </div>
              </motion.div>
            </section>
            
            {/* Contact Information Skeleton */}
            <section>
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800/40 p-6 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="h-8 w-56 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse" />
                
                <div className="space-y-8">
                  <div>
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-5 w-56 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                  
                  <div>
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                  
                  <div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-5 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                  
                  <div>
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="flex space-x-4">
                      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 