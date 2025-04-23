'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoCloseOutline, IoExpandOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<{[key: number]: boolean}>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageLoaded = (index: number) => {
    setLoadedImages(prev => ({...prev, [index]: true}));
  };

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = useCallback(() => {
    if (transitioning) return;
    setDirection('prev');
    setTransitioning(true);
    
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    
    setTimeout(() => {
      setTransitioning(false);
    }, 300);
  }, [transitioning, images.length]);

  const goToNext = useCallback(() => {
    if (transitioning) return;
    setDirection('next');
    setTransitioning(true);
    
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setTransitioning(false);
    }, 300);
  }, [transitioning, images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = useCallback(() => {
    if (transitioning) return;
    
    const touchDiff = touchStart - touchEnd;
    if (touchDiff > 100) {
      // Swipe left
      goToNext();
    } else if (touchDiff < -100) {
      // Swipe right
      goToPrevious();
    }
  }, [transitioning, touchStart, touchEnd, goToNext, goToPrevious]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {   
    if (!isOpen) return;
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeGallery();
  }, [isOpen, goToPrevious, goToNext]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  // Preload the next and previous images
  useEffect(() => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    
    const preloadImage = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };
    
    if (images[nextIndex]) preloadImage(images[nextIndex]);
    if (images[prevIndex]) preloadImage(images[prevIndex]);
  }, [currentIndex, images]);

  // Animation variants for framer-motion
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Image Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((imageUrl, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className="relative h-64 rounded-lg overflow-hidden shadow-md dark:shadow-gray-900/20 cursor-pointer group"
            onClick={() => openGallery(index)}
          >
            <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${loadedImages[index] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <div className="w-full h-full animate-pulse" />
            </div>
            <Image
              src={imageUrl}
              alt={`${title} - Image ${index + 1}`}
              fill
              className={`object-cover transition-all duration-500 ${loadedImages[index] ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              onLoadingComplete={() => handleImageLoaded(index)}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 rounded-full p-3">
                <IoExpandOutline size={20} className="text-gray-800 dark:text-gray-200" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex flex-col justify-center items-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 z-10"
            >
              <button 
                onClick={closeGallery}
                className="text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
                aria-label="Close gallery"
              >
                <IoCloseOutline size={30} />
              </button>
            </motion.div>
            
            <div 
              className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto px-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: direction === 'next' ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 'next' ? -100 : 100 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={images[currentIndex]}
                      alt={`${title} - Image ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={goToPrevious}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300 z-10"
                aria-label="Previous image"
                disabled={transitioning}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoChevronBackOutline size={24} />
              </motion.button>
              
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={goToNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300 z-10"
                aria-label="Next image"
                disabled={transitioning}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoChevronForwardOutline size={24} />
              </motion.button>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/60 py-2 px-4 rounded-full max-w-[120px] mx-auto shadow-lg"
              >
                {currentIndex + 1} / {images.length}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 