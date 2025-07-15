'use client'; // Client Component untuk pathname detection

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * Conditional Layout - Layout yang menyesuaikan berdasarkan route
 * Menghilangkan header/footer untuk halaman authentication
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Daftar route yang tidak memerlukan header/footer
  const authRoutes = ['/login', '/register'];
  const isAuthPage = authRoutes.includes(pathname);

  // Jika halaman auth, render tanpa header/footer
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Untuk halaman lain, render dengan header/footer
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main className='flex-1'>{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}