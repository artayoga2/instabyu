'use client'; // Client Component untuk animasi

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Home Page - Landing page untuk InstaByu
 * Menggunakan Framer Motion untuk animasi yang smooth
 */
export default function HomePage() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 text-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          <div className='text-center'>
            {/* Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='text-5xl md:text-6xl font-bold mb-6'
            >
              Selamat Datang di{' '}
              <span className='text-yellow-300'>InstaByu</span>
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-xl md:text-2xl mb-8 text-blue-100'
            >
              Bagikan momen terbaik Anda dengan dunia
            </motion.p>

            {/* Animated Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='space-x-4'
            >
              <Link href='/register'>
                <Button
                  size='lg'
                  className='bg-yellow-500 hover:bg-yellow-600 text-black font-semibold'
                >
                  Mulai Sekarang
                </Button>
              </Link>
              <Link href='/login'>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-white text-white hover:bg-white hover:text-blue-600'
                >
                  Masuk
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Fitur Unggulan
            </h2>
            <p className='text-xl text-gray-600'>
              Nikmati pengalaman berbagi yang tak terlupakan
            </p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow'
            >
              <div className='text-4xl mb-4'>📸</div>
              <h3 className='text-xl font-semibold mb-2'>Foto Berkualitas</h3>
              <p className='text-gray-600'>
                Upload dan bagikan foto dengan kualitas terbaik
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow'
            >
              <div className='text-4xl mb-4'>❤️</div>
              <h3 className='text-xl font-semibold mb-2'>Interaksi Sosial</h3>
              <p className='text-gray-600'>
                Like, komentar, dan terhubung dengan teman
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow'
            >
              <div className='text-4xl mb-4'>🌟</div>
              <h3 className='text-xl font-semibold mb-2'>Explore</h3>
              <p className='text-gray-600'>
                Temukan konten menarik dari seluruh dunia
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
