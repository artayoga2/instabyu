'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

/**
 * PopularPosts Component - Menampilkan 5 post populer
 * Berisi thumbnail, judul singkat, dan jumlah like/komentar
 */
export default function PopularPosts() {
  // Data dummy untuk popular posts
  const [popularPosts] = useState([
    {
      id: 1,
      thumbnail: 'https://picsum.photos/300/200?random=1',
      title: 'Beautiful sunset at the beach',
      excerpt: 'Amazing view from Bali beach...',
      likes: 1234,
      comments: 89,
    },
    {
      id: 2,
      thumbnail: 'https://picsum.photos/300/200?random=2',
      title: 'Mountain hiking adventure',
      excerpt: 'Incredible journey to the top...',
      likes: 987,
      comments: 56,
    },
    {
      id: 3,
      thumbnail: 'https://picsum.photos/300/200?random=3',
      title: 'City lights at night',
      excerpt: 'Urban photography session...',
      likes: 756,
      comments: 34,
    },
    {
      id: 4,
      thumbnail: 'https://picsum.photos/300/200?random=4',
      title: 'Delicious food photography',
      excerpt: 'Traditional Indonesian cuisine...',
      likes: 543,
      comments: 67,
    },
  ]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full bg-transparent'
    >
      {/* Header */}
      <div className='px-4 py-8'>
        <h2 className='text-lg font-semibold text-gray-900'>Popular Posts</h2>
        <p className='text-sm text-gray-500'>Trending content today</p>
      </div>

      {/* Popular Posts List */}
      <div className='p-4 space-y-4'>
        {popularPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className='cursor-pointer'
          >
            <Card className='overflow-hidden hover:shadow-md transition-shadow'>
              <CardContent className='p-0'>
                <div className='flex space-x-3 p-3'>
                  {/* Thumbnail */}
                  <div className='flex-shrink-0'>
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className='w-16 h-16 object-cover rounded-lg'
                    />
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    {/* Title */}
                    <h3 className='text-sm font-medium text-gray-900 line-clamp-2 mb-1'>
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className='text-xs text-gray-500 line-clamp-1 mb-2'>
                      {post.excerpt}
                    </p>

                    {/* Stats */}
                    <div className='flex items-center space-x-4 text-xs text-gray-400'>
                      {/* Likes */}
                      <div className='flex items-center space-x-1'>
                        <svg
                          className='w-3 h-3'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>{post.likes.toLocaleString()}</span>
                      </div>

                      {/* Comments */}
                      <div className='flex items-center space-x-1'>
                        <svg
                          className='w-3 h-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                          />
                        </svg>
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* See All Button */}
      <div className='p-4 border-t border-gray-200'>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='w-full text-sm text-purple-600 hover:text-purple-700 font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors'
        >
          See All Popular Posts
        </motion.button>
      </div>
    </motion.div>
  );
}
