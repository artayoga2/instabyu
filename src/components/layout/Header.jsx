'use client'; // Client Component untuk interaktivitas

import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Header Component - Navigation bar untuk aplikasi
 * Menggunakan Framer Motion untuk animasi smooth
 */
export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }} // Animasi masuk dari atas
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='bg-white border-b border-gray-200 sticky top-0 z-50'
    >
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <motion.div
              whileHover={{ scale: 1.05 }} // Animasi hover
              className='text-2xl font-bold text-gray-900'
            >
              📸 InstaByu
            </motion.div>
          </Link>

          {/* Navigation Menu */}
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='/'
              className='text-gray-700 hover:text-gray-900 transition-colors'
            >
              Home
            </Link>
            <Link
              href='/explore'
              className='text-gray-700 hover:text-gray-900 transition-colors'
            >
              Explore
            </Link>
            <Link
              href='/profile'
              className='text-gray-700 hover:text-gray-900 transition-colors'
            >
              Profile
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className='flex items-center space-x-4'>
            <Link
              href='/login'
              className='text-gray-700 hover:text-gray-900 transition-colors'
            >
              Login
            </Link>
            <Link
              href='/register'
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
