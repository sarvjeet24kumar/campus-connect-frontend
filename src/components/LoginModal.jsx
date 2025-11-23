import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import Alert from './Alert.jsx';
import LoginOverlay from './LoginOverlay.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, user, roles, loading, processing } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setShowLoginOverlay(false);
      setError(null);
      setPendingNavigation(null);
    } else {
      setShowLoginOverlay(false);
      setError(null);
      setLoginData({ username: '', password: '' });
      setPendingNavigation(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = event => {
      if (event.key === 'Escape' && !showLoginOverlay) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showLoginOverlay]);

  useEffect(() => {
    if (pendingNavigation && !loading && roles && roles.length > 0) {
      const userRoles = roles;

      setPendingNavigation(null);

      if (userRoles.includes('admin') || userRoles.includes('super_admin')) {
        navigate('/admin', { replace: true });
      } else if (userRoles.includes('student')) {
        navigate('/student', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [roles, loading, pendingNavigation, navigate]);

  const handleChange = event => {
    const { name, value } = event.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const submitLogin = async event => {
    event.preventDefault();
    setError(null);
    setShowLoginOverlay(true);
    try {
      await login({ ...loginData });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowLoginOverlay(false);
      onClose();

      setPendingNavigation(true);
    } catch (err) {
      setShowLoginOverlay(false);
      if (err.message && err.message.includes('connect')) {
        setError('Cannot connect to server.');
        return;
      }

      const detail = err.response?.data;
      console.log('Login error detail:', detail);

      if (detail?.error) {
        setError(detail.error);
      } else if (detail && typeof detail === 'object') {
        const firstError = Object.values(detail).flat()[0];
        setError(firstError || 'Login failed.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  if (!isOpen) return null;

  if (showLoginOverlay) {
    return <LoginOverlay />;
  }

  const modalContent = (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">User Login</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={submitLogin} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Username
            <input
              required
              name="username"
              value={loginData.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              required
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                processing
                  ? 'bg-emerald-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {processing ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LoginModal;
