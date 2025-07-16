'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserInitials,
  getAvatarBackgroundColor,
  hasValidAvatar,
} from '@/lib/userUtils';
import { postsAPI } from '@/lib/api';

/**
 * CreatePostModal Component - Modal untuk membuat post baru
 * Mirip dengan Instagram create post modal
 * Step 1: Upload gambar/video
 * Step 2: Preview dan input caption
 */
export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user: currentUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview & Caption
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Reset modal state saat ditutup
  const resetModal = () => {
    setStep(1);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    setIsSubmitting(false);
  };

  // Handle close modal
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Handle file selection
  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file) {
      // Validasi file type
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/mov',
      ];
      if (!validTypes.includes(file.type)) {
        alert('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau MP4.');
        return;
      }

      // Validasi file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 10MB.');
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Pindah ke step 2 (preview)
      setStep(2);
    }
  };

  // Handle drag and drop
  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Simulate file input change
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  };

  // Handle back to upload step
  const handleBack = () => {
    setStep(1);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
  };

  // Handle submit post
  const handleSubmit = async () => {
    if (!selectedFile || !currentUser) return;

    try {
      setIsSubmitting(true);

      // Create FormData untuk upload
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', caption.trim());

      // Call API untuk create post
      const response = await postsAPI.create(formData);

      if (response.success) {
        // Notify parent component bahwa post baru telah dibuat
        if (onPostCreated) {
          onPostCreated(response.data);
        }

        // Close modal dan reset
        handleClose();

        // Show success message (optional)
        // toast.success('Post berhasil dibuat!');
      } else {
        throw new Error(response.message || 'Gagal membuat post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Gagal membuat post. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URL saat component unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden'
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            {step === 2 && (
              <button
                onClick={handleBack}
                className='text-gray-600 hover:text-gray-800'
              >
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
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
            )}

            <h2 className='text-lg font-semibold flex-1 text-center'>
              {step === 1 ? 'Create new post' : 'Create new post'}
            </h2>

            {step === 2 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='text-blue-500 hover:text-blue-600 font-semibold disabled:opacity-50'
              >
                {isSubmitting ? 'Sharing...' : 'Share'}
              </button>
            )}

            <button
              onClick={handleClose}
              className='text-gray-600 hover:text-gray-800 ml-4'
            >
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className='flex h-[600px]'>
            {step === 1 ? (
              // Step 1: Upload File
              <div className='flex-1 flex flex-col items-center justify-center p-8'>
                <div
                  className='w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors'
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Upload Icon */}
                  <div className='mb-4'>
                    <svg
                      className='w-16 h-16 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>

                  <h3 className='text-xl font-light mb-2'>Drag photos here</h3>

                  <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
                    Select from computer
                  </button>

                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*,video/*'
                    onChange={handleFileSelect}
                    className='hidden'
                  />
                </div>
              </div>
            ) : (
              // Step 2: Preview & Caption
              <>
                {/* Left Side - Image Preview */}
                <div className='flex-1 bg-black flex items-center justify-center'>
                  {selectedFile?.type.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt='Preview'
                      className='max-w-full max-h-full object-contain'
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className='max-w-full max-h-full object-contain'
                    />
                  )}
                </div>

                {/* Right Side - Caption & Details */}
                <div className='w-80 border-l border-gray-200 flex flex-col'>
                  {/* User Info */}
                  <div className='p-4 border-b border-gray-200'>
                    <div className='flex items-center space-x-3'>
                      <Avatar className='w-8 h-8'>
                        {hasValidAvatar(currentUser?.avatar) ? (
                          <AvatarImage
                            src={currentUser?.avatar}
                            alt={currentUser?.name}
                          />
                        ) : null}
                        <AvatarFallback className='text-xs text-white bg-gradient-to-br from-purple-600 to-blue-800'>
                          {getUserInitials(currentUser?.name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <span className='font-semibold text-sm'>
                        {currentUser?.username || currentUser?.name}
                      </span>
                    </div>
                  </div>

                  {/* Caption Input */}
                  <div className='flex-1 p-4'>
                    <textarea
                      value={caption}
                      onChange={e => setCaption(e.target.value)}
                      placeholder='Write a caption...'
                      className='w-full h-32 resize-none border-none outline-none text-sm placeholder-gray-500'
                      maxLength={2200}
                    />
                    <div className='text-xs text-gray-400 text-right mt-2'>
                      {caption.length}/2,200
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
