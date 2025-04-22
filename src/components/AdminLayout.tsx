'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Force dark mode when this component mounts
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // Restore previous theme setting when component unmounts
      // (but for now we keep dark mode for admin)
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Add Project', href: '/admin/projects/new' },
    { name: 'About Me', href: '/admin/about' },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="flex flex-col w-64 fixed inset-y-0 left-0 bg-black shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <div className="text-xl font-semibold text-white">Admin Panel</div>
            <button
              className="text-gray-400 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-2">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-gray-800'
                  } group flex items-center px-3 py-2 rounded-md text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-800 p-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-black bg-white hover:bg-gray-200 rounded-md"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:border-r md:border-gray-800 md:bg-black">
        <div className="flex items-center h-16 px-4 border-b border-gray-800">
          <div className="text-xl font-semibold text-white">Admin Panel</div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-gray-800'
                } group flex items-center px-3 py-2 rounded-md text-sm font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-black bg-white hover:bg-gray-200 rounded-md"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="sticky top-0 z-10 md:hidden bg-black flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <button
            className="text-gray-400 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-xl font-semibold text-white">Admin Panel</div>
          <Link href="/" className="text-sm text-gray-300 hover:text-white">
            View Site
          </Link>
        </div>
        <div className="hidden md:flex items-center justify-between h-16 px-4 border-b bg-black border-gray-800">
          <div className="text-sm text-gray-400">Welcome to the admin dashboard</div>
          <Link href="/" className="text-sm text-gray-300 hover:text-white">
            View Site
          </Link>
        </div>
        <main className="p-4 sm:p-6 md:p-8 bg-black text-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
} 