'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMyNGO, getAllEvents, deleteEvent } from '@/services/api';
import { NGO, Event } from '@/types';
import toast from 'react-hot-toast';
import { MainLayout } from '@/components/layout';
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Users,
  Loader2,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';
import useMounted from '@/hooks/useMounted';

export default function NGODashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [ngo, setNgo] = useState<NGO | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const mounted = useMounted();

  const fetchData = useCallback(async () => {
    try {
      const ngoResponse = await getMyNGO();
      setNgo(ngoResponse.data);

      const eventsResponse = await getAllEvents();
      const myEvents = eventsResponse.data.filter(
        (e: Event) =>
          typeof e.ngo === 'object' && e.ngo._id === ngoResponse.data._id
      );
      setEvents(myEvents);
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
    fetchData();
  }, [mounted, isAuthenticated, user, router, fetchData]);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setDeleting(eventId);
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      fetchData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to delete event'));
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

  // No NGO profile yet
  if (!ngo) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <Building2 size={28} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Set up your NGO profile
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Before you can post events you need to create your NGO profile. It
              will be reviewed by our admin team before going live.
            </p>
            <Link
              href="/dashboard/ngo/profile"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create NGO Profile
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {ngo.name}
              </h1>
              {ngo.verified ? (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  <CheckCircle size={12} />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  <AlertCircle size={12} />
                  Pending Verification
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{ngo.description}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/ngo/profile"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Edit size={14} />
              Edit Profile
            </Link>
            {ngo.verified && (
              <Link
                href="/dashboard/ngo/events/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} />
                New Event
              </Link>
            )}
          </div>
        </div>

        {/* Verification Notice */}
        {!ngo.verified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
            <AlertCircle
              size={18}
              className="text-yellow-600 mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Verification Pending
              </p>
              <p className="text-sm text-yellow-700 mt-0.5">
                Your NGO profile is under review. You will be able to post
                events once an admin approves your profile. This usually takes
                24-48 hours.
              </p>
            </div>
          </div>
        )}

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
              value: events.filter((e) => e.status === 'Upcoming').length,
              icon: <Clock size={18} className="text-green-600" />,
              bg: 'bg-green-50',
            },
            {
              label: 'Total Volunteers',
              value: events.reduce((acc, e) => acc + e.participants.length, 0),
              icon: <Users size={18} className="text-purple-600" />,
              bg: 'bg-purple-50',
            },
            {
              label: 'Completed',
              value: events.filter((e) => e.status === 'Completed').length,
              icon: <CheckCircle size={18} className="text-orange-600" />,
              bg: 'bg-orange-50',
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

        {/* Events */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Your Events</h2>
            {ngo.verified && (
              <Link
                href="/dashboard/ngo/events/create"
                className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
              >
                <Plus size={14} />
                Add Event
              </Link>
            )}
          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={22} className="text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                No events yet
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                {ngo.verified
                  ? 'Create your first event to start attracting volunteers'
                  : 'You can post events once your profile is verified'}
              </p>
              {ngo.verified && (
                <Link
                  href="/dashboard/ngo/events/create"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  Create Event
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-blue-600 px-6 py-4 flex items-start justify-between">
                    <div>
                      <span className="text-blue-200 text-xs font-medium">
                        {event.status}
                      </span>
                      <h3 className="text-white font-semibold mt-1">
                        {event.title}
                      </h3>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/dashboard/ngo/events/${event._id}/edit`}
                        className="p-1.5 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
                      >
                        <Edit size={13} className="text-white" />
                      </Link>
                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={deleting === event._id}
                        className="p-1.5 bg-blue-500 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-60"
                      >
                        {deleting === event._id ? (
                          <Loader2
                            size={13}
                            className="text-white animate-spin"
                          />
                        ) : (
                          <Trash2 size={13} className="text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2 mb-4">
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
                    <Link
                      href={`/events/${event._id}`}
                      className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      View public page
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}