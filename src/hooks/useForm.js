import { useState } from 'react';
import { showErrorToast } from '@/lib/toast';

/**
 * Custom hook untuk menangani form state dan validasi
 * @param {Object} initialValues - Nilai awal form
 * @param {Function} validationSchema - Fungsi validasi yang mengembalikan object {fieldName: validationFunction}
 * @param {Function} onSubmit - Fungsi yang dipanggil saat form di-submit
 * @returns {Object} Form state dan handlers
 */
export const useForm = (
  initialValues = {},
  validationSchema = {},
  onSubmit = () => {}
) => {
  // State untuk data form
  const [formData, setFormData] = useState(initialValues);

  // State untuk error per field
  const [fieldErrors, setFieldErrors] = useState({});

  // State untuk menandai field yang sudah disentuh
  const [touched, setTouched] = useState({});

  // State untuk loading
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validasi single field berdasarkan validation schema
   * @param {string} fieldName - Nama field
   * @param {any} value - Nilai field
   * @returns {Object} Hasil validasi {isValid, message}
   */
  const validateField = (fieldName, value) => {
    if (validationSchema[fieldName]) {
      // Pass formData sebagai parameter kedua untuk validasi yang memerlukan akses ke field lain
      return validationSchema[fieldName](value, formData);
    }
    return { isValid: true, message: '' };
  };

  /**
   * Validasi semua field dalam form
   * @returns {Object} Object berisi error untuk setiap field yang tidak valid
   */
  const validateAllFields = () => {
    const errors = {};

    Object.keys(validationSchema).forEach(fieldName => {
      const validation = validateField(fieldName, formData[fieldName]);
      if (!validation.isValid) {
        errors[fieldName] = validation.message;
      }
    });

    return errors;
  };

  /**
   * Handle perubahan input dengan validasi real-time
   * @param {Event} e - Event dari input
   */
  const handleChange = e => {
    const { name, value } = e.target;

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error saat user mulai mengetik
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle blur input untuk menandai field sudah disentuh dan validasi
   * @param {Event} e - Event dari input
   */
  const handleBlur = e => {
    const { name, value } = e.target;

    // Tandai field sebagai touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validasi field saat blur
    const validation = validateField(name, value);
    if (!validation.isValid) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validation.message,
      }));
    }
  };

  /**
   * Handle submit form dengan validasi lengkap
   * @param {Event} e - Event dari form
   */
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasi semua field
      const errors = validateAllFields();

      // Jika ada error validasi
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);

        // Tandai semua field sebagai touched
        const allTouched = {};
        Object.keys(validationSchema).forEach(fieldName => {
          allTouched[fieldName] = true;
        });
        setTouched(allTouched);

        showErrorToast('Mohon periksa kembali data yang Anda masukkan');
        return;
      }

      // Panggil fungsi onSubmit jika validasi berhasil
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error; // Re-throw untuk handling di komponen
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset form ke nilai awal
   */
  const resetForm = () => {
    setFormData(initialValues);
    setFieldErrors({});
    setTouched({});
    setIsLoading(false);
  };

  /**
   * Set error untuk field tertentu (untuk error dari server)
   * @param {Object} errors - Object berisi error per field
   */
  const setErrors = errors => {
    setFieldErrors(errors);
  };

  /**
   * Set nilai form secara manual
   * @param {Object} values - Object berisi nilai baru
   */
  const setValues = values => {
    setFormData(prev => ({
      ...prev,
      ...values,
    }));
  };

  /**
   * Cek apakah field memiliki error dan sudah disentuh
   * @param {string} fieldName - Nama field
   * @returns {boolean} True jika field memiliki error dan sudah disentuh
   */
  const hasFieldError = fieldName => {
    return touched[fieldName] && fieldErrors[fieldName];
  };

  /**
   * Get error message untuk field tertentu
   * @param {string} fieldName - Nama field
   * @returns {string} Error message atau empty string
   */
  const getFieldError = fieldName => {
    return hasFieldError(fieldName) ? fieldErrors[fieldName] : '';
  };

  /**
   * Cek apakah form valid (tidak ada error)
   * @returns {boolean} True jika form valid
   */
  const isFormValid = () => {
    const errors = validateAllFields();
    return Object.keys(errors).length === 0;
  };

  return {
    // State
    formData,
    fieldErrors,
    touched,
    isLoading,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Utility functions
    resetForm,
    setErrors,
    setValues,
    validateField,
    validateAllFields,
    hasFieldError,
    getFieldError,
    isFormValid,
  };
};

export default useForm;
