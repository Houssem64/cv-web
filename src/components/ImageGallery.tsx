'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoCloseOutline } from 'react-icons/io5';

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (transitioning) return;
    setDirection('prev');
    setTransitioning(true);
    
    // Schedule the actual state update to happen after transition starts
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      
      // Reset transitioning state after the transition completes
      timeoutRef.current = setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }, 50) ;
  };

  const goToNext = () => {
    if (transitioning) return;
    setDirection('next');
    setTransitioning(true);
    
    // Schedule the actual state update to happen after transition starts
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      
      // Reset transitioning state after the transition completes
      timeoutRef.current = setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }, 50) ;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (transitioning) return;
    
    const touchDiff = touchStart - touchEnd;
    if (touchDiff > 100) {
      // Swipe left
      goToNext();
    } else if (touchDiff < -100) {
      // Swipe right
      goToPrevious();
    }
  };

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
      // Clear any lingering timeouts on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div 
            key={index} 
            className="relative h-64 rounded-lg overflow-hidden shadow cursor-pointer group"
            onClick={() => openGallery(index)}
          >
            <Image
              src={imageUrl}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Fullscreen Gallery */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-0 flex flex-col justify-center items-center animate-fade-in"
          style={{ 
            animation: 'fadeIn 0.3s ease-in-out forwards',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={closeGallery}
              className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
              aria-label="Close gallery"
            >
              <IoCloseOutline size={30} />
            </button>
          </div>
          
          <div 
            className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto px-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Current Image with transition */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${
                  transitioning 
                    ? direction === 'next' 
                      ? 'translate-x-full opacity-0' 
                      : '-translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              
              {/* Previous Image (for animation) */}
              {transitioning && direction === 'next' && (
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out -translate-x-full">
                  <Image
                    src={images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]}
                    alt={`${title} - Previous Image`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              )}
              
              {/* Next Image (for animation) */}
              {transitioning && direction === 'prev' && (
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out translate-x-full">
                  <Image
                    src={images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]}
                    alt={`${title} - Next Image`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>
            
            <button 
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors duration-300 z-10"
              aria-label="Previous image"
              disabled={transitioning}
            >
              <IoChevronBackOutline size={24} />
            </button>
            
            <button 
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors duration-300 z-10"
              aria-label="Next image"
              disabled={transitioning}
            >
              <IoChevronForwardOutline size={24} />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-2 rounded-full max-w-[100px] mx-auto transition-opacity duration-300">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {/* Add custom keyframes for fade-in animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { background-color: rgba(0, 0, 0, 0); }
          to { background-color: rgba(0, 0, 0, 0.9); }
        }
      `}</style>
    </>
  );
} 