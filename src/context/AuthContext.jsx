import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { tokenManager } from '../api/tokenManager.js';
import {
  fetchCurrentUser as fetchCurrentUserApi,
  login as loginApi,
  logout as logoutApi,
} from '../api/auth.api.js';

const initialState = {
  user: null,
  roles: [],
  loading: true,
  sessionExpired: false,
  processing: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        roles: action.payload.roles || [],
        loading: false,
        sessionExpired: false,
        processing: false,
      };

    case 'SET_PROCESSING':
      return { ...state, processing: action.payload };

    case 'SET_SESSION_EXPIRED':
      return { ...state, sessionExpired: action.payload };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        roles: [],
        sessionExpired: false,
        processing: false,
      };

    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        roles: [],
      };

    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    tokenManager.clearTokens();
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  const fetchCurrentUser = async () => {
    try {
      const data = await fetchCurrentUserApi();
      dispatch({
        type: 'SET_USER',
        payload: {
          user: data.user,
          roles: data.roles || [],
        },
      });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch({ type: 'CLEAR_USER' });
        tokenManager.clearTokens();
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      fetchCurrentUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async ({ username, password }) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    const payload = { username, password };

    try {
      const data = await loginApi(payload);

      if (data) {
        tokenManager.setTokens(data.access_token, data.refresh_token);

        dispatch({
          type: 'SET_USER',
          payload: {
            user: data.user,
            roles: data.user?.roles || [],
          },
        });
      }

      const result = {
        ...data,
        roles: data.user?.roles || [],
      };

      return result;
    } catch (error) {
      dispatch({ type: 'SET_PROCESSING', payload: false });

      console.log('Login error:', error);
      if (
        error.message &&
        (error.message.includes('access required') ||
          error.message.includes('privileges'))
      ) {
        throw error;
      }

      if (!error.response) {
        throw new Error(
          'Cannot connect to server. Please make sure Django server is running on port 8000.'
        );
      }
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await logoutApi(refreshToken);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Logout error:', error);

      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      clearSession();
      navigate('/', { replace: true });
    }
  };

  const forceLogout = useCallback(() => {
    clearSession();
    navigate('/', { replace: true });
  }, [clearSession, navigate]);

  useEffect(() => {
    const handlePopState = () => {
      const token = tokenManager.getAccessToken();
      if (token) {
        forceLogout();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [forceLogout]);

  const isAuthenticated = Boolean(state.user);

  const value = {
    user: state.user,
    roles: state.roles,
    isAuthenticated,
    loading: state.loading,
    processing: state.processing,
    sessionExpired: state.sessionExpired,

    login,
    logout,
    forceLogout,
    refreshUser: fetchCurrentUser,
    clearSessionExpired: () =>
      dispatch({ type: 'SET_SESSION_EXPIRED', payload: false }),

    isAdmin:
      state.roles.includes('admin') || state.roles.includes('super_admin'),
    isSuperAdmin: state.roles.includes('super_admin'),
    isStudent: state.roles.includes('student'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
