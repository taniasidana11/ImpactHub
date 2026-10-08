'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/errorHandler';

import {
  getEventById,
  registerForEvent,
  cancelRegistration,
} from '@/services/api';
import { Event } from '@/types';
import toast from 'react-hot-toast';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Building2,
  Mail,
  Shield,
} from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await getEventById(id as string);
      setEvent(response.data);
    } catch {
      toast.error('Event not found');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const isRegistered = event?.participants.some(
    (p) => typeof p === 'object' && p._id === user?._id
  );

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      router.push('/login');
      return;
    }
    if (user?.role !== 'Volunteer') {
      toast.error('Only volunteers can register for events');
      return;
    }
    setRegistering(true);
    try {
      await registerForEvent(id as string);
      toast.success('Successfully registered for the event!');
      fetchEvent();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Registration Failed'));
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    setRegistering(true);
    try {
      await cancelRegistration(id as string);
      toast.success('Registration cancelled successfully');
      fetchEvent();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Cancellation Failed'));
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (!event) return null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-blue-600 rounded-2xl p-8">
              <span className="inline-block bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                {event.status}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <Calendar size={14} />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <Clock size={14} />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <MapPin size={14} />
                  {event.location}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About this Event
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Registered Volunteers
                </h2>
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {event.participants.length}
                </span>
              </div>
              {event.participants.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No volunteers registered yet. Be the first!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {event.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2"
                    >
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        {typeof participant === 'object'
                          ? participant.name.charAt(0).toUpperCase()
                          : '?'}
                      </div>
                      <span className="text-sm text-gray-700">
                        {typeof participant === 'object'
                          ? participant.name
                          : 'Volunteer'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Register Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-50 p-2 rounded-xl">
                  <CheckCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {event.participants.length} Registered
                  </p>
                  <p className="text-xs text-gray-400">volunteers joined</p>
                </div>
              </div>

              {isAuthenticated && user?.role === 'Volunteer' ? (
                isRegistered ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="text-sm text-green-700 font-medium">
                        You are registered
                      </p>
                    </div>
                    <button
                      onClick={handleCancel}
                      disabled={registering}
                      className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {registering && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      Cancel Registration
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || event.status !== 'Upcoming'}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {registering && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Register for Event
                  </button>
                )
              ) : !isAuthenticated ? (
                <Link
                  href="/login"
                  className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors text-center"
                >
                  Login to Register
                </Link>
              ) : (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 text-center">
                    Only volunteers can register for events
                  </p>
                </div>
              )}
            </div>

            {/* NGO Info Card */}
            {event.ngo && typeof event.ngo === 'object' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={16} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Organized by
                  </h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
                    {event.ngo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {event.ngo.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Shield size={10} className="text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        Verified NGO
                      </span>
                    </div>
                  </div>
                </div>
                {event.ngo.description && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {event.ngo.description}
                  </p>
                )}
                {event.ngo.contactEmail && (
                  <a
                    href={`mailto:${event.ngo.contactEmail}`}
                    className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                  >
                    <Mail size={12} />
                    {event.ngo.contactEmail}
                  </a>
                )}
              </div>
            )}

            {/* Event Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 text-sm mb-4">
                Event Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar
                    size={14}
                    className="text-blue-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={14} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
