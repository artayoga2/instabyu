'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI } from '@/lib/api';
import { getUserInitials, getAvatarBackgroundColor } from '@/lib/userUtils';

/**
 * TopHeader Component - Header atas dengan circle avatar user
 * Menampilkan stories dan avatar user seperti Instagram
 */
export default function TopHeader() {
  const { user: currentUser } = useAuth(); // Ambil data user yang login
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  // Fungsi untuk mengecek scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Tambah tolerance
    }
  };

  // Fungsi untuk scroll ke kiri
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  // Fungsi untuk scroll ke kanan
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  // Fetch stories dari API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        // Ambil data users dari API untuk stories
        const response = await usersAPI.getAll();

        if (response.success && response.data) {
          // Format data untuk stories, tambahkan "Your Story" di awal jika user login
          const storiesData = [];

          // Tambahkan "Your Story" jika user login
          if (currentUser) {
            storiesData.push({
              id: 'own',
              name: 'Your Story',
              username: currentUser.username,
              avatar: currentUser.avatar,
              isOwn: true,
            });
          }

          // Filter users lain (jangan tampilkan user yang sedang login)
          const otherUsers = response.data
            .filter(user => (currentUser ? user.id !== currentUser.id : true))
            .map(user => ({
              id: user.id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
              isOwn: false,
            }));

          storiesData.push(...otherUsers);
          setStories(storiesData);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
        // Fallback ke data dummy dengan lebih banyak data untuk testing arrow
        setStories([
          { id: 'own', name: 'Your Story', avatar: null, isOwn: true },
          { id: 2, name: 'Alice', avatar: null },
          { id: 3, name: 'Bob', avatar: null },
          { id: 4, name: 'Charlie', avatar: null },
          { id: 5, name: 'Diana', avatar: null },
          { id: 6, name: 'Edward', avatar: null },
          { id: 7, name: 'Fiona', avatar: null },
          { id: 8, name: 'George', avatar: null },
          { id: 9, name: 'Hannah', avatar: null },
          { id: 10, name: 'Ivan', avatar: null },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [currentUser]);

  // Effect untuk mengecek scroll position setelah stories dimuat
  useEffect(() => {
    if (!loading && stories.length > 0) {
      // Delay sedikit untuk memastikan DOM sudah ter-render
      const timer = setTimeout(() => {
        checkScrollPosition();
      }, 200);

      // Tambahkan event listener untuk resize
      const handleResize = () => {
        checkScrollPosition();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [loading, stories]);

  // Effect untuk force check scroll position saat component mount
  useEffect(() => {
    if (scrollContainerRef.current && stories.length > 0) {
      const timer = setTimeout(() => {
        checkScrollPosition();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [stories]);

  if (loading) {
    return (
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='bg-white border-b border-gray-200 sticky top-0 z-30'
      >
        <div className='px-4 lg:px-6 py-3 lg:py-4'>
          <div className='flex items-center space-x-3 lg:space-x-4'>
            {/* Loading skeleton */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className='flex flex-col items-center space-y-1 flex-shrink-0'
              >
                <div className='w-12 h-12 lg:w-14 lg:h-14 bg-gray-200 rounded-full animate-pulse'></div>
                <div className='w-8 h-2 bg-gray-200 rounded animate-pulse'></div>
              </div>
            ))}
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='bg-white border-b border-gray-200 sticky top-0 z-30'
    >
      <div className='px-4 lg:px-6 py-3 lg:py-4'>
        {/* Stories Section dengan Carousel */}
        <div className='relative'>
          {/* Arrow Kiri */}
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleScrollLeft}
              className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-1.5 transition-all duration-200 hover:scale-110'
            >
              <ChevronLeft className='w-4 h-4 text-gray-600' />
            </motion.button>
          )}

          {/* Arrow Kanan */}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleScrollRight}
              className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-1.5 transition-all duration-200 hover:scale-110'
            >
              <ChevronRight className='w-4 h-4 text-gray-600' />
            </motion.button>
          )}

          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className='flex items-center space-x-3 lg:space-x-4 overflow-x-auto scrollbar-hide scroll-smooth'
          >
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex flex-col items-center space-y-1 cursor-pointer flex-shrink-0'
              >
                {/* Story Avatar dengan gradient border */}
                <div
                  className={`p-0.5 rounded-full ${
                    story.isOwn
                      ? 'bg-gradient-to-tr from-purple-600 to-blue-800'
                      : 'bg-gradient-to-tr from-purple-600 to-blue-800'
                  }`}
                >
                  <div className='bg-white p-0.5 rounded-full'>
                    <Avatar className='w-12 h-12 lg:w-14 lg:h-14'>
                      {/* Gunakan avatar jika ada, jika tidak gunakan getUserInitials */}
                      {story.avatar ? (
                        <AvatarImage src={story.avatar} alt={story.name} />
                      ) : null}
                      <AvatarFallback
                        className='text-xs lg:text-sm font-medium text-white bg-gradient-to-br from-purple-600 to-blue-800'
                      >
                        {getUserInitials(story.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Story Name */}
                <span className='text-xs text-gray-600 max-w-[50px] lg:max-w-[60px] truncate'>
                  {story.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
