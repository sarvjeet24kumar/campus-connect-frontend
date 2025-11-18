import { createHttpClient } from './httpClient.js';
import { tokenManager } from './tokenManager.js';

const authClient = createHttpClient();


export const fetchCurrentUser = async () => {
  const response = await authClient.get('/auth/current-user/');
  return response.data;
};

export const login = async (payload) => {
  const response = await authClient.post('/auth/login/', payload);
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await authClient.post('/auth/logout/', { refresh: refreshToken });
  return response.data;
};

export { tokenManager };

export default {
  fetchCurrentUser,
  login,
  logout,
  tokenManager,
};

