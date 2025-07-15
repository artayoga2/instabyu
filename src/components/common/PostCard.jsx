'use client'; // Client Component untuk animasi

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

/**
 * PostCard Component - Contoh komponen untuk menampilkan post
 * Menggunakan Tailwind CSS, shadcn/ui, dan Framer Motion
 */
export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 42);

  // Handle like button
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Animasi masuk dari bawah
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }} // Animasi hover naik sedikit
      className="bg-white rounded-lg shadow-md overflow-hidden max-w-md mx-auto"
    >
      {/* Header Post */}
      <div className="flex items-center p-4">
        <motion.div
          whileHover={{ scale: 1.1 }} // Animasi hover pada avatar
          className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {post?.user?.name?.charAt(0) || 'U'}
        </motion.div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">
            {post?.user?.name || 'User Demo'}
          </h3>
          <p className="text-sm text-gray-500">
            {post?.location || 'Jakarta, Indonesia'}
          </p>
        </div>
      </div>

      {/* Image Post */}
      <motion.div
        whileHover={{ scale: 1.02 }} // Animasi zoom sedikit saat hover
        transition={{ duration: 0.3 }}
        className="relative h-64 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center"
      >
        <span className="text-white text-6xl">📸</span>
        {/* Placeholder untuk gambar */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          Demo Image
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          {/* Like Button dengan animasi */}
          <motion.button
            whileTap={{ scale: 0.9 }} // Animasi saat diklik
            onClick={handleLike}
            className={`text-2xl transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            {isLiked ? '❤️' : '🤍'}
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-2xl text-gray-400 hover:text-blue-500 transition-colors"
          >
            💬
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-2xl text-gray-400 hover:text-green-500 transition-colors"
          >
            📤
          </motion.button>
        </div>

        {/* Like Count dengan animasi */}
        <motion.p
          key={likeCount} // Key untuk trigger animasi saat count berubah
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-semibold text-gray-900 mb-2"
        >
          {likeCount} suka
        </motion.p>

        {/* Caption */}
        <div className="text-gray-900">
          <span className="font-semibold mr-2">
            {post?.user?.name || 'user_demo'}
          </span>
          <span>
            {post?.caption ||
              'Momen indah yang tak terlupakan! 🌟 #InstaByu #Photography'}
          </span>
        </div>

        {/* Comments Preview */}
        <div className="mt-2 text-gray-500 text-sm">
          <p>Lihat semua 12 komentar</p>
          <p className="mt-1">
            <span className="font-semibold">teman_kamu</span> Keren banget! 🔥
          </p>
        </div>

        {/* Timestamp */}
        <p className="text-gray-400 text-xs mt-2 uppercase tracking-wide">
          {post?.created_at || '2 JAM YANG LALU'}
        </p>
      </div>
    </motion.div>
  );
}
