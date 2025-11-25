import { createHttpClient } from './httpClient.js';

const eventsClient = createHttpClient();

export const getEvents = async (params = {}) => {
  const response = await eventsClient.get(
    '/events/',
    Object.keys(params).length ? { params } : undefined
  );
  return response.data;
};

export const getEventLocations = async () => {
  const response = await eventsClient.get('/events/locations/');
  return response.data;
};

export const createEvent = async payload => {
  const response = await eventsClient.post('/events/', payload);
  return response.data;
};

export const updateEvent = async (eventId, payload) => {
  const response = await eventsClient.put(`/events/${eventId}/`, payload);
  return response.data;
};

export const softDeleteEvent = async eventId => {
  const response = await eventsClient.delete(`/events/${eventId}/`);
  // const response = await eventsClient.delete(`/events/${eventId}/soft_delete/`);
  return response.data;
};

export const getEventRegistrations = async eventId => {
  const response = await eventsClient.get(`/events/${eventId}/registrations/`);
  return response.data;
};

export default {
  getEvents,
  getEventLocations,
  createEvent,
  updateEvent,
  softDeleteEvent,
  getEventRegistrations,
};
