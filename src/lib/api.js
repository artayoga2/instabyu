// lib/api.js
// Helper functions untuk fetch data dari Laravel REST API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper function untuk melakukan HTTP request ke Laravel API
 * @param {string} endpoint - API endpoint (contoh: '/posts', '/users/1')
 * @param {object} options - Fetch options (method, headers, body, dll)
 * @returns {Promise} - Response dari API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Ambil token dari localStorage jika ada (untuk authentication)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * GET request helper
 */
export const apiGet = endpoint => apiRequest(endpoint, { method: 'GET' });

/**
 * POST request helper
 */
export const apiPost = (endpoint, data) =>
  apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * PUT request helper
 */
export const apiPut = (endpoint, data) =>
  apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * DELETE request helper
 */
export const apiDelete = endpoint => apiRequest(endpoint, { method: 'DELETE' });

// Contoh penggunaan:
// const posts = await apiGet('/posts');
// const newPost = await apiPost('/posts', { title: 'Hello', content: 'World' });
