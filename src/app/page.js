'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import MainFeed from '@/components/layout/MainFeed';
import PopularPosts from '@/components/layout/PopularPosts';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect ke login jika belum terautentikasi
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600 text-sm sm:text-base'>Loading...</p>
        </div>
      </div>
    );
  }

  // Jika belum terautentikasi, tidak render apapun (akan redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <Sidebar />

      {/* Main Layout Container */}
      <div className='lg:ml-64'>
        {/* TopHeader Container - Dibatasi agar tidak override PopularPosts */}
        <div className='flex justify-center'>
          <div className='w-full max-w-[850px] xl:mr-80'>
            <TopHeader />
          </div>
        </div>

        {/* Content Container dengan flex untuk MainFeed dan PopularPosts */}
        <div className='flex justify-center'>
          {/* MainFeed Container dengan lebar maksimum tetap */}
          <div className='w-full max-w-[470px] xl:mr-80 pt-4'>
            <MainFeed />
          </div>

          {/* Right Container - PopularPosts - Hidden on mobile, visible on xl screens */}
          <div className='hidden xl:block fixed right-0 top-0 w-80 h-full overflow-y-auto bg-white border-l border-gray-200 pt-[73px]'>
            <PopularPosts />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50'
      >
        <div className='flex items-center justify-around py-2'>
          <Link href='/' className='flex flex-col items-center p-2'>
            <Home className='w-6 h-6 text-gray-700' />
          </Link>
          <Link href='/search' className='flex flex-col items-center p-2'>
            <Search className='w-6 h-6 text-gray-500' />
          </Link>
          <Link href='/create' className='flex flex-col items-center p-2'>
            <PlusSquare className='w-6 h-6 text-gray-500' />
          </Link>
          <Link
            href='/notifications'
            className='flex flex-col items-center p-2'
          >
            <Heart className='w-6 h-6 text-gray-500' />
          </Link>
          <Link href='/profile' className='flex flex-col items-center p-2'>
            <User className='w-6 h-6 text-gray-500' />
          </Link>
        </div>
      </motion.nav>
    </div>
  );
}
