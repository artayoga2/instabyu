/**
 * Utility untuk validasi form yang reusable per field
 * Dapat digunakan di berbagai komponen dan halaman
 */

/**
 * Validasi field required (wajib diisi)
 * @param {string} value - Nilai yang akan divalidasi
 * @param {string} fieldName - Nama field untuk pesan error
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || !value.toString().trim()) {
    return { isValid: false, message: `${fieldName} wajib diisi` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validasi format email
 * @param {string} email - Email yang akan divalidasi
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateEmail = email => {
  if (!email) {
    return { isValid: false, message: 'Email wajib diisi' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Format email tidak valid' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validasi password
 * @param {string} password - Password yang akan divalidasi
 * @param {object} options - Opsi validasi { minLength: number, requireSpecial: boolean, requireUppercase: boolean, requireNumber: boolean }
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireSpecial = false,
    requireUppercase = false,
    requireNumber = false,
  } = options;

  if (!password) {
    return { isValid: false, message: 'Password wajib diisi' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password minimal ${minLength} karakter`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung huruf besar' };
  }

  if (requireNumber && !/\d/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung angka' };
  }

  if (requireSpecial) {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      return {
        isValid: false,
        message: 'Password harus mengandung karakter khusus',
      };
    }
  }

  return { isValid: true, message: '' };
};

/**
 * Validasi username
 * @param {string} username - Username yang akan divalidasi
 * @param {object} options - Opsi validasi { minLength: number, maxLength: number }
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateUsername = (username, options = {}) => {
  const { minLength = 3, maxLength = 20 } = options;

  if (!username) {
    return { isValid: false, message: 'Username wajib diisi' };
  }

  if (username.length < minLength) {
    return {
      isValid: false,
      message: `Username minimal ${minLength} karakter`,
    };
  }

  if (username.length > maxLength) {
    return {
      isValid: false,
      message: `Username maksimal ${maxLength} karakter`,
    };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username hanya boleh mengandung huruf, angka, dan underscore',
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validasi email atau username (untuk login)
 * @param {string} value - Nilai yang akan divalidasi
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateEmailOrUsername = value => {
  if (!value) {
    return { isValid: false, message: 'Email atau username wajib diisi' };
  }

  if (value.length < 3) {
    return {
      isValid: false,
      message: 'Email atau username minimal 3 karakter',
    };
  }

  // Jika mengandung @, validasi sebagai email
  if (value.includes('@')) {
    return validateEmail(value);
  }

  // Jika tidak mengandung @, validasi sebagai username
  return validateUsername(value);
};

/**
 * Validasi konfirmasi password
 * @param {string} password - Password asli
 * @param {string} confirmPassword - Konfirmasi password
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Konfirmasi password wajib diisi' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Konfirmasi password tidak cocok' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validasi panjang minimum
 * @param {string} value - Nilai yang akan divalidasi
 * @param {number} minLength - Panjang minimum
 * @param {string} fieldName - Nama field untuk pesan error
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value) {
    return { isValid: false, message: `${fieldName} wajib diisi` };
  }

  if (value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} minimal ${minLength} karakter`,
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validasi panjang maksimum
 * @param {string} value - Nilai yang akan divalidasi
 * @param {number} maxLength - Panjang maksimum
 * @param {string} fieldName - Nama field untuk pesan error
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} maksimal ${maxLength} karakter`,
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validasi nomor telepon Indonesia
 * @param {string} phone - Nomor telepon yang akan divalidasi
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePhoneNumber = phone => {
  if (!phone) {
    return { isValid: false, message: 'Nomor telepon wajib diisi' };
  }

  // Regex untuk nomor telepon Indonesia
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: 'Format nomor telepon tidak valid' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validasi URL
 * @param {string} url - URL yang akan divalidasi
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateUrl = url => {
  if (!url) {
    return { isValid: false, message: 'URL wajib diisi' };
  }

  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: 'Format URL tidak valid' };
  }
};

// Hook untuk validasi form
export const useFormValidation = (formData, rules) => {
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    const rule = rules[fieldName];
    if (rule) {
      const error = rule(value, formData);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
      return !error;
    }
    return true;
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = rules[fieldName](formData[fieldName], formData);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return { errors, validateField, validateAll };
};
