'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // İlk yüklemede kontrol et

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 hidden md:block"
          title="Yukarı Çık"
          type="button"
          aria-label="Sayfanın başına dön"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
} 