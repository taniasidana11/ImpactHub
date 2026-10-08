'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getAdminStats,
  getAllNGORequests,
  verifyNGO,
  getAllUsers,
  deleteUser,
  deleteEventAdmin,
  getAllEvents,
} from '@/services/api';
import { MainLayout } from '@/components/layout';
import { Stats, NGO, User, Event } from '@/types';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import useMounted from '@/hooks/useMounted';

import {
  Users,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react';

type TabType =
  | 'overview'
  | 'ngos'
  | 'approved'
  | 'rejected'
  | 'users'
  | 'events';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const mounted = useMounted();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats | null>(null);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const [verifying, setVerifying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, ngosRes, usersRes, eventsRes] = await Promise.all([
        getAdminStats(),
        getAllNGORequests(),
        getAllUsers(),
        getAllEvents(),
      ]);
      setStats(statsRes.data);
      setNgos(ngosRes.data);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch {
      toast.error('Failed to load dashboard data');
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
    if (user?.role !== 'Admin') {
      router.push('/');
      return;
    }
    fetchData();
  }, [mounted, isAuthenticated, user, router, fetchData]);

  const handleVerify = async (ngoId: string, verified: boolean) => {
    if (!verified) {
      if (
        !confirm(
          'Are you sure you want to reject this NGO? This will prevent them from posting events.'
        )
      )
        return;
    }

    setVerifying(ngoId);
    try {
      await verifyNGO(ngoId, verified);
      toast.success(
        verified ? 'NGO approved successfully' : 'NGO rejected successfully'
      );

      if (!verified) {
        setRejectedIds((prev) => [...prev, ngoId]);
      }

      setNgos((prev) =>
        prev.map((ngo) => (ngo._id === ngoId ? { ...ngo, verified } : ngo))
      );
      fetchData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to update NGO status'));
    } finally {
      setVerifying(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setDeleting(userId);
    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      // Remove user from local state immediately
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      fetchData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to delete user'));
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setDeleting(eventId);
    try {
      await deleteEventAdmin(eventId);
      toast.success('Event deleted successfully');
      // Remove event from local state immediately
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
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
      month: 'short',
      year: 'numeric',
    });
  };

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    {
      id: 'ngos',
      label: 'Pending',
      count: ngos.filter((n) => !n.verified && !rejectedIds.includes(n._id))
        .length,
    },
    {
      id: 'approved',
      label: 'Approved',
      count: ngos.filter((n) => n.verified).length,
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: ngos.filter((n) => rejectedIds.includes(n._id)).length,
    },
    { id: 'users', label: 'Users', count: users.length },
    { id: 'events', label: 'Events', count: events.length },
  ];

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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Shield size={24} className="text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Manage NGOs, users, and events across the platform
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  label: 'Total Users',
                  value: stats.totalUsers,
                  icon: <Users size={20} className="text-blue-600" />,
                  bg: 'bg-blue-50',
                },
                {
                  label: 'Total NGOs',
                  value: stats.totalNGOs,
                  icon: <Building2 size={20} className="text-purple-600" />,
                  bg: 'bg-purple-50',
                },
                {
                  label: 'Verified NGOs',
                  value: stats.verifiedNGOs,
                  icon: <CheckCircle size={20} className="text-green-600" />,
                  bg: 'bg-green-50',
                },
                {
                  label: 'Pending NGOs',
                  value: stats.pendingNGOs,
                  icon: <AlertCircle size={20} className="text-yellow-600" />,
                  bg: 'bg-yellow-50',
                },
                {
                  label: 'Total Events',
                  value: stats.totalEvents,
                  icon: <Calendar size={20} className="text-orange-600" />,
                  bg: 'bg-orange-50',
                },
                {
                  label: 'Upcoming Events',
                  value: stats.upcomingEvents,
                  icon: <TrendingUp size={20} className="text-teal-600" />,
                  bg: 'bg-teal-50',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <div
                    className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}
                  >
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pending NGOs Alert */}
            {stats.pendingNGOs > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="text-yellow-600 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    {stats.pendingNGOs} NGO
                    {stats.pendingNGOs > 1 ? 's' : ''} pending verification
                  </p>
                  <p className="text-sm text-yellow-700 mt-0.5">
                    Review and approve or reject pending NGO registrations
                  </p>
                  <button
                    onClick={() => setActiveTab('ngos')}
                    className="text-sm font-medium text-yellow-800 underline mt-2"
                  >
                    Review NGOs →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Approved NGOs
              </h2>
              <span className="text-sm text-gray-500">
                {ngos.filter((n) => n.verified).length} approved
              </span>
            </div>
            {ngos.filter((n) => n.verified).length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Building2 size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No approved NGOs yet</p>
              </div>
            ) : (
              ngos
                .filter((n) => n.verified)
                .map((ngo) => (
                  <div
                    key={ngo._id}
                    className="bg-white rounded-2xl border border-green-100 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                          {ngo.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {ngo.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              <CheckCircle size={10} />
                              Verified
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            {ngo.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {ngo.contactEmail} · {ngo.address}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {ngo.events?.length || 0} events posted
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleVerify(ngo._id, false)}
                        disabled={verifying === ngo._id}
                        className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60 shrink-0"
                      >
                        {verifying === ngo._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <X size={12} />
                        )}
                        Revoke
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* NGOs Tab */}
        {activeTab === 'ngos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending NGOs
              </h2>
              <span className="text-sm text-gray-500">
                {
                  ngos.filter(
                    (n) => !n.verified && !rejectedIds.includes(n._id)
                  ).length
                }{' '}
                pending
              </span>
            </div>
            {ngos.filter((n) => !n.verified && !rejectedIds.includes(n._id))
              .length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <CheckCircle
                  size={32}
                  className="text-green-300 mx-auto mb-3"
                />
                <p className="text-gray-500 text-sm">
                  No pending NGOs — all caught up!
                </p>
              </div>
            ) : (
              ngos
                .filter((n) => !n.verified && !rejectedIds.includes(n._id))
                .map((ngo) => (
                  <div
                    key={ngo._id}
                    className="bg-white rounded-2xl border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                          {ngo.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {ngo.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              <AlertCircle size={10} />
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            {ngo.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {ngo.contactEmail} · {ngo.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleVerify(ngo._id, true)}
                          disabled={verifying === ngo._id}
                          className="inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                        >
                          {verifying === ngo._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle size={12} />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(ngo._id, false)}
                          disabled={verifying === ngo._id}
                          className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                        >
                          <X size={12} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Rejected Tab */}
        {activeTab === 'rejected' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Rejected NGOs
              </h2>
              <span className="text-sm text-gray-500">
                {ngos.filter((n) => rejectedIds.includes(n._id)).length}{' '}
                rejected
              </span>
            </div>
            {ngos.filter((n) => rejectedIds.includes(n._id)).length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <CheckCircle size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No rejected NGOs</p>
              </div>
            ) : (
              ngos
                .filter((n) => rejectedIds.includes(n._id))
                .map((ngo) => (
                  <div
                    key={ngo._id}
                    className="bg-white rounded-2xl border border-red-100 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                          {ngo.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {ngo.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              <X size={10} />
                              Rejected
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            {ngo.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {ngo.contactEmail} · {ngo.address}
                          </p>
                        </div>
                      </div>
                      {/* Allow admin to approve a rejected NGO */}
                      <button
                        onClick={() => {
                          setRejectedIds((prev) =>
                            prev.filter((id) => id !== ngo._id)
                          );
                          handleVerify(ngo._id, true);
                        }}
                        disabled={verifying === ngo._id}
                        className="inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 shrink-0"
                      >
                        {verifying === ngo._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <CheckCircle size={12} />
                        )}
                        Approve Instead
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
              <span className="text-sm text-gray-500">
                {users.length} total
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4">
                      User
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4">
                      Role
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 hidden md:table-cell">
                      Joined
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {u.name}
                            </p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            u.role === 'Admin'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'NGO'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-500">
                          {u.createdAt ? formatDate(u.createdAt) : '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u._id !== user?._id && u.role !== 'Admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={deleting === u._id}
                            className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-60"
                          >
                            {deleting === u._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                All Events
              </h2>
              <span className="text-sm text-gray-500">
                {events.length} total
              </span>
            </div>
            {events.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No events yet</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            event.status === 'Upcoming'
                              ? 'bg-blue-100 text-blue-700'
                              : event.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {event.description.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>
                          📅 {formatDate(event.date)} at {event.time}
                        </span>
                        <span>📍 {event.location}</span>
                        <span>👥 {event.participants.length} registered</span>
                        {event.ngo && typeof event.ngo === 'object' && (
                          <span>🏢 {event.ngo.name}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      disabled={deleting === event._id}
                      className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60 shrink-0"
                    >
                      {deleting === event._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
