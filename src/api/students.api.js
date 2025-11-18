import { createHttpClient } from './httpClient.js';

const studentsClient = createHttpClient();

export const signupStudent = async (payload) => {
  const response = await studentsClient.post('/auth/signup/', payload);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await studentsClient.get('/events/registrations/my_registrations/');
  return response.data;
};

export const registerForEvent = async (eventId) => {
  const response = await studentsClient.post('/events/registrations/', { event: eventId });
  return response.data;
};

export const unregisterFromEvent = async (registrationId) => {
  const response = await studentsClient.post(`/events/registrations/${registrationId}/unregister/`);
  return response.data;
};

export default {
  signupStudent,
  getMyRegistrations,
  registerForEvent,
  unregisterFromEvent,
};

