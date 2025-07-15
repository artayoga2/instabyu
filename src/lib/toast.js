import toast from 'react-hot-toast';

/**
 * Library untuk toast notification yang reusable
 * Menangani berbagai jenis pesan dengan styling konsisten
 */

/**
 * Mapping kode error HTTP ke pesan yang user-friendly
 */
const ERROR_MESSAGES = {
  400: 'Permintaan tidak valid',
  401: 'Email/username atau password salah',
  403: 'Akses ditolak',
  404: 'Data tidak ditemukan',
  422: 'Data yang dikirim tidak valid',
  429: 'Terlalu banyak percobaan. Coba lagi nanti',
  500: 'Terjadi kesalahan server. Silakan coba lagi',
  502: 'Server sedang bermasalah',
  503: 'Layanan sedang tidak tersedia',
  504: 'Koneksi timeout',
};

/**
 * Menampilkan toast sukses
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {object} options - Opsi tambahan untuk toast
 */
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
    ...options,
  });
};

/**
 * Menampilkan toast error berdasarkan kode atau pesan
 * @param {string|number} codeOrMessage - Kode error HTTP atau pesan custom
 * @param {string} customMessage - Pesan custom jika ingin override
 * @param {object} options - Opsi tambahan untuk toast
 */
export const showErrorToast = (
  codeOrMessage,
  customMessage = null,
  options = {}
) => {
  let message;

  // Jika parameter pertama adalah number (kode HTTP)
  if (typeof codeOrMessage === 'number') {
    message =
      customMessage || ERROR_MESSAGES[codeOrMessage] || 'Terjadi kesalahan';
  } else {
    // Jika parameter pertama adalah string (pesan)
    message = codeOrMessage;
  }

  return toast.error(message, {
    duration: 5000,
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
    ...options,
  });
};

/**
 * Menampilkan toast warning
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {object} options - Opsi tambahan untuk toast
 */
export const showWarningToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
      fontWeight: '500',
    },
    ...options,
  });
};

/**
 * Menampilkan toast info
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {object} options - Opsi tambahan untuk toast
 */
export const showInfoToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
      fontWeight: '500',
    },
    ...options,
  });
};

/**
 * Menampilkan toast loading
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {object} options - Opsi tambahan untuk toast
 */
export const showLoadingToast = (message = 'Memproses...', options = {}) => {
  return toast.loading(message, {
    style: {
      background: '#6b7280',
      color: '#fff',
      fontWeight: '500',
    },
    ...options,
  });
};

/**
 * Menghapus toast berdasarkan ID
 * @param {string} toastId - ID toast yang akan dihapus
 */
export const dismissToast = toastId => {
  toast.dismiss(toastId);
};

/**
 * Menghapus semua toast
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Menampilkan toast berdasarkan response API
 * @param {object} error - Error object dari API
 * @param {string} defaultMessage - Pesan default jika tidak ada pesan spesifik
 */
export const showApiErrorToast = (
  error,
  defaultMessage = 'Terjadi kesalahan'
) => {
  let message = defaultMessage;
  let statusCode = null;

  // Ekstrak status code dari error
  if (error.response?.status) {
    statusCode = error.response.status;
  } else if (error.message) {
    // Cari status code dalam pesan error
    const statusMatch = error.message.match(/(\d{3})/);
    if (statusMatch) {
      statusCode = parseInt(statusMatch[1]);
    }
  }

  // Ekstrak pesan dari response API
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.message && !statusCode) {
    message = error.message;
  } else if (statusCode && ERROR_MESSAGES[statusCode]) {
    message = ERROR_MESSAGES[statusCode];
  }

  return showErrorToast(message);
};

/**
 * Menampilkan toast promise untuk operasi async
 * @param {Promise} promise - Promise yang akan dimonitor
 * @param {object} messages - Object berisi pesan untuk loading, success, dan error
 * @param {object} options - Opsi tambahan untuk toast
 */
export const showPromiseToast = (promise, messages, options = {}) => {
  const defaultMessages = {
    loading: 'Memproses...',
    success: 'Berhasil!',
    error: 'Terjadi kesalahan',
  };

  const finalMessages = { ...defaultMessages, ...messages };

  return toast.promise(
    promise,
    {
      loading: finalMessages.loading,
      success: finalMessages.success,
      error: err => {
        // Jika error adalah object dengan pesan spesifik
        if (err?.response?.data?.message) {
          return err.response.data.message;
        }
        if (err?.message) {
          return err.message;
        }
        return finalMessages.error;
      },
    },
    {
      style: {
        fontWeight: '500',
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      },
      error: {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      },
      loading: {
        style: {
          background: '#6b7280',
          color: '#fff',
        },
      },
      ...options,
    }
  );
};
