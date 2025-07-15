'use client'; // Client Component untuk form handling

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiPost } from '@/lib/api';

/**
 * Register Page - Halaman registrasi untuk user baru
 * Menggunakan form handling dan validasi
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    // Validasi password confirmation
    if (formData.password !== formData.password_confirmation) {
      setError('Password dan konfirmasi password tidak sama');
      setIsLoading(false);
      return;
    }

    try {
      // Contoh API call ke Laravel backend
      const response = await apiPost('/auth/register', formData);

      setSuccess(true);
      // Redirect ke login page setelah berhasil
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
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
            Daftar ke InstaByu
          </motion.h2>
          <p className='mt-2 text-gray-600'>
            Sudah punya akun?{' '}
            <Link href='/login' className='text-blue-600 hover:text-blue-500'>
              Masuk di sini
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
          {/* Success Message */}
          {success && (
            <div className='bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg'>
              Registrasi berhasil! Anda akan diarahkan ke halaman login...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg'>
              {error}
            </div>
          )}

          <div className='space-y-4'>
            {/* Name Input */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Nama Lengkap
              </label>
              <input
                id='name'
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Masukkan nama lengkap Anda'
              />
            </div>

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
                placeholder='Minimal 8 karakter'
              />
            </div>

            {/* Password Confirmation Input */}
            <div>
              <label
                htmlFor='password_confirmation'
                className='block text-sm font-medium text-gray-700'
              >
                Konfirmasi Password
              </label>
              <input
                id='password_confirmation'
                name='password_confirmation'
                type='password'
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Ulangi password Anda'
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isLoading || success}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>

          {/* Terms */}
          <p className='text-xs text-gray-500 text-center'>
            Dengan mendaftar, Anda menyetujui{' '}
            <Link href='/terms' className='text-blue-600 hover:text-blue-500'>
              Syarat & Ketentuan
            </Link>{' '}
            dan{' '}
            <Link href='/privacy' className='text-blue-600 hover:text-blue-500'>
              Kebijakan Privasi
            </Link>{' '}
            kami.
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
