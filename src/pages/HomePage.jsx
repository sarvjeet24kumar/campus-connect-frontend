import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getEvents } from '../api/events.api.js';
import EventCard from '../components/EventCard.jsx';
import LoginModal from '../components/LoginModal.jsx';
import SignupModal from '../components/SignupModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LoadingState = () => (
  <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
    Loading events…
  </div>
);

const EmptyState = ({ message }) => (
  <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
    {message}
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { user, roles } = useAuth();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const [upcomingData, pastData] = await Promise.all([
        getEvents({ filter: 'upcoming' }),
        getEvents({ filter: 'past' }),
      ]);
      setUpcomingEvents(upcomingData);
      setPastEvents(pastData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleShowLogin = event => {
      setShowLoginModal(true);
    };
    window.addEventListener('showLogin', handleShowLogin);
    return () => window.removeEventListener('showLogin', handleShowLogin);
  }, []);

  const handleLoginClick = type => {
    setShowLoginModal(true);
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-lg">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Welcome to Campus Connect
          </h1>
          <p className="mb-8 text-lg text-indigo-100">
            Discover amazing events, register instantly, and manage everything
            in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => handleLoginClick()}
              className="group flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-indigo-50 hover:shadow-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Login
            </button>

            <button
              type="button"
              onClick={handleSignupClick}
              className="group flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Signup as Student
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">
          How It Works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <span className="text-lg font-bold">1</span>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">
              Create Account
            </h3>
            <p className="text-sm text-slate-600">
              Sign up as a student or get admin access from a super admin to
              start managing events.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <span className="text-lg font-bold">2</span>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">
              Explore Events
            </h3>
            <p className="text-sm text-slate-600">
              Browse upcoming events, check seat availability, and register with
              a single click.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <span className="text-lg font-bold">3</span>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">
              Manage Everything
            </h3>
            <p className="text-sm text-slate-600">
              Admins can create events, manage registrations, and track
              attendance in real-time.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-800">
            Upcoming Events
          </h2>
        </div>
        {loadingEvents ? (
          <LoadingState />
        ) : upcomingEvents.length === 0 ? (
          <EmptyState message="No upcoming events right now." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Past Events</h2>
        {loadingEvents ? (
          <LoadingState />
        ) : pastEvents.length === 0 ? (
          <EmptyState message="No past events yet." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} badge="Past" />
            ))}
          </div>
        )}
      </section>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </div>
  );
};

export default HomePage;
