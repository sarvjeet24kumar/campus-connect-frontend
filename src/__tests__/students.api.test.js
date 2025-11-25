import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  signupStudent,
  getMyRegistrations,
  registerForEvent,
  unregisterFromEvent,
} from '../api/students.api.js';

vi.mock('axios');
vi.mock('../api/httpClient.js', () => ({
  createHttpClient: () => axios,
}));

describe('Students API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should signup student', async () => {
    const signupData = {
      username: 'newstudent',
      email: 'newstudent@example.com',
      password: 'password123',
    };
    const mockResponse = { message: 'Signup successful. Please login.' };
    axios.post.mockResolvedValue({ data: mockResponse });

    const result = await signupStudent(signupData);

    expect(axios.post).toHaveBeenCalledWith('/auth/signup/', signupData);
    expect(result).toEqual(mockResponse);
  });

  it('should get my registrations', async () => {
    const mockRegistrations = [
      {
        id: '1',
        event: { id: 'event-1', title: 'Event 1' },
        status: 'registered',
        created_at: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        event: { id: 'event-2', title: 'Event 2' },
        status: 'registered',
        created_at: '2024-01-02T10:00:00Z',
      },
    ];
    axios.get.mockResolvedValue({ data: mockRegistrations });

    const result = await getMyRegistrations();

    expect(axios.get).toHaveBeenCalledWith('/events/registrations/my_registrations/');
    expect(result).toEqual(mockRegistrations);
  });

  it('should register for event', async () => {
    const eventId = 'event-123';
    const mockResponse = {
      id: 'registration-1',
      event: eventId,
      student: 'student-123',
      status: 'registered',
    };
    axios.post.mockResolvedValue({ data: mockResponse });

    const result = await registerForEvent(eventId);

    expect(axios.post).toHaveBeenCalledWith('/events/registrations/', {
      event: eventId,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should unregister from event', async () => {
    const registrationId = 'registration-123';
    const mockResponse = { message: 'Successfully unregistered from event' };
    axios.post.mockResolvedValue({ data: mockResponse });

    const result = await unregisterFromEvent(registrationId);

    expect(axios.post).toHaveBeenCalledWith(
      `/events/registrations/${registrationId}/unregister/`
    );
    expect(result).toEqual(mockResponse);
  });
});

