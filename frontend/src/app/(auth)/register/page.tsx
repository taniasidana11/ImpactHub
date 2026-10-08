'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registerUser } from '@/services/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';

import {
  Heart,
  Eye,
  EyeOff,
  Loader2,
  Users,
  Building2,
} from 'lucide-react';
import { AuthResponse } from '@/types';

type Role = 'Volunteer' | 'NGO';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Volunteer' as Role,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      const userData: AuthResponse = response.data;
      login(userData);
      toast.success(`Welcome to ImpactHub, ${userData.name}!`);

      if (userData.role === 'NGO') router.push('/dashboard/ngo');
      else router.push('/dashboard/volunteer');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Login failed'));
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
            Join thousands making
            <br />
            a real difference
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Whether you are a volunteer looking for causes or an NGO seeking
            support — ImpactHub is your platform for social change.
          </p>
        </div>
        <div className="space-y-4">
          {[
            'Free to join — no hidden fees',
            'Verified NGOs you can trust',
            'Events across 50+ cities in India',
            'Personal dashboard to track impact',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-blue-100 text-sm">{item}</p>
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
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                role: 'Volunteer' as Role,
                icon: <Users size={18} />,
                label: 'Volunteer',
                description: 'Join events and causes',
              },
              {
                role: 'NGO' as Role,
                icon: <Building2 size={18} />,
                label: 'NGO',
                description: 'Post events and manage volunteers',
              },
            ].map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: item.role })
                }
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  formData.role === item.role
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {item.icon}
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-xs text-center opacity-70">
                  {item.description}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.name
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 bg-white focus:border-blue-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors pr-12 ${
                    errors.confirmPassword
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 bg-white focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* NGO notice */}
            {formData.role === 'NGO' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-semibold">NGO Registration Note:</span>{' '}
                  After signing up your account will be reviewed and approved
                  by our admin team before you can post events. This usually
                  takes 24-48 hours.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${formData.role} Account`
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By signing up you agree to our terms of service and privacy
              policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}