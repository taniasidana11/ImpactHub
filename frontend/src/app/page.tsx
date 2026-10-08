import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import {
  ArrowRight,
  Heart,
  Users,
  Calendar,
  Shield,
  Globe,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Heart size={14} className="fill-blue-600" />
              Connecting communities for social good
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Make an Impact.
              <br />
              <span className="text-blue-600">Find Your Cause.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              ImpactHub connects NGOs, volunteers, and donors on a single
              platform. Discover events, join initiatives, and be the change
              your community needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'NGOs Registered' },
              { value: '10,000+', label: 'Volunteers' },
              { value: '2,500+', label: 'Events Hosted' },
              { value: '50+', label: 'Cities Covered' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-blue-200 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ImpactHub Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to start making a difference in your community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Users size={24} className="text-blue-600" />,
                title: 'Create Your Account',
                description:
                  'Sign up as a Volunteer or NGO. NGOs go through a quick verification process to ensure platform integrity.',
              },
              {
                step: '02',
                icon: <Calendar size={24} className="text-blue-600" />,
                title: 'Discover Events',
                description:
                  'Browse hundreds of events filtered by location, date, or cause. Find what matters most to you.',
              },
              {
                step: '03',
                icon: <Heart size={24} className="text-blue-600" />,
                title: 'Make an Impact',
                description:
                  'Register for events, show up, and contribute. Track your volunteering history on your personal dashboard.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 border border-gray-100 relative"
              >
                <span className="absolute top-6 right-6 text-5xl font-bold text-gray-50">
                  {item.step}
                </span>
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything you need to
                <span className="text-blue-600"> drive social change</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                ImpactHub brings together the tools NGOs and volunteers need
                to collaborate effectively and create lasting impact.
              </p>
              <ul className="space-y-4">
                {[
                  'Verified NGO profiles you can trust',
                  'Smart event discovery with filters',
                  'One-click volunteer registration',
                  'Personal dashboard to track impact',
                  'Admin-moderated content for safety',
                  'Fully responsive on all devices',
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle
                      size={18}
                      className="text-blue-600 shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: <Shield size={22} className="text-blue-600" />,
                  title: 'Verified NGOs',
                  description: 'Every NGO is reviewed and approved by our admin team',
                },
                {
                  icon: <Globe size={22} className="text-blue-600" />,
                  title: 'Community Reach',
                  description: 'Connect with causes across multiple cities and regions',
                },
                {
                  icon: <TrendingUp size={22} className="text-blue-600" />,
                  title: 'Track Impact',
                  description: 'Monitor your volunteering history and contributions',
                },
                {
                  icon: <Users size={22} className="text-blue-600" />,
                  title: 'Role Based',
                  description: 'Tailored experience for NGOs, volunteers, and admins',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For NGOs Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for NGOs too
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Powerful tools to help your organization reach more volunteers
              and manage events efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Easy Event Management',
                description:
                  'Create, edit, and manage events from a clean dashboard. Track registrations in real time.',
              },
              {
                title: 'Verified Profile',
                description:
                  'Get a verified badge that builds trust with volunteers and donors browsing the platform.',
              },
              {
                title: 'Volunteer Tracking',
                description:
                  'See exactly who has registered for your events and manage your participant list easily.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/register?role=NGO"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Register Your NGO
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of volunteers and NGOs already using ImpactHub to
            create meaningful change in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Join as Volunteer
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/register?role=NGO"
              className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
            >
              Register Your NGO
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}