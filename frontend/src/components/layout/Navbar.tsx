'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/api';
import toast from 'react-hot-toast';
import useMounted from '@/hooks/useMounted';
import {
  Menu,
  X,
  Heart,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mounted = useMounted();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      logout();
      router.push('/');
    }
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    if (user.role === 'Admin') return '/dashboard/admin';
    if (user.role === 'NGO') return '/dashboard/ngo';
    return '/dashboard/volunteer';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900"
          >
            <span className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Heart size={16} />
            </span>
            ImpactHub
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/events"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Browse Events
            </Link>
            <Link
              href="/ngos"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              NGOs
            </Link>

            {!mounted ? (
              <div className="flex items-center gap-3">
                <div className="w-16 h-8 bg-gray-100 rounded-lg animate-pulse" />
                <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name.split(' ')[0]}
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mounted && menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="/events"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
          >
            Browse Events
          </Link>
          <Link
            href="/ngos"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
          >
            NGOs
          </Link>

          {isAuthenticated && user ? (
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-2">
                Signed in as {user.email}
              </p>
              <Link
                href={getDashboardRoute()}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 py-2 w-full"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
