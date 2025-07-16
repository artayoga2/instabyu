import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Optimasi loading font
  variable: '--font-inter'
});

export const metadata = {
  title: 'InstaByu - Aplikasi Demo',
  description: 'Aplikasi demo untuk syarat lamaran kerja',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#7c3aed',
};

export default function RootLayout({ children }) {
  return (
    <html lang='id' className={inter.variable}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
          {/* Global Toast Provider - Responsive */}
          <Toaster
            position='top-right'
            containerClassName="!top-4 !right-4 sm:!top-6 sm:!right-6"
            toastOptions={{
              duration: 4000,
              className: 'text-sm sm:text-base',
              style: {
                background: '#363636',
                color: '#fff',
                maxWidth: '90vw',
                wordBreak: 'break-word'
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
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
