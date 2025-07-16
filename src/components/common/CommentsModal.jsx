'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { postsAPI } from '@/lib/api';
import {
  getUserInitials,
  hasValidAvatar,
  getAvatarBackgroundColor,
} from '@/lib/userUtils';
import { useAuth } from '@/contexts/AuthContext';

/**
 * CommentsModal Component - Modal untuk menampilkan comments seperti Instagram
 * Dilengkapi dengan infinite scroll untuk comments dan fitur add comment
 * @param {boolean} isOpen - Status modal terbuka/tertutup
 * @param {function} onClose - Callback untuk menutup modal
 * @param {object} post - Data post yang akan ditampilkan
 * @param {function} onLikeUpdate - Callback untuk update like count di MainFeed
 * @param {function} onCommentUpdate - Callback untuk update comment count di MainFeed
 */
function CommentsModal({
  isOpen,
  onClose,
  post,
  onLikeUpdate,
  onCommentUpdate,
}) {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // State untuk pagination comments
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // State untuk post details
  const [postDetails, setPostDetails] = useState(post);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Refs untuk infinite scroll
  const commentsContainerRef = useRef();
  const observerRef = useRef();
  const currentPageRef = useRef(currentPage);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreCommentsRef = useRef(hasMoreComments);

  // Update refs saat state berubah
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    hasMoreCommentsRef.current = hasMoreComments;
  }, [hasMoreComments]);

  // Utility function untuk format tanggal
  const formatDateTime = dateString => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      // Format: YYYY-MM-DD HH:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Load more comments function
  const loadMoreComments = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreCommentsRef.current || !post?.id) {
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = currentPageRef.current + 1;

      const response = await postsAPI.getComments(
        post.id,
        nextPage,
        10 // per page
      );

      if (response.success) {
        // Parse comments sesuai struktur API response (sama seperti fetchInitialData)
        let newComments = [];

        if (Array.isArray(response.data)) {
          // Jika data langsung berupa array
          newComments = response.data;
          setHasMoreComments(newComments.length >= 10);
        } else if (response.data && Array.isArray(response.data.data)) {
          // Jika data dalam format pagination
          newComments = response.data.data;
          setTotalPages(response.data.last_page || 1);
          setHasMoreComments(nextPage < (response.data.last_page || 1));
        } else if (response.meta) {
          // Jika menggunakan meta pagination seperti di data.json
          newComments = response.data || [];
          setTotalPages(response.meta.last_page || 1);
          setHasMoreComments(
            response.meta.current_page < response.meta.last_page
          );
        }

        // Deduplikasi comments berdasarkan ID
        setComments(prevComments => {
          const existingIds = new Set(prevComments.map(comment => comment.id));
          const uniqueNewComments = newComments.filter(
            comment => !existingIds.has(comment.id)
          );
          return [...prevComments, ...uniqueNewComments];
        });

        // Update pagination info
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [post?.id]);

  // Intersection Observer untuk infinite scroll
  const lastCommentElementRef = useCallback(
    node => {
      if (loadingMoreRef.current) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        entries => {
          if (
            entries[0].isIntersecting &&
            hasMoreCommentsRef.current &&
            !loadingMoreRef.current
          ) {
            loadMoreComments();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [loadMoreComments]
  );

  // Fetch initial comments dan post details
  useEffect(() => {
    if (!isOpen || !post?.id) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Reset semua data terlebih dahulu untuk transisi yang smooth
        setComments([]);
        setPostDetails(null);
        setCurrentPage(1);
        setHasMoreComments(true);
        setIsLiked(false);
        setLikeCount(0);

        // Fetch post details
        const postResponse = await postsAPI.getById(post.id);
        if (postResponse.success) {
          setPostDetails(postResponse.data);
          setLikeCount(postResponse.data.likes_count || 0);
        } else {
          // Fallback ke data post yang dikirim dari props
          setPostDetails(post);
          setLikeCount(post.likes_count || 0);
        }

        // Fetch like status
        try {
          const likeStatus = await postsAPI.getLikeStatus(post.id);
          setIsLiked(likeStatus.data?.is_liked || false);
        } catch (error) {
          console.error('Error fetching like status:', error);
          setIsLiked(false);
        }

        // Fetch initial comments
        const commentsResponse = await postsAPI.getComments(post.id, 1, 10);
        console.log(
          '🚀 ~ fetchInitialData ~ commentsResponse:',
          commentsResponse
        );
        console.log(
          'Comments Response Structure:',
          JSON.stringify(commentsResponse, null, 2)
        );

        let initialComments = [];

        if (commentsResponse.success) {
          // Parse comments sesuai struktur API response
          const commentsData = commentsResponse.data;

          console.log('Parsed Comments Data:', commentsData);

          if (Array.isArray(commentsData)) {
            // Jika data langsung berupa array
            console.log('Format: Direct array, length:', commentsData.length);
            initialComments = commentsData;
            setComments(commentsData);
            setHasMoreComments(commentsData.length >= 10); // Asumsi jika ada 10 items, mungkin ada lebih
          } else if (commentsData && Array.isArray(commentsData.data)) {
            // Jika data dalam format pagination
            console.log(
              'Format: Paginated data, items:',
              commentsData.data.length,
              'pages:',
              commentsData.last_page
            );
            initialComments = commentsData.data;
            setComments(commentsData.data);
            setTotalPages(commentsData.last_page || 1);
            setHasMoreComments(1 < (commentsData.last_page || 1));
          } else if (commentsResponse.meta) {
            // Jika menggunakan meta pagination seperti di data.json
            console.log(
              'Format: Meta pagination, items:',
              (commentsResponse.data || []).length,
              'current page:',
              commentsResponse.meta.current_page,
              'last page:',
              commentsResponse.meta.last_page
            );
            initialComments = commentsResponse.data || [];
            setComments(commentsResponse.data || []);
            setTotalPages(commentsResponse.meta.last_page || 1);
            setHasMoreComments(
              commentsResponse.meta.current_page <
                commentsResponse.meta.last_page
            );
          } else {
            // Fallback
            console.log('Format: Fallback - no recognized structure');
            initialComments = [];
            setComments([]);
            setHasMoreComments(false);
          }
        } else {
          initialComments = [];
          setComments([]);
          setHasMoreComments(false);
        }

        // Update comment count di MainFeed dengan data yang benar
        if (onCommentUpdate && initialComments.length >= 0) {
          onCommentUpdate(post.id, initialComments.length);
        }
      } catch (error) {
        console.error('Error fetching modal data:', error);
        // Set fallback data dari props
        setPostDetails(post);
        setLikeCount(post.likes_count || 0);
        setComments([]);
        setHasMoreComments(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [isOpen, post?.id]);

  // Handle like post
  const handleLike = async () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    try {
      // Optimistic update untuk modal
      const newIsLiked = !isLiked;
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;

      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);

      // Update MainFeed secara real-time
      if (onLikeUpdate) {
        onLikeUpdate(post.id, newIsLiked, newLikeCount);
      }

      // API call untuk toggle like
      const response = await postsAPI.toggleLike(post.id);

      if (response.success) {
        // Update dengan data dari server (jika berbeda dari optimistic update)
        const serverIsLiked = response.data.is_liked;
        const serverLikeCount = response.data.likes_count;

        setIsLiked(serverIsLiked);
        setLikeCount(serverLikeCount);

        // Update MainFeed dengan data server
        if (onLikeUpdate) {
          onLikeUpdate(post.id, serverIsLiked, serverLikeCount);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update jika gagal
      setIsLiked(isLiked);
      setLikeCount(likeCount);

      // Revert MainFeed update juga
      if (onLikeUpdate) {
        onLikeUpdate(post.id, isLiked, likeCount);
      }
    }
  };

  // Handle submit comment
  const handleSubmitComment = async e => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || submittingComment) return;

    try {
      setSubmittingComment(true);

      const response = await postsAPI.createComment(post.id, {
        content: newComment.trim(),
      });

      if (response.success) {
        // Add new comment to the beginning of the list
        setComments(prev => [response.data, ...prev]);
        setNewComment('');

        // Update comment count di MainFeed secara real-time
        if (onCommentUpdate) {
          const newCommentCount = comments.length + 1;
          onCommentUpdate(post.id, newCommentCount);
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Cleanup observer saat component unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex overflow-hidden relative'
          onClick={e => e.stopPropagation()}
        >
          {/* Loading Overlay untuk transisi smooth */}
          {loading && (
            <div className='absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10'>
              <div className='flex flex-col items-center space-y-3'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                <span className='text-sm text-gray-600'>Loading post...</span>
              </div>
            </div>
          )}

          {/* Left side - Post Image */}
          <div className='flex-1 bg-white flex items-center justify-center'>
            {postDetails?.image ? (
              <img
                src={postDetails.image}
                alt='Post'
                className='max-w-full max-h-full object-contain'
              />
            ) : loading ? (
              <div className='w-full h-96 bg-gray-200 animate-pulse'></div>
            ) : (
              <div className='w-full h-96 bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-500'>No Image</span>
              </div>
            )}
          </div>

          {/* Right side - Post details and comments */}
          <div className='w-96 flex flex-col'>
            {/* Header */}
            <div className='p-4 border-b flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                {loading ? (
                  <>
                    <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse'></div>
                    <div className='w-20 h-4 bg-gray-200 rounded animate-pulse'></div>
                  </>
                ) : (
                  <>
                    <Avatar className='w-8 h-8'>
                      {hasValidAvatar(postDetails?.user?.avatar) && (
                        <AvatarImage
                          src={postDetails?.user?.avatar}
                          alt={postDetails?.user?.name}
                        />
                      )}
                      <AvatarFallback className='text-xs text-white bg-gradient-to-br from-purple-600 to-blue-800'>
                        {getUserInitials(postDetails?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className='font-semibold text-sm'>
                      {postDetails?.user?.name}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className='p-1 hover:bg-gray-100 rounded-full'
              >
                <X size={20} />
              </button>
            </div>

            {/* Post caption */}
            {loading ? (
              <div className='p-4 border-b'>
                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse'></div>
                  <div className='flex-1 space-y-2'>
                    <div className='w-full h-3 bg-gray-200 rounded animate-pulse'></div>
                    <div className='w-3/4 h-3 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                </div>
              </div>
            ) : (
              postDetails?.caption && (
                <div className='p-4 border-b'>
                  <div className='flex items-start space-x-3'>
                    <Avatar className='w-8 h-8'>
                      {hasValidAvatar(postDetails?.user?.avatar) && (
                        <AvatarImage
                          src={postDetails?.user?.avatar}
                          alt={postDetails?.user?.name}
                        />
                      )}
                      <AvatarFallback className='text-xs text-white bg-gradient-to-br from-purple-600 to-blue-800'>
                        {getUserInitials(postDetails?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <span className='font-semibold text-sm mr-2'>
                        {postDetails?.user?.name}
                      </span>
                      <span className='text-sm'>{postDetails.caption}</span>
                      <div className='text-xs text-gray-500 mt-1'>
                        {formatDateTime(postDetails.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Comments list */}
            <div
              ref={commentsContainerRef}
              className='flex-1 overflow-y-auto p-4 space-y-4'
            >
              {loading ? (
                // Skeleton loading untuk komentar
                <div className='space-y-4'>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse'></div>
                      <div className='flex-1 space-y-2'>
                        <div className='w-1/3 h-3 bg-gray-200 rounded animate-pulse'></div>
                        <div className='w-full h-3 bg-gray-200 rounded animate-pulse'></div>
                        <div className='w-2/3 h-3 bg-gray-200 rounded animate-pulse'></div>
                        <div className='w-16 h-2 bg-gray-200 rounded animate-pulse'></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      ref={
                        index === comments.length - 1
                          ? lastCommentElementRef
                          : null
                      }
                      className='flex items-start space-x-3'
                    >
                      <Avatar className='w-8 h-8'>
                        {hasValidAvatar(comment.user?.avatar) && (
                          <AvatarImage
                            src={comment.user?.avatar}
                            alt={comment.user?.name}
                          />
                        )}
                        <AvatarFallback
                          style={{
                            backgroundColor: getAvatarBackgroundColor(
                              comment.user?.name
                            ),
                          }}
                        >
                          {getUserInitials(comment.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <span className='font-semibold text-sm mr-2'>
                          {comment.user?.name}
                        </span>
                        <span className='text-sm'>{comment.content}</span>
                        <div className='text-xs text-gray-500 mt-1'>
                          {formatDateTime(comment.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {loadingMore && (
                    <div className='flex justify-center py-4'>
                      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
                    </div>
                  )}

                  {!hasMoreComments && comments.length > 0 && (
                    <div className='text-center text-gray-500 text-sm py-4'>
                      No more comments
                    </div>
                  )}

                  {comments.length === 0 && !loading && (
                    <div className='text-center text-gray-500 text-sm py-8'>
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions and comment form */}
            <div className='border-t'>
              {loading ? (
                // Skeleton loading untuk actions
                <div className='p-4'>
                  <div className='flex items-center space-x-4 mb-3'>
                    <div className='w-6 h-6 bg-gray-200 rounded animate-pulse'></div>
                    <div className='w-6 h-6 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                  <div className='w-20 h-3 bg-gray-200 rounded animate-pulse mb-2'></div>
                  <div className='w-16 h-2 bg-gray-200 rounded animate-pulse mb-4'></div>
                  <div className='flex items-center space-x-3'>
                    <div className='flex-1 h-8 bg-gray-200 rounded animate-pulse'></div>
                    <div className='w-6 h-6 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Like and comment buttons */}
                  <div className='p-4 pb-2'>
                    <div className='flex items-center space-x-4 mb-2'>
                      <button
                        onClick={handleLike}
                        className={`p-1 ${
                          isLiked ? 'text-red-500' : 'text-gray-700'
                        } hover:text-red-500 transition-colors`}
                      >
                        <Heart
                          size={24}
                          fill={isLiked ? 'currentColor' : 'none'}
                        />
                      </button>
                      <button className='p-1 text-gray-700 hover:text-gray-900'>
                        <MessageCircle size={24} />
                      </button>
                    </div>

                    {/* Like count */}
                    <div className='text-sm font-semibold mb-1'>
                      {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                    </div>

                    {/* Post time */}
                    <div className='text-xs text-gray-500 uppercase'>
                      {formatDateTime(postDetails?.created_at)}
                    </div>
                  </div>

                  {/* Comment form */}
                  <form onSubmit={handleSubmitComment} className='p-4 pt-2'>
                    <div className='flex items-center space-x-3'>
                      <input
                        type='text'
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder='Add a comment...'
                        className='flex-1 border-none outline-none text-sm'
                        disabled={submittingComment}
                      />
                      <button
                        type='submit'
                        disabled={!newComment.trim() || submittingComment}
                        className={`p-1 ${
                          newComment.trim() && !submittingComment
                            ? 'text-blue-500 hover:text-blue-600'
                            : 'text-gray-400'
                        } transition-colors`}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CommentsModal;
