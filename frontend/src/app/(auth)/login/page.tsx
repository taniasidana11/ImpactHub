'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/services/api';
import toast from 'react-hot-toast';
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthResponse } from '@/types';
import { getErrorMessage } from '@/utils/errorHandler';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(formData);
      const userData: AuthResponse = response.data;
      login(userData);
      toast.success(`Welcome back, ${userData.name}!`);

      // Redirect based on role
      if (userData.role === 'Admin') router.push('/dashboard/admin');
      else if (userData.role === 'NGO') router.push('/dashboard/ngo');
      else router.push('/dashboard/volunteer');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-12">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-white"
        >
          <span className="bg-white text-blue-600 p-1.5 rounded-lg">
            <Heart size={16} />
          </span>
          ImpactHub
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Welcome back to
            <br />
            ImpactHub
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Continue making a difference. Log in to access your dashboard
            and manage your social impact journey.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '500+', label: 'NGOs' },
            { value: '10K+', label: 'Volunteers' },
            { value: '2.5K+', label: 'Events' },
            { value: '50+', label: 'Cities' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-blue-700 rounded-xl p-4"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-blue-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 mb-8 lg:hidden"
          >
            <span className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Heart size={16} />
            </span>
            ImpactHub
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to your account
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up for free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.email
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 bg-white focus:border-blue-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors pr-12 ${
                    errors.password
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 bg-white focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-gray-50 px-4">
              or continue as
            </div>
          </div>

          {/* Quick role hints */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { role: 'Volunteer', color: 'bg-green-50 text-green-700 border-green-200' },
              { role: 'NGO', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { role: 'Admin', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            ].map((item) => (
              <div
                key={item.role}
                className={`text-center text-xs font-medium py-2 px-3 rounded-lg border ${item.color}`}
              >
                {item.role}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Your dashboard is tailored to your role
          </p>
        </div>
      </div>
    </div>
  );
}