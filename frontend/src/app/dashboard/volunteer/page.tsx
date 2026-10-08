'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMyEvents, cancelRegistration } from '@/services/api';
import { Event } from '@/types';
import toast from 'react-hot-toast';
import { MainLayout } from '@/components/layout';
import { getErrorMessage } from '@/utils/errorHandler';
import useMounted from '@/hooks/useMounted';

import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Loader2,
  Heart,
  Search,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const mounted = useMounted();
  
  const fetchMyEvents = useCallback(async () => {
    try {
      const response = await getMyEvents();
      setEvents(response.data);
    } catch {
      toast.error('Failed to load your events');
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
    if (user?.role !== 'Volunteer') {
      router.push('/');
      return;
    }
    fetchMyEvents();
  }, [mounted, isAuthenticated, user, router, fetchMyEvents]);

  const handleCancel = async (eventId: string) => {
    setCancelling(eventId);
    try {
      await cancelRegistration(eventId);
      toast.success('Registration cancelled');
      fetchMyEvents();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Cancellation Failed'));
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const upcomingEvents = events.filter((e) => e.status === 'Upcoming');
  const pastEvents = events.filter((e) => e.status !== 'Upcoming');

  // Show spinner while waiting for mount or data
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Track your volunteering journey and upcoming events
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Search size={15} />
            Browse Events
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: 'Total Events',
              value: events.length,
              icon: <Calendar size={18} className="text-blue-600" />,
              bg: 'bg-blue-50',
            },
            {
              label: 'Upcoming',
              value: upcomingEvents.length,
              icon: <Clock size={18} className="text-green-600" />,
              bg: 'bg-green-50',
            },
            {
              label: 'Completed',
              value: pastEvents.length,
              icon: <CheckCircle size={18} className="text-purple-600" />,
              bg: 'bg-purple-50',
            },
            {
              label: 'NGOs Supported',
              value: new Set(
                events.map((e) =>
                  typeof e.ngo === 'object' ? e.ngo._id : e.ngo
                )
              ).size,
              icon: <Heart size={18} className="text-red-500" />,
              bg: 'bg-red-50',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div
                className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Events
            </h2>
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {upcomingEvents.length} events
            </span>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={22} className="text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                No upcoming events
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                You have not registered for any upcoming events yet
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Events
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-blue-600 px-6 py-4">
                    <span className="text-blue-200 text-xs font-medium">
                      {typeof event.ngo === 'object' ? event.ngo.name : 'NGO'}
                    </span>
                    <h3 className="text-white font-semibold mt-1">
                      {event.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar
                          size={13}
                          className="text-blue-600 shrink-0"
                        />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={13} className="text-blue-600 shrink-0" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={13} className="text-blue-600 shrink-0" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={13} className="text-blue-600 shrink-0" />
                        {event.participants.length} volunteers registered
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/events/${event._id}`}
                        className="flex-1 text-center text-sm font-medium text-blue-600 border border-blue-200 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        View Event
                      </Link>
                      <button
                        onClick={() => handleCancel(event._id)}
                        disabled={cancelling === event._id}
                        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-red-600 border border-red-200 py-2 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
                      >
                        {cancelling === event._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <X size={13} />
                        )}
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Past Events
              </h2>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                {pastEvents.length} events
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pastEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden opacity-75"
                >
                  <div className="bg-gray-400 px-6 py-4">
                    <span className="text-gray-200 text-xs font-medium">
                      {typeof event.ngo === 'object' ? event.ngo.name : 'NGO'}
                    </span>
                    <h3 className="text-white font-semibold mt-1">
                      {event.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={13} className="shrink-0" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={13} className="shrink-0" />
                        {event.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={13} className="text-gray-400" />
                      <span className="text-xs text-gray-400 capitalize">
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
