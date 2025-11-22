import { useEffect, useState } from 'react';

import { getEvents } from '../api/events.api.js';
import {
  getMyRegistrations,
  registerForEvent as registerForEventApi,
  unregisterFromEvent as unregisterFromEventApi,
} from '../api/students.api.js';
import Alert from '../components/Alert.jsx';
import EventCard from '../components/EventCard.jsx';

const getErrorMessage = (err, defaultMsg) => {
  if (!err.response) {
    return 'Cannot connect to server.';
  }
  const detail = err.response?.data;
  if (Array.isArray(detail)) return detail[0];
  if (detail?.error) return detail.error;
  if (typeof detail === 'string') return detail;
  return defaultMsg;
};

const LoadingState = ({ message = 'Loading your events…' }) => (
  <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
    {message}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
    {message}
  </div>
);

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const getRegistrationForEvent = eventId => {
    return registrations.find(entry => entry.event.id === eventId);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsData, registrationsData] = await Promise.all([
        getEvents(),
        getMyRegistrations(),
      ]);
      setEvents(eventsData);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error(err);
      setError('Unable to load events right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const registerForEvent = async eventId => {
    setError(null);
    setMessage(null);
    try {
      await registerForEventApi(eventId);
      setMessage('Registered successfully.');

      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not register. Please try again.'));
    }
  };

  const unregisterFromEvent = async registrationId => {
    setError(null);
    setMessage(null);
    try {
      await unregisterFromEventApi(registrationId);
      setMessage('Registration cancelled.');
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to cancel registration.'));
    }
  };

  const renderActions = event => {
    const registration = getRegistrationForEvent(event.id);
    const isFull = event.available_seats === 0;
    const isPast = event.is_past;

    if (registration) {
      return (
        <div className="flex items-center justify-between gap-3 text-sm">
          {/* <span className="font-medium text-emerald-600">Registered</span> */}
          <button
            type="button"
            onClick={() => unregisterFromEvent(registration.id)}
            className="w-full rounded-md bg-rose-100 px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-200"
          >
            Unregister
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => registerForEvent(event.id)}
        disabled={isFull || isPast}
        className={`w-full rounded-md px-3 py-2 text-sm font-semibold transition ${
          isFull || isPast
            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
            : 'bg-indigo-600 text-white hover:bg-indigo-500'
        }`}
      >
        {isFull ? 'Full' : isPast ? 'Closed' : 'Register'}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Register, manage, and review all events in one place.
          </p>
        </div>
      </div>

      {message && (
        <Alert
          type="success"
          message={message}
          onClose={() => setMessage(null)}
        />
      )}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <LoadingState />
      ) : events.length === 0 ? (
        <EmptyState message="No events available right now." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => {
            const registration = getRegistrationForEvent(event.id);
            const badge = registration
              ? 'Registered'
              : event.is_past
              ? 'Past'
              : undefined;
            return (
              <EventCard
                key={event.id}
                event={event}
                badge={badge}
                actions={renderActions(event)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
