import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

/**
 * Layout — main app shell with sidebar + main content area.
 */
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #1f2937)',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -3px rgba(0,0,0,0.1)',
            fontSize: '0.875rem',
          },
          duration: 3000,
        }}
      />
    </div>
  );
}
