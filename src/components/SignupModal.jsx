import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { signupStudent } from '../api/students.api.js';
import Alert from './Alert.jsx';
import { Eye, EyeOff } from 'lucide-react';

const SignupModal = ({ isOpen, onClose }) => {
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [signupProcessing, setSignupProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleChange = event => {
    const { name, value } = event.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const submitSignup = async event => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSignupProcessing(true);
    try {
      await signupStudent(signupData);
      setMessage('Signup successful! Redirecting to login...');
      setSignupData({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
      });

      setTimeout(() => {
        onClose();

        window.dispatchEvent(
          new CustomEvent('showLogin', { detail: { isAdmin: false } })
        );
      }, 1500);
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server.');
        return;
      }
      const detail = err.response?.data;
      if (detail && typeof detail === 'object') {
        const firstError = Object.values(detail).flat()[0];
        setError(firstError || 'Signup failed.');
      } else {
        setError('Signup failed. Please check your information.');
      }
    } finally {
      setSignupProcessing(false);
    }
  };

  if (!isOpen) return null;

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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Student Signup
          </h2>
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

        <form onSubmit={submitSignup} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Username *
              <input
                required
                name="username"
                value={signupData.username}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="student01"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Email *
              <input
                required
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="student@example.com"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              First Name *
              <input
                name="first_name"
                value={signupData.first_name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="John"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Last Name *
              <input
                name="last_name"
                value={signupData.last_name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="Doe"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password *
              <div className="flex justify-between mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full focus:outline-none focus:ring-0 focus:border-transparent"
                  minLength={8}
                  value={signupData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                />

                {showPassword ? (
                  <EyeOff onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <Eye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Confirm Password *
              <div className="flex justify-between mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                <input
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirm"
                  className="w-full focus:outline-none focus:ring-0 focus:border-transparent"
                  minLength={8}
                  value={signupData.password_confirm}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                />
                {showConfirmPassword ? (
                  <EyeOff
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <Eye
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
              </div>
            </label>
          </div>
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
              disabled={signupProcessing}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                signupProcessing
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {signupProcessing ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SignupModal;
