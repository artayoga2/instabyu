/**
 * Auth Layout - Layout khusus untuk halaman authentication
 * Tanpa header dan footer untuk pengalaman fullscreen
 */
export const metadata = {
  title: 'InstaByu - Authentication',
  description: 'Login dan Register ke InstaByu',
};

export default function AuthLayout({ children }) {
  return (
    <div className='min-h-screen'>
      {/* Main Content tanpa header/footer */}
      {children}
    </div>
  );
}