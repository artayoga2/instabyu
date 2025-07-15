'use client'; // Client Component untuk form handling

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiPost } from '@/lib/api';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
} from '@/lib/validation';
import {
  showSuccessToast,
  showErrorToast,
  showApiErrorToast,
} from '@/lib/toast';
import { useForm } from '@/hooks/useForm';
import { createValidationSchema, createInitialValues } from '@/lib/formUtils';

/**
 * Register Page - Halaman registrasi untuk user baru
 * Menggunakan form handling dan validasi dengan tema ungu-biru tua
 */
export default function RegisterPage() {
  const router = useRouter();

  // State untuk mouse position (untuk background interaktif)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMounted, setIsMounted] = useState(false);

  // State untuk show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

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
  const initialValues = createInitialValues([
    'name',
    'username',
    'email',
    'password',
    'password_confirmation',
  ]);

  const validationSchema = createValidationSchema({
    name: value => validateRequired(value, 'Nama lengkap'),
    username: value => validateUsername(value, { minLength: 3, maxLength: 20 }),
    email: value => validateEmail(value),
    password: value =>
      validatePassword(value, { minLength: 8, requireUppercase: true }),
    password_confirmation: (value, formData) =>
      validatePasswordConfirmation(value, formData?.password),
  });

  const handleFormSubmit = async formData => {
    try {
      // Contoh API call ke Laravel backend
      const response = await apiPost('/auth/register', formData);

      showSuccessToast(
        'Registrasi berhasil! Anda akan diarahkan ke halaman login...'
      );

      // Redirect ke login page setelah berhasil menggunakan router
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Register error:', error);
      showApiErrorToast(error, 'Registrasi gagal. Silakan coba lagi.');
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
      <div className='relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='max-w-md w-full space-y-8'
        >
          {/* Logo Image - Sama seperti di halaman login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className='text-center'
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
          </motion.div>

          {/* Form Container dengan glassmorphism */}
          <div className='bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='text-3xl font-bold text-gray-900'
              >
                Daftar ke{' '}
                <span className='text-purple-600 text-4xl'>InstaByu</span>
              </motion.h2>
              <p className='mt-2 text-gray-600'>
                Sudah punya akun?{' '}
                <Link
                  href='/login'
                  className='text-purple-600 hover:text-purple-500 font-medium'
                >
                  Masuk di sini
                </Link>
              </p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='space-y-6'
              onSubmit={handleSubmit}
            >
              <div className='space-y-4'>
                {/* Name Input */}
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                      hasFieldError('name')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder='Masukkan nama lengkap Anda'
                  />
                  {hasFieldError('name') && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm mt-1'
                    >
                      {getFieldError('name')}
                    </motion.p>
                  )}
                </div>

                {/* Username Input */}
                <div>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Username
                  </label>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                      hasFieldError('username')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder='Masukkan username unik Anda (3-20 karakter)'
                  />
                  {hasFieldError('username') && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm mt-1'
                    >
                      {getFieldError('username')}
                    </motion.p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Email
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                      hasFieldError('email')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder='Masukkan email Anda'
                  />
                  {hasFieldError('email') && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm mt-1'
                    >
                      {getFieldError('email')}
                    </motion.p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                        hasFieldError('password')
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder='Minimal 8 karakter, harus ada huruf besar'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
                    >
                      {showPassword ? (
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                          />
                        </svg>
                      ) : (
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {hasFieldError('password') && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm mt-1'
                    >
                      {getFieldError('password')}
                    </motion.p>
                  )}
                </div>

                {/* Password Confirmation Input */}
                <div>
                  <label
                    htmlFor='password_confirmation'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Konfirmasi Password
                  </label>
                  <div className='relative'>
                    <input
                      id='password_confirmation'
                      name='password_confirmation'
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                        hasFieldError('password_confirmation')
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder='Ulangi password Anda'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowPasswordConfirmation(!showPasswordConfirmation)
                      }
                      className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
                    >
                      {showPasswordConfirmation ? (
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                          />
                        </svg>
                      ) : (
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {hasFieldError('password_confirmation') && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm mt-1'
                    >
                      {getFieldError('password_confirmation')}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Submit Button dengan cursor pointer */}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-purple-600 to-blue-800 hover:from-purple-700 hover:to-blue-900 text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>

              {/* Terms */}
              <p className='text-xs text-gray-500 text-center'>
                Dengan mendaftar, Anda menyetujui{' '}
                <Link
                  href='/terms'
                  className='text-purple-600 hover:text-purple-500'
                >
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link
                  href='/privacy'
                  className='text-purple-600 hover:text-purple-500'
                >
                  Kebijakan Privasi
                </Link>{' '}
                kami.
              </p>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
