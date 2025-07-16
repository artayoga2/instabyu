'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { apiPost } from '@/lib/api';

/**
 * Auth Context - Global state management untuk authentication
 * Mendukung struktur response Laravel dengan nested data
 */
const AuthContext = createContext();

// Auth reducer untuk mengelola state
const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_AUTH':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        token: action.payload.token,
      };

    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state dari localStorage
  useEffect(() => {
    const initAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            dispatch({
              type: 'INIT_AUTH',
              payload: {
                isAuthenticated: true,
                user,
                token,
              },
            });
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            dispatch({
              type: 'INIT_AUTH',
              payload: {
                isAuthenticated: false,
                user: null,
                token: null,
              },
            });
          }
        } else {
          dispatch({
            type: 'INIT_AUTH',
            payload: {
              isAuthenticated: false,
              user: null,
              token: null,
            },
          });
        }
      }
    };

    initAuth();
  }, []);

  // Actions
  const login = async credentials => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiPost('/auth/login', credentials);

      // Handle response sesuai struktur Laravel
      if (response.success && response.data?.token) {
        // Simpan token ke localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });

        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Login gagal');
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Helper untuk mendapatkan token dengan format Bearer
  const getAuthHeader = () => {
    return state.token ? `Bearer ${state.token}` : null;
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    getAuthHeader,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
