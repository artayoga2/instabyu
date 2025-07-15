import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';

/**
 * Custom Hook untuk fetch data posts dari API
 * Contoh penggunaan: const { posts, loading, error, refetch } = usePosts();
 */
export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function untuk fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data dari Laravel API
      const response = await apiGet('/posts');
      setPosts(response.data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Return state dan functions
  return {
    posts,
    loading,
    error,
    refetch: fetchPosts, // Function untuk refresh data
  };
}

/**
 * Custom Hook untuk authentication state
 * Contoh penggunaan: const { user, isAuthenticated, logout } = useAuth();
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token dengan API
        const response = await apiGet('/auth/me');
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (err) {
        // Token invalid, hapus dari localStorage
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout,
  };
}
