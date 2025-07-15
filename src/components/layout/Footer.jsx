/**
 * Footer Component - Footer sederhana untuk aplikasi
 */
export default function Footer() {
  return (
    <footer className='bg-gray-50 border-t border-gray-200 mt-auto'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center text-gray-600'>
          <p>&copy; 2024 InstaByu. Made with ❤️ using Next.js 15</p>
          <div className='mt-4 space-x-6'>
            <a href='#' className='hover:text-gray-900 transition-colors'>
              About
            </a>
            <a href='#' className='hover:text-gray-900 transition-colors'>
              Privacy
            </a>
            <a href='#' className='hover:text-gray-900 transition-colors'>
              Terms
            </a>
            <a href='#' className='hover:text-gray-900 transition-colors'>
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
