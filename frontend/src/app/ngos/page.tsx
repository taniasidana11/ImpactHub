'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MainLayout } from '@/components/layout';
import { getAllNGOs } from '@/services/api';
import { NGO } from '@/types';
import {
  Search,
  MapPin,
  CheckCircle,
  Users,
  Calendar,
  Loader2,
  Building2,
  ArrowRight,
  Globe,
} from 'lucide-react';

export default function NGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchNGOs = useCallback(async () => {
    try {
      const response = await getAllNGOs();
      setNgos(response.data);
    } catch {
      setNgos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  const filteredNGOs = ngos.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.description.toLowerCase().includes(search.toLowerCase()) ||
      ngo.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Discover NGOs
          </h1>
          <p className="text-gray-500 max-w-xl mb-8">
            Browse verified organizations making a difference. Find a cause that
            resonates with you and get involved.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search NGOs by name, cause or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 bg-gray-50"
            />
          </div>
        </div>
      </section>

      {/* NGOs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        ) : filteredNGOs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No NGOs found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or check back later
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredNGOs.length}
              </span>{' '}
              verified organizations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNGOs.map((ngo) => (
                <Link
                  key={ngo._id}
                  href={`/ngos/${ngo._id}`}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group overflow-hidden"
                >
                  {/* Cover Image */}
                  <div className="relative h-32 bg-blue-600 overflow-hidden">
                    {ngo.coverImage ? (
                      <Image
                        src={ngo.coverImage}
                        alt={`${ngo.name} cover`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-blue-700" />
                    )}

                    {/* Profile Image overlaid */}
                    <div className="absolute -bottom-6 left-5">
                      <div className="w-14 h-14 rounded-xl border-2 border-white overflow-hidden bg-white shadow-sm">
                        {ngo.profileImage ? (
                          <Image
                            src={ngo.profileImage}
                            alt={ngo.name}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">
                              {ngo.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 pt-9">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {ngo.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle size={10} />
                        Verified
                      </span>
                    </div>

                    {ngo.mission && (
                      <p className="text-sm text-blue-600 font-medium mb-2">
                        {ngo.mission}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {ngo.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={12} className="text-blue-600 shrink-0" />
                        {ngo.address}
                      </div>
                      {ngo.website && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Globe size={12} className="text-blue-600 shrink-0" />
                          {ngo.website
                            .replace('https://', '')
                            .replace('http://', '')}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={12} className="text-blue-600" />
                        {ngo.events?.length || 0} events
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users size={12} className="text-blue-600" />
                        {ngo.events?.reduce(
                          (acc, e) =>
                            acc +
                            (typeof e === 'object'
                              ? e.participants?.length || 0
                              : 0),
                          0
                        ) || 0}{' '}
                        volunteers
                      </div>
                      <div className="ml-auto">
                        <ArrowRight
                          size={14}
                          className="text-blue-600 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
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
