/**
 * Utility functions untuk form handling yang dapat digunakan kembali
 */

/**
 * Membuat validation schema untuk form
 * @param {Object} validations - Object berisi validasi per field
 * @returns {Object} Validation schema
 *
 * @example
 * const schema = createValidationSchema({
 *   email: (value) => validateEmail(value),
 *   password: (value) => validatePassword(value, { minLength: 8 }),
 *   username: (value) => validateUsername(value)
 * });
 */
export const createValidationSchema = validations => {
  return validations;
};

/**
 * Helper untuk membuat initial values form
 * @param {Array} fields - Array nama field
 * @param {any} defaultValue - Nilai default (default: empty string)
 * @returns {Object} Initial values object
 *
 * @example
 * const initialValues = createInitialValues(['email', 'password', 'username']);
 * // Result: { email: '', password: '', username: '' }
 */
export const createInitialValues = (fields, defaultValue = '') => {
  const values = {};
  fields.forEach(field => {
    values[field] = defaultValue;
  });
  return values;
};

/**
 * Helper untuk extract form data dari FormData object
 * @param {FormData} formData - FormData object
 * @returns {Object} Plain object dengan data form
 */
export const extractFormData = formData => {
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
};

/**
 * Helper untuk convert object ke FormData
 * @param {Object} data - Object data
 * @returns {FormData} FormData object
 */
export const objectToFormData = data => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

/**
 * Helper untuk membersihkan object dari nilai kosong
 * @param {Object} obj - Object yang akan dibersihkan
 * @param {Array} emptyValues - Array nilai yang dianggap kosong
 * @returns {Object} Object yang sudah dibersihkan
 */
export const cleanEmptyValues = (obj, emptyValues = ['', null, undefined]) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (!emptyValues.includes(obj[key])) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Helper untuk format error dari API response
 * @param {Object} error - Error object dari API
 * @returns {Object} Formatted errors untuk form fields
 */
export const formatApiErrors = error => {
  const formattedErrors = {};

  if (error.response?.data?.errors) {
    // Laravel validation errors format
    Object.keys(error.response.data.errors).forEach(field => {
      formattedErrors[field] = error.response.data.errors[field][0];
    });
  } else if (error.response?.data?.message) {
    // Single error message
    formattedErrors.general = error.response.data.message;
  }

  return formattedErrors;
};

/**
 * Helper untuk debounce function (berguna untuk validasi real-time)
 * @param {Function} func - Function yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Helper untuk throttle function
 * @param {Function} func - Function yang akan di-throttle
 * @param {number} limit - Limit dalam milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Helper untuk auto-focus ke field dengan error pertama
 * @param {Object} errors - Object errors
 * @param {string} formId - ID form container (optional)
 */
export const focusFirstError = (errors, formId = null) => {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const selector = formId
      ? `#${formId} [name="${firstErrorField}"]`
      : `[name="${firstErrorField}"]`;

    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

/**
 * Helper untuk serialize form data ke query string
 * @param {Object} data - Form data object
 * @returns {string} Query string
 */
export const serializeToQueryString = data => {
  const params = new URLSearchParams();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      params.append(key, data[key]);
    }
  });
  return params.toString();
};

/**
 * Helper untuk parse query string ke object
 * @param {string} queryString - Query string
 * @returns {Object} Parsed object
 */
export const parseQueryString = queryString => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (let [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};
