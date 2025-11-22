import { useEffect, useState } from 'react';

import {
  createEvent,
  getEventLocations,
  getEventRegistrations,
  getEvents,
  softDeleteEvent,
  updateEvent,
} from '../api/events.api.js';
import Alert from '../components/Alert.jsx';
import EventCard from '../components/EventCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const blankForm = {
  id: null,
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  location: '',
  seats: 10,
};

const utcToLocalDateTime = utcIsoString => {
  const date = new Date(utcIsoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const AdminDashboard = () => {
  const { user, isSuperAdmin } = useAuth();

  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [registrationsByEvent, setRegistrationsByEvent] = useState({});
  const [expandedEvent, setExpandedEvent] = useState(null);

  const myEvents = events.filter(event => event.created_by === user?.id);

  // console.log('My Events:', myEvents, events, user);

  const resetForm = () => {
    setForm(blankForm);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsData, locationsData] = await Promise.all([
        getEvents(),
        getEventLocations(),
      ]);
      setEvents(eventsData);
      setLocations(locationsData);
    } catch (err) {
      console.error(err);
      setError('Unable to load event data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async event => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setProcessing(true);

    const payload = {
      title: form.title,
      description: form.description,
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
      location: form.location,
      seats: Number(form.seats),
    };

    try {
      if (form.id) {
        await updateEvent(form.id, payload);
        setMessage('Event updated successfully.');
      } else {
        await createEvent(payload);
        setMessage('Event created successfully.');
      }
      resetForm();
      await fetchData();
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server.');
        setProcessing(false);
        return;
      }

      const detail = err.response?.data;
      if (Array.isArray(detail)) {
        setError(detail[0]);
      } else if (detail && typeof detail === 'object') {
        const firstError = Object.values(detail).flat()[0];
        setError(firstError || 'Unable to save event.');
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Unable to save event. Please check inputs.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const editEvent = eventData => {
    setForm({
      id: eventData.id,
      title: eventData.title,
      description: eventData.description,
      start_time: utcToLocalDateTime(eventData.start_time),
      end_time: utcToLocalDateTime(eventData.end_time),
      location: eventData.location,
      seats: eventData.seats,
    });
  };

  const deleteEvent = async eventId => {
    if (
      !window.confirm(
        'Are you sure you want to delete this event? All registrations will be removed.'
      )
    ) {
      return;
    }

    setError(null);
    setMessage(null);
    try {
      await softDeleteEvent(eventId);
      setMessage('Event removed.');
      await fetchData();
    } catch (err) {
      if (!err.response) {
        setError(
          'Cannot connect to server. Please make sure Django server is running.'
        );
        return;
      }

      const detail = err.response?.data?.error;
      setError(detail || 'Unable to delete this event.');
    }
  };

  const toggleRegistrations = async eventId => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
      return;
    }
    try {
      const data = await getEventRegistrations(eventId);
      setRegistrationsByEvent(prev => ({
        ...prev,
        [eventId]: data,
      }));
      setExpandedEvent(eventId);
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. ');
        return;
      }

      const detail = err.response?.data?.error;
      setError(detail || 'Unable to load registrations.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Create, update, and monitor all events in real time.
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            {form.id ? 'Edit Event' : 'Create Event'}
          </h2>
        </div>
        <form onSubmit={submitForm} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Title *
            <input
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Seats *
            <input
              required
              type="number"
              min={1}
              name="seats"
              value={form.seats}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Description *
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Start Time *
            <input
              required
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            End Time *
            <input
              required
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Location *
            <select
              required
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="" disabled>
                Select location *
              </option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.location_display || location.location}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2 flex justify-end gap-3">
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                disabled={processing}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              disabled={processing}
              type="submit"
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                processing
                  ? 'bg-indigo-300'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {processing
                ? 'Saving…'
                : form.id
                ? 'Update Event'
                : 'Create Event'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">My Events</h2>
        {loading ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Loading events…
          </div>
        ) : myEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            You have not created any events yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myEvents.map(event => {
              const registrations = registrationsByEvent[event.id] || [];
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  badge={`Registered: ${event.registered_count}`}
                  actions={
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editEvent(event)}
                        className="rounded-md bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEvent(event.id)}
                        className="rounded-md bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleRegistrations(event.id)}
                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        {expandedEvent === event.id
                          ? 'Hide Registrations'
                          : 'View Registrations'}
                      </button>
                    </div>
                  }
                >
                  {expandedEvent === event.id && (
                    <div className="mt-3 space-y-2 rounded-lg bg-slate-100 p-3 text-sm">
                      {registrations.length === 0 ? (
                        <div className="text-slate-600">
                          No registrations yet.
                        </div>
                      ) : (
                        registrations.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <span className="font-semibold text-slate-700">
                              {item.student_name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(item.created_at).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </EventCard>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">All Events</h2>
        {loading ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Loading events…
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No events available.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                badge={event.is_past ? 'Past' : undefined}
                children={
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created by</span>
                    <span className="font-semibold text-slate-700">
                      {event.created_by_name}
                    </span>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
