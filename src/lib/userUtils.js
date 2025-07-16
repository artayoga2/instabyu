/**
 * User Utilities - Helper functions untuk menangani data user
 */

/**
 * Menghasilkan initials dari nama user
 * @param {string} name - Nama lengkap user
 * @returns {string} - Initials (maksimal 2 karakter)
 */
export const getUserInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return 'U'; // Default fallback
  }

  // Bersihkan nama dari karakter khusus dan extra spaces
  const cleanName = name.trim().replace(/[^a-zA-Z\s]/g, '');
  
  if (!cleanName) {
    return 'U'; // Fallback jika nama kosong setelah dibersihkan
  }

  // Split nama berdasarkan spasi
  const nameParts = cleanName.split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    return 'U';
  }
  
  if (nameParts.length === 1) {
    // Jika hanya satu kata, ambil 2 karakter pertama
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  
  // Jika lebih dari satu kata, ambil huruf pertama dari 2 kata pertama
  return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
};

/**
 * Menghasilkan warna background untuk avatar berdasarkan nama
 * @param {string} name - Nama user
 * @returns {string} - Hex color value untuk background
 */
export const getAvatarBackgroundColor = (name) => {
  if (!name) return '#6b7280'; // gray-500
  
  const colors = [
    '#ef4444', // red-500
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#f59e0b', // yellow-500
    '#8b5cf6', // purple-500
    '#ec4899', // pink-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
    '#06b6d4'  // cyan-500
  ];
  
  // Gunakan hash sederhana dari nama untuk konsistensi warna
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Format username dengan @ prefix
 * @param {string} username - Username tanpa @
 * @returns {string} - Username dengan @ prefix
 */
export const formatUsername = (username) => {
  if (!username) return '@user';
  
  // Hapus @ jika sudah ada, lalu tambahkan lagi
  const cleanUsername = username.replace(/^@/, '');
  return `@${cleanUsername}`;
};

/**
 * Validasi dan format nama user
 * @param {string} name - Nama user
 * @returns {string} - Nama yang sudah diformat
 */
export const formatUserName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'User';
  }
  
  // Capitalize setiap kata
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Cek apakah user memiliki avatar
 * @param {string|null} avatar - URL avatar
 * @returns {boolean} - True jika avatar valid
 */
export const hasValidAvatar = (avatar) => {
  return avatar && typeof avatar === 'string' && avatar.trim().length > 0;
};