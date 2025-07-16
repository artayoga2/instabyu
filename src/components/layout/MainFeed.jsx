'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { postsAPI } from '@/lib/api';
import { getUserInitials } from '@/lib/userUtils';
import { useAuth } from '@/contexts/AuthContext';
import CommentsModal from '@/components/common/CommentsModal';

/**
 * MainFeed Component - Feed utama untuk menampilkan post-post
 * Mirip dengan feed Instagram, menggunakan data dari Laravel API
 * Dilengkapi dengan infinite scroll untuk memuat data selanjutnya
 */
export default function MainFeed() {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postStates, setPostStates] = useState({});

  // State untuk modal comments
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Ref untuk intersection observer
  const observerRef = useRef();
  const loadingTimeoutRef = useRef();

  // Ref untuk menyimpan state terbaru (menghindari stale closure)
  const currentPageRef = useRef(currentPage);
  const loadingMoreRef = useRef(loadingMore);
  const hasMorePagesRef = useRef(hasMorePages);

  // Update refs setiap kali state berubah
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    hasMorePagesRef.current = hasMorePages;
  }, [hasMorePages]);

  // Fungsi untuk memuat posts selanjutnya (infinite scroll)
  const loadMorePosts = useCallback(async () => {
    // Cek kondisi awal menggunakan ref values
    if (loadingMoreRef.current || !hasMorePagesRef.current) {
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = currentPageRef.current + 1;

      const response = await postsAPI.getAll(nextPage, 2);

      if (response.success && response.data && response.data.length > 0) {
        // Deduplication: filter posts yang sudah ada
        setPosts(prevPosts => {
          const existingIds = new Set(prevPosts.map(post => post.id));
          const newPosts = response.data.filter(
            post => !existingIds.has(post.id)
          );

          return [...prevPosts, ...newPosts];
        });

        // Update pagination info
        if (response.meta) {
          setCurrentPage(response.meta.current_page);
          setHasMorePages(response.meta.current_page < response.meta.last_page);
        }

        // Initialize post states untuk posts baru (hanya yang belum ada)
        setPostStates(prevStates => {
          const existingStateIds = new Set(
            Object.keys(prevStates).map(id => parseInt(id))
          );
          const newPostsForStates = response.data.filter(
            post => !existingStateIds.has(post.id)
          );

          if (newPostsForStates.length > 0) {
            initializePostStates(newPostsForStates);
          }

          return prevStates; // Return unchanged untuk sementara, akan diupdate di initializePostStates
        });
      } else {
        // Tidak ada data lagi
        setHasMorePages(false);
      }
    } catch (error) {
      console.error('❌ Error loading more posts:', error);
      // Jika error, biarkan hasMorePages tetap true untuk retry
    } finally {
      setLoadingMore(false);
    }
  }, []); // Kosongkan dependency array

  const lastPostElementRef = useCallback(
    node => {
      if (loadingMoreRef.current) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        entries => {
          if (
            entries[0].isIntersecting &&
            hasMorePagesRef.current &&
            !loadingMoreRef.current
          ) {
            // Debounce untuk mencegah multiple calls
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
            }

            loadingTimeoutRef.current = setTimeout(() => {
              loadMorePosts();
            }, 300); // 300ms debounce
          }
        },
        {
          threshold: 0.1, // Trigger ketika 10% dari elemen terlihat
          rootMargin: '50px', // Kurangi rootMargin untuk trigger yang lebih presisi
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [loadMorePosts] // Hanya dependency loadMorePosts
  );

  // Fetch posts dari API (halaman pertama)
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getAll(1, 2);

        if (response.success && response.data) {
          setPosts(response.data);

          // Set pagination info dari meta
          if (response.meta) {
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
            setHasMorePages(
              response.meta.current_page < response.meta.last_page
            );
          }

          // Initialize post states untuk like status
          await initializePostStates(response.data);
        }
      } catch (error) {
        console.error('❌ Error fetching initial posts:', error);
        // Fallback ke data dummy jika API gagal
        handleFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Fungsi untuk initialize post states (like status)
  const initializePostStates = async postsData => {
    const newStates = {};

    for (const post of postsData) {
      try {
        // Ambil status like untuk setiap post
        const likeStatus = await postsAPI.getLikeStatus(post.id);
        newStates[post.id] = {
          isLiked: likeStatus.data?.is_liked || post.is_liked_by_user || false,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
        };
      } catch (error) {
        console.error(`Error fetching like status for post ${post.id}:`, error);
        newStates[post.id] = {
          isLiked: post.is_liked_by_user || false,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
        };
      }
    }

    // Merge dengan state yang sudah ada
    setPostStates(prevStates => ({ ...prevStates, ...newStates }));
  };

  // Fungsi fallback jika API gagal
  const handleFallbackData = () => {
    const dummyPosts = [
      {
        id: 1,
        user: {
          name: 'Alice Johnson',
          username: 'alice_j',
          avatar: null,
        },
        image: 'https://picsum.photos/600/600?random=10',
        caption: 'Beautiful day at the park! 🌞 #nature #photography',
        likes_count: 234,
        comments_count: 12,
        created_at: '2 hours ago',
      },
      {
        id: 2,
        user: {
          name: 'Bob Smith',
          username: 'bobsmith',
          avatar: null,
        },
        image: 'https://picsum.photos/600/600?random=11',
        caption: 'Amazing sunset from my balcony 🌅',
        likes_count: 156,
        comments_count: 8,
        created_at: '4 hours ago',
      },
    ];

    setPosts(dummyPosts);
    const initialStates = dummyPosts.reduce(
      (acc, post) => ({
        ...acc,
        [post.id]: {
          isLiked: false,
          likes: post.likes_count,
          comments: post.comments_count,
        },
      }),
      {}
    );
    setPostStates(initialStates);
    setHasMorePages(false); // Tidak ada halaman selanjutnya untuk dummy data
  };

  // Handle like/unlike post
  const handleLike = async postId => {
    if (!currentUser) {
      // Redirect ke login jika belum login
      window.location.href = '/login';
      return;
    }

    try {
      // Optimistic update
      setPostStates(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          isLiked: !prev[postId].isLiked,
          likes: prev[postId].isLiked
            ? prev[postId].likes - 1
            : prev[postId].likes + 1,
        },
      }));

      // API call untuk toggle like
      const response = await postsAPI.toggleLike(postId);

      if (response.success) {
        // Update dengan data dari server
        setPostStates(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isLiked: response.data.is_liked,
            likes: response.data.likes_count,
          },
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update jika gagal
      setPostStates(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          isLiked: !prev[postId].isLiked,
          likes: prev[postId].isLiked
            ? prev[postId].likes + 1
            : prev[postId].likes - 1,
        },
      }));
    }
  };

  // Handle update post stats dari modal (real-time update)
  const handleUpdatePostStats = useCallback((postId, updates) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        ...updates,
      },
    }));
  }, []);

  // Handle like update dari modal
  const handleLikeUpdate = useCallback((postId, isLiked, likeCount) => {
    handleUpdatePostStats(postId, {
      isLiked,
      likes: likeCount,
    });
  }, [handleUpdatePostStats]);

  // Handle comment update dari modal
  const handleCommentUpdate = useCallback((postId, commentCount) => {
    handleUpdatePostStats(postId, {
      comments: commentCount,
    });
  }, [handleUpdatePostStats]);

  // Handle view comments
  const handleViewComments = postId => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsCommentsModalOpen(true);
    }
  };

  // Format waktu
  const formatTimeAgo = dateString => {
    // Jika sudah dalam format "X hours ago", return as is
    if (typeof dateString === 'string' && dateString.includes('ago')) {
      return dateString;
    }

    // TODO: Implement proper time formatting dari timestamp
    return dateString || 'Just now';
  };

  if (loading) {
    return (
      <div className='max-w-full lg:max-w-lg mx-auto space-y-4 lg:space-y-6 px-4 lg:px-0'>
        {/* Loading skeleton */}
        {[...Array(3)].map((_, index) => (
          <Card key={index} className='overflow-hidden'>
            <CardContent className='p-0'>
              <div className='flex items-center space-x-3 p-3 lg:p-4'>
                <div className='w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full animate-pulse'></div>
                <div className='space-y-1'>
                  <div className='w-20 h-3 bg-gray-200 rounded animate-pulse'></div>
                  <div className='w-16 h-2 bg-gray-200 rounded animate-pulse'></div>
                </div>
              </div>
              <div className='w-full aspect-square bg-gray-200 animate-pulse'></div>
              <div className='p-3 lg:p-4 space-y-2'>
                <div className='w-16 h-3 bg-gray-200 rounded animate-pulse'></div>
                <div className='w-full h-3 bg-gray-200 rounded animate-pulse'></div>
                <div className='w-3/4 h-3 bg-gray-200 rounded animate-pulse'></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='max-w-full lg:max-w-lg mx-auto space-y-4 lg:space-y-6 px-4 lg:px-0'>
      {posts.map((post, index) => {
        // Tambahkan ref pada post terakhir untuk infinite scroll
        const isLastPost = index === posts.length - 1;

        return (
          <motion.div
            key={post.id}
            ref={isLastPost ? lastPostElementRef : null}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className='overflow-hidden'>
              <CardContent className='p-0'>
                {/* Post Header */}
                <div className='flex items-center justify-between p-3 lg:p-4'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='w-8 h-8 lg:w-10 lg:h-10'>
                      <AvatarImage
                        src={post.user?.avatar}
                        alt={post.user?.name}
                      />
                      <AvatarFallback className='text-xs lg:text-sm font-medium text-white bg-gradient-to-br from-purple-600 to-blue-800'>
                        {getUserInitials(post.user?.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-semibold text-sm'>
                        {post.user?.username || post.user?.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatTimeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* More options */}
                  <button className='text-gray-400 hover:text-gray-600'>
                    <svg
                      className='w-4 h-4 lg:w-5 lg:h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                    </svg>
                  </button>
                </div>

                {/* Post Image */}
                <div className='relative'>
                  <img
                    src={post.image || post.image_url}
                    alt='Post'
                    className='w-full aspect-square object-cover'
                  />
                </div>

                {/* Post Actions */}
                <div className='p-3 lg:p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center space-x-3 lg:space-x-4'>
                      {/* Like Button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                        className={`${
                          postStates[post.id]?.isLiked
                            ? 'text-red-500'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <svg
                          className='w-5 h-5 lg:w-6 lg:h-6'
                          fill={
                            postStates[post.id]?.isLiked
                              ? 'currentColor'
                              : 'none'
                          }
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
                      </motion.button>

                      {/* Comment Button */}
                      <button
                        onClick={() => handleViewComments(post.id)}
                        className='text-gray-700 hover:text-gray-900'
                      >
                        <svg
                          className='w-5 h-5 lg:w-6 lg:h-6'
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
                      </button>

                      {/* Share Button */}
                      <button className='text-gray-700 hover:text-gray-900'>
                        <svg
                          className='w-5 h-5 lg:w-6 lg:h-6'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Save Button */}
                    <button className='text-gray-700 hover:text-gray-900'>
                      <svg
                        className='w-5 h-5 lg:w-6 lg:h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Likes Count */}
                  <p className='font-semibold text-sm mb-2'>
                    {(postStates[post.id]?.likes || 0).toLocaleString()} likes
                  </p>

                  {/* Caption */}
                  <div className='text-sm'>
                    <span className='font-semibold mr-2'>
                      {post.user?.username || post.user?.name}
                    </span>
                    <span>{post.caption || post.content}</span>
                  </div>

                  {/* Comments */}
                  {(postStates[post.id]?.comments || 0) > 0 && (
                    <button
                      onClick={() => handleViewComments(post.id)}
                      className='text-sm text-gray-500 mt-2 hover:text-gray-700'
                    >
                      View all {postStates[post.id]?.comments} comments
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className='flex justify-center py-4'>
          <div className='flex items-center space-x-2 text-gray-500'>
            <div className='w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
            <span className='text-sm'>Memuat posts selanjutnya...</span>
          </div>
        </div>
      )}

      {/* End of Posts Indicator */}
      {!hasMorePages && posts.length > 0 && (
        <div className='flex justify-center py-6'>
          <div className='text-center text-gray-500'>
            <div className='w-8 h-8 mx-auto mb-2 opacity-50'>
              <svg fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <p className='text-sm font-medium'>
              Anda sudah melihat semua posts
            </p>
            <p className='text-xs mt-1'>Total: {posts.length} posts</p>
          </div>
        </div>
      )}

      {/* Mobile Bottom Spacing */}
      <div className='h-20 lg:h-0'></div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => {
          setIsCommentsModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onLikeUpdate={handleLikeUpdate}
        onCommentUpdate={handleCommentUpdate}
      />
    </div>
  );
}
