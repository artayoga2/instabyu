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
    // Tambahkan header untuk CORS
    'X-Requested-With': 'XMLHttpRequest',
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
    // Tambahkan credentials untuk CORS
    credentials: 'include',
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

/**
 * Fungsi untuk mengambil CSRF token dari Laravel Sanctum
 * Harus dipanggil sebelum melakukan request yang memerlukan CSRF protection
 */
export async function getCsrfToken() {
  try {
    const response = await fetch(
      `${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get CSRF token');
    }

    // CSRF token akan disimpan dalam cookie secara otomatis
    return true;
  } catch (error) {
    console.error('CSRF Token Error:', error);
    throw error;
  }
}

/**
 * POST request helper dengan CSRF token
 * Otomatis mengambil CSRF token sebelum melakukan POST request
 */
export const apiPostWithCsrf = async (endpoint, data) => {
  try {
    // Ambil CSRF token terlebih dahulu
    await getCsrfToken();

    // Lakukan POST request
    return await apiRequest(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('API POST with CSRF Error:', error);
    throw error;
  }
};

// Contoh penggunaan:
// const posts = await apiGet('/posts');
// const newPost = await apiPost('/posts', { title: 'Hello', content: 'World' });
// const loginResult = await apiPostWithCsrf('/api/auth/login', { email: 'user@example.com', password: 'password' });
