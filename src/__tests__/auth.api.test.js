import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchCurrentUser, login, logout } from '../api/auth.api.js';

vi.mock('axios');
vi.mock('../api/httpClient.js', () => ({
  createHttpClient: () => axios,
}));

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch current user', async () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
    };
    axios.get.mockResolvedValue({ data: mockUser });

    const result = await fetchCurrentUser();

    expect(axios.get).toHaveBeenCalledWith('/auth/current-user/');
    expect(result).toEqual(mockUser);
  });

  it('should login user', async () => {
    const loginData = {
      username: 'testuser',
      password: 'password123',
    };
    const mockResponse = {
      message: 'Login successful',
      user: { id: 'user-123', username: 'testuser' },
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    };
    axios.post.mockResolvedValue({ data: mockResponse });

    const result = await login(loginData);

    expect(axios.post).toHaveBeenCalledWith('/auth/login/', loginData);
    expect(result).toEqual(mockResponse);
  });

  it('should logout user', async () => {
    const refreshToken = 'refresh-token-123';
    const mockResponse = { message: 'Logout successful' };
    axios.post.mockResolvedValue({ data: mockResponse });

    const result = await logout(refreshToken);

    expect(axios.post).toHaveBeenCalledWith('/auth/logout/', {
      refresh: refreshToken,
    });
    expect(result).toEqual(mockResponse);
  });
});

