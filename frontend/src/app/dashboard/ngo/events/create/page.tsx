'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createEvent } from '@/services/api';
import toast from 'react-hot-toast';
import { MainLayout } from '@/components/layout';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';
import useMounted from '@/hooks/useMounted';

export default function CreateEventPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const mounted = useMounted();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
  }, [mounted, isAuthenticated, user, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await createEvent(formData);
      toast.success('Event created successfully');
      router.push('/dashboard/ngo');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to create event'));
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to post a new volunteering event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
              Event Details
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Beach Cleanup Drive 2026"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.title
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event, what volunteers will do, and what to bring..."
                rows={5}
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
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
              Date, Time & Location
            </h2>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="event-date"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Date
                </label>
                <input
                  id="event-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                    errors.date
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="09:00 AM"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                    errors.time
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.time && (
                  <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Juhu Beach, Mumbai, Maharashtra"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.location
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          </div>

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
                <Plus size={16} />
              )}
              Create Event
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}