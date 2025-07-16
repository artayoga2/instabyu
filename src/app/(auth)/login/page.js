'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiPostWithCsrf } from '@/lib/api';
import { validateEmailOrUsername, validatePassword } from '@/lib/validation';
import {
  showSuccessToast,
  showErrorToast,
  showApiErrorToast,
} from '@/lib/toast';
import { useForm } from '@/hooks/useForm';
import { createValidationSchema, createInitialValues } from '@/lib/formUtils';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Destructure login function dari AuthContext

  // State untuk mouse position (untuk background interaktif)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMounted, setIsMounted] = useState(false);

  // Effect untuk mounting dan tracking mouse movement
  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = e => {
      if (typeof window !== 'undefined') {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Setup form dengan custom hook
  const initialValues = createInitialValues(['emailOrUsername', 'password']);

  const validationSchema = createValidationSchema({
    emailOrUsername: value => validateEmailOrUsername(value),
    password: value => validatePassword(value),
  });

  const handleFormSubmit = async formData => {
    try {
      // Gunakan AuthContext untuk login
      const result = await login({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });

      if (result.success) {
        showSuccessToast(result.message || 'Login berhasil!');

        // Redirect ke halaman utama setelah 1 detik
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        showErrorToast(result.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      showErrorToast('Terjadi kesalahan saat login');
    }
  };

  const {
    formData,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    hasFieldError,
  } = useForm(initialValues, validationSchema, handleFormSubmit);

  // Render loading state untuk menghindari hydration mismatch
  if (!isMounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-900 flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background Gradient Interaktif - Smaller & Optimized */}
      <motion.div
        className='absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-900'
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(147, 51, 234, 0.6) 0%,
            rgba(124, 58, 237, 0.4) 20%,
            rgba(99, 102, 241, 0.3) 40%,
            rgba(30, 58, 138, 0.2) 60%,
            rgba(15, 23, 42, 0.1) 80%)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Background Blur Overlay */}
      <div className='absolute inset-0 backdrop-blur-sm bg-black/10' />

      {/* Main Container - Responsive Optimized */}
      <div className='relative z-10 min-h-screen flex flex-col lg:flex-row'>
        {/* Left Section - Branding & Features - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-8 lg:py-0'
        >
          {/* Welcome Section - Logo & Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className='mb-8 text-center'
          >
            {/* Logo Image */}
            <motion.div
              className='w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
              <div className='w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-800 rounded-full flex items-center justify-center shadow-inner'>
                {/* Menggunakan SVG sebagai logo */}
                <svg
                  className='w-8 h-8 text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill='none'
                  />
                </svg>
              </div>
            </motion.div>

            {/* Welcome Text - Hidden on Mobile */}
            <motion.h2
              className='text-2xl font-bold text-slate-800 hidden lg:block'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Selamat Datang di{' '}
              <span className='text-purple-600 text-4xl'>InstaByu</span>
            </motion.h2>
            <motion.p
              className='text-slate-600 hidden lg:block'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Aplikasi demo
            </motion.p>
          </motion.div>

          {/* Features List - Hidden on Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            className='flex-wrap gap-2 justify-center text-center hidden lg:flex'
          >
            {/* Feature 1 - Register & Login */}
            <motion.div
              className='flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm rounded-md px-2 py-1.5'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className='w-6 h-6 bg-purple-100 rounded-sm flex items-center justify-center'>
                <svg
                  className='w-3 h-3 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <h3 className='font-medium text-xs text-slate-800'>
                Register & Login
              </h3>
            </motion.div>

            {/* Feature 2 - Posting */}
            <motion.div
              className='flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm rounded-md px-2 py-1.5'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className='w-6 h-6 bg-blue-100 rounded-sm flex items-center justify-center'>
                <svg
                  className='w-3 h-3 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h3 className='font-medium text-xs text-slate-800'>
                Posting Text & Gambar
              </h3>
            </motion.div>

            {/* Feature 3 - Like & Comment */}
            <motion.div
              className='flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm rounded-md px-2 py-1.5'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className='w-6 h-6 bg-red-100 rounded-sm flex items-center justify-center'>
                <svg
                  className='w-3 h-3 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </div>
              <h3 className='font-medium text-xs text-slate-800'>
                Like & Komentar
              </h3>
            </motion.div>

            {/* Feature 4 - Authentication */}
            <motion.div
              className='flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm rounded-md px-2 py-1.5'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div className='w-6 h-6 bg-green-100 rounded-sm flex items-center justify-center'>
                <svg
                  className='w-3 h-3 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                  />
                </svg>
              </div>
              <h3 className='font-medium text-xs text-slate-800'>
                Autentifikasi Pengguna
              </h3>
            </motion.div>

            {/* Feature 5 - Access Control */}
            <motion.div
              className='flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm rounded-md px-2 py-1.5'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <div className='w-6 h-6 bg-indigo-100 rounded-sm flex items-center justify-center'>
                <svg
                  className='w-3 h-3 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
              <h3 className='font-medium text-xs text-slate-800'>
                Hak Akses Post
              </h3>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Section - Login Form - Responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8'
        >
          <div className='w-full max-w-md'>
            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className='bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8'
            >
              {/* Header */}
              <motion.div
                className='text-center mb-8'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                  Masuk ke Akun
                </h2>
                <p className='text-gray-600'>
                  Belum punya akun?{' '}
                  <Link
                    href='/register'
                    className='text-purple-600 hover:text-purple-500 font-medium'
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </motion.div>

              {/* Login Form */}
              <motion.form
                onSubmit={handleSubmit}
                className='space-y-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {/* Email atau Username Input */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label
                    htmlFor='emailOrUsername'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Email atau Username
                  </label>
                  <input
                    id='emailOrUsername'
                    name='emailOrUsername'
                    type='text'
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                      hasFieldError('emailOrUsername')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder='Masukkan email atau username Anda'
                  />
                  {hasFieldError('emailOrUsername') && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm mt-1'
                    >
                      {getFieldError('emailOrUsername')}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Password
                  </label>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                      hasFieldError('password')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder='Masukkan password Anda'
                  />
                  {hasFieldError('password') && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm mt-1'
                    >
                      {getFieldError('password')}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-4 text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] mt-4 cursor-pointer'
                  >
                    {isLoading ? (
                      <div className='flex items-center justify-center'>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                        Memproses...
                      </div>
                    ) : (
                      'Masuk'
                    )}
                  </button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
