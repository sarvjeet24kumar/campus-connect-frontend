const isBrowser = () => typeof window !== 'undefined';

export const getAccessToken = () => {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem('refresh_token');
};

export const setTokens = (accessToken, refreshToken) => {
  if (isBrowser()) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  if (isBrowser()) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const tokenManager = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};

