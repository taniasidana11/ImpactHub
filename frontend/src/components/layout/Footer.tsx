import Link from 'next/link';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-gray-900 mb-3"
            >
              <span className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Heart size={16} />
              </span>
              ImpactHub
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Connecting NGOs, volunteers, and donors to create meaningful
              social impact across communities.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/events"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  href="/ngos"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Find NGOs
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/register?role=NGO"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Register NGO
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Account
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/volunteer"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Volunteer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/ngo"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  NGO Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ImpactHub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Built with
            <Heart size={10} className="text-red-500 fill-red-500" />
            for social impact
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;