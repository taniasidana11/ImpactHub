'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getMyNGO, createNGO, updateNGO } from '@/services/api';
import { NGO } from '@/types';
import toast from 'react-hot-toast';
import { MainLayout } from '@/components/layout';
import ImageUpload from '@/components/shared/ImageUpload';
import {
  Loader2,
  ArrowLeft,
  Save,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';
import useMounted from '@/hooks/useMounted';


export default function NGOProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [ngo, setNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const mounted = useMounted();
  
  const [formData, setFormData] = useState({
    name: '',
    mission: '',
    description: '',
    about: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    profileImage: '',
    coverImage: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchNGO = useCallback(async () => {
    try {
      const response = await getMyNGO();
      const data: NGO = response.data;
      setNgo(data);
      setFormData({
        name: data.name || '',
        mission: data.mission || '',
        description: data.description || '',
        about: data.about || '',
        address: data.address || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        website: data.website || '',
        profileImage: data.profileImage || '',
        coverImage: data.coverImage || '',
        socialLinks: {
          instagram: data.socialLinks?.instagram || '',
          twitter: data.socialLinks?.twitter || '',
          linkedin: data.socialLinks?.linkedin || '',
        },
      });
    } catch {
      setNgo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'NGO') {
      router.push('/');
      return;
    }
    fetchNGO();
  }, [mounted, isAuthenticated, user, router, fetchNGO]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'NGO name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.contactEmail.trim())
      newErrors.contactEmail = 'Contact email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.contactEmail))
      newErrors.contactEmail = 'Enter a valid email';
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      if (ngo) {
        await updateNGO(ngo._id, formData);
        toast.success('Profile updated successfully');
      } else {
        await createNGO(formData);
        toast.success('NGO profile created — pending admin verification');
      }
      router.push('/dashboard/ngo');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to save profile'));
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/dashboard/ngo"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {ngo ? 'Edit NGO Profile' : 'Create NGO Profile'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {ngo
              ? 'Update your organization profile'
              : 'Set up your organization profile to start posting events'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
            <h2 className="text-base font-semibold text-gray-900">
              Profile Images
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cover Photo
              </label>
              <ImageUpload
                type="cover"
                currentImage={formData.coverImage}
                onUploadSuccess={(url) =>
                  setFormData({ ...formData, coverImage: url })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Photo
              </label>
              <ImageUpload
                type="profile"
                currentImage={formData.profileImage}
                onUploadSuccess={(url) =>
                  setFormData({ ...formData, profileImage: url })
                }
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
              Organization Details
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Green Earth Foundation"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.name
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Mission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mission Statement
                <span className="text-gray-400 font-normal ml-1">
                  (max 200 characters)
                </span>
              </label>
              <input
                type="text"
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="We work towards environmental sustainability..."
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {formData.mission.length}/200
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Short Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description shown in search results and cards..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${
                  errors.description
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                About
                <span className="text-gray-400 font-normal ml-1">
                  (full story shown on profile page)
                </span>
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell your full story — history, impact, team, goals..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, Mumbai, Maharashtra"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.address
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="contact@yourorg.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                    errors.contactEmail
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Phone
                  <span className="text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Website
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Globe
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourorganization.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
              Social Links
              <span className="text-gray-400 font-normal text-sm ml-2">
                (optional)
              </span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Instagram
              </label>
              <div className="relative">
                <Instagram
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/yourorg"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Twitter / X
              </label>
              <div className="relative">
                <Twitter
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleSocialChange}
                  placeholder="https://twitter.com/yourorg"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                LinkedIn
              </label>
              <div className="relative">
                <Linkedin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleSocialChange}
                  placeholder="https://linkedin.com/company/yourorg"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/dashboard/ngo"
              className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {ngo ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
