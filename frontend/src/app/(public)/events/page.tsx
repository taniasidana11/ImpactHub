'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { getAllEvents } from '@/services/api';
import { Event } from '@/types';
import {
  Calendar,
  MapPin,
  Search,
  Filter,
  Clock,
  Users,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

const fetchEvents = useCallback(async () => {
  setLoading(true);
  try {
    const params: Record<string, string> = {};
    if (locationFilter) params.location = locationFilter;
    if (dateFilter) params.date = dateFilter;
    const response = await getAllEvents(params);
    setEvents(response.data);
  } catch {
    setEvents([]);
  } finally {
    setLoading(false);
  }
}, [locationFilter, dateFilter]);

useEffect(() => {
  fetchEvents();
}, [fetchEvents]);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Browse Events
          </h1>
          <p className="text-gray-500 max-w-xl">
            Discover volunteering opportunities near you. Filter by location or
            date to find the perfect cause.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 bg-gray-50"
              />
            </div>

            {/* Location filter */}
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 bg-gray-50"
              />
            </div>

            {/* Date filter */}
            <div className="relative">
              <label htmlFor="date-filter" className="sr-only">
                Filter by date
              </label>
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id = "date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 bg-gray-50"
              />
            </div>

            {/* Clear filters */}
            {(locationFilter || dateFilter || search) && (
              <button
                onClick={() => {
                  setSearch('');
                  setLocationFilter('');
                  setDateFilter('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredEvents.length}
              </span>{' '}
              events
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-blue-600 p-6">
                    <span className="inline-block bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                      {event.status}
                    </span>
                    <h3 className="text-white font-semibold text-lg leading-snug group-hover:underline">
                      {event.title}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar
                          size={14}
                          className="text-blue-600 shrink-0"
                        />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="text-blue-600 shrink-0" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-blue-600 shrink-0" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={14} className="text-blue-600 shrink-0" />
                        {event.participants.length} registered
                      </div>
                    </div>

                    {/* NGO name */}
                    {event.ngo && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          by{' '}
                          <span className="font-medium text-gray-600">
                            {typeof event.ngo === 'object'
                              ? event.ngo.name
                              : event.ngo}
                          </span>
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-blue-600 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </MainLayout>
  );
}
