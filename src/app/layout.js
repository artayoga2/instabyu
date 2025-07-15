import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'InstaByu - Social Media App',
  description: 'Instagram clone built with Next.js 15 and Laravel API',
};

export default function RootLayout({ children }) {
  return (
    <html lang='id'>
      <body className='min-h-screen flex flex-col bg-gray-50'>
        {/* Header Navigation */}
        <Header />

        {/* Main Content */}
        <main className='flex-1'>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
