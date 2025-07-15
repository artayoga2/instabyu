'use client'; // Client Component untuk form handling

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiPost } from '@/lib/api';

/**
 * Login Page - Halaman login untuk user
 * Menggunakan form handling dan API integration
 */
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Contoh API call ke Laravel backend
      const response = await apiPost('/auth/login', formData);

      // Simpan token ke localStorage
      localStorage.setItem('auth_token', response.token);

      // Redirect ke dashboard atau home
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-md w-full space-y-8'
      >
        {/* Header */}
        <div className='text-center'>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-3xl font-bold text-gray-900'
          >
            Masuk ke InstaByu
          </motion.h2>
          <p className='mt-2 text-gray-600'>
            Atau{' '}
            <Link
              href='/register'
              className='text-blue-600 hover:text-blue-500'
            >
              buat akun baru
            </Link>
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}
        >
          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg'>
              {error}
            </div>
          )}

          <div className='space-y-4'>
            {/* Email Input */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Masukkan email Anda'
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Masukkan password Anda'
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>

          {/* Forgot Password Link */}
          <div className='text-center'>
            <Link
              href='/forgot-password'
              className='text-sm text-blue-600 hover:text-blue-500'
            >
              Lupa password?
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
