'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostModal from '@/components/common/CreatePostModal';
import {
  getUserInitials,
  getAvatarBackgroundColor,
  formatUsername,
  formatUserName,
  hasValidAvatar,
} from '@/lib/userUtils';

/**
 * Sidebar Component - Menu navigasi utama Instagram-style
 * Menampilkan menu Home, Search, Create, Profile
 */
export default function Sidebar({ onPostCreated }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fallback data jika user belum tersedia
  const userData = user || {
    name: 'User',
    username: 'user',
    avatar: null,
  };

  // Computed values untuk user display
  const userDisplayName = formatUserName(userData.name);
  const userInitials = getUserInitials(userData.name);
  const avatarBgColor = getAvatarBackgroundColor(userData.name);
  const formattedUsername = formatUsername(userData.username);

  // Handle create post
  const handleCreatePost = () => {
    setIsCreateModalOpen(true);
  };

  // Handle post created callback
  const handlePostCreated = newPost => {
    setIsCreateModalOpen(false);
    if (onPostCreated) {
      onPostCreated(newPost);
    }
  };

  // Handle logout function - dipindahkan ke atas sebelum menuItems
  const handleLogout = async () => {
    try {
      // Hit API logout endpoint
      await logout();
      // Redirect ke halaman login setelah logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Tetap logout meskipun API gagal
      logout();
      window.location.href = '/login';
    }
  };

  // Menu items untuk sidebar
  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          />
        </svg>
      ),
    },
    {
      name: 'Create',
      href: null, // Tidak ada href karena ini adalah action button
      isAction: true, // Flag untuk menandai ini adalah action button
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 4v16m8-8H4'
          />
        </svg>
      ),
      onClick: handleCreatePost,
    },
    {
      name: 'Keluar',
      href: null, // Tidak ada href karena ini adalah action button
      isAction: true, // Flag untuk menandai ini adalah action button
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
          />
        </svg>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 hidden lg:block'
    >
      <div className='flex flex-col h-full'>
        {/* Logo */}
        <div className='p-4 lg:p-6'>
          <Link href='/' className='flex items-center space-x-2'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center space-x-2 pt-4'
            >
              {/* Logo SVG - sama dengan halaman login */}
              <div className='w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-600 to-blue-800 rounded-full flex items-center justify-center shadow-inner'>
                <svg
                  className='w-4 h-4 lg:w-5 lg:h-5 text-white'
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
              <span className='text-lg lg:text-2xl font-bold text-purple-600'>
                InstaByu
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className='flex-1 px-3 lg:px-4 py-4 lg:py-6'>
          <ul className='space-y-1 lg:space-y-2'>
            {menuItems.map(item => {
              const isActive = pathname === item.href;
              const isLogout = item.name === 'Keluar';

              return (
                <li key={item.name}>
                  {item.isAction ? (
                    // Action button (seperti logout)
                    <motion.button
                      onClick={item.onClick}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                        isLogout
                          ? 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${item.name === 'Create' ? 'create-post-button' : ''}`}
                    >
                      {item.icon}
                      <span className='text-sm lg:text-base'>{item.name}</span>
                    </motion.button>
                  ) : (
                    // Regular link
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-purple-100 text-purple-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.icon}
                        <span className='text-sm lg:text-base'>
                          {item.name}
                        </span>
                      </motion.div>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className='p-3 lg:p-4 border-t border-gray-200'>
          <div className='flex items-center space-x-2 lg:space-x-3'>
            <Avatar className='w-8 h-8 lg:w-10 lg:h-10'>
              {hasValidAvatar(userData.avatar) ? (
                <AvatarImage src={userData.avatar} alt={userDisplayName} />
              ) : null}
              <AvatarFallback className='text-xs text-white bg-gradient-to-br from-purple-600 to-blue-800'>
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <p className='text-xs lg:text-sm font-medium text-gray-900 truncate'>
                {userDisplayName}
              </p>
              <p className='text-xs lg:text-sm text-gray-500 truncate'>
                {formattedUsername}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </motion.aside>
  );
}
