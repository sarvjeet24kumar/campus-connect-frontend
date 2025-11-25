import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import { getEvents } from '../api/events.api.js';
import { useAuth } from '../context/AuthContext.jsx';

vi.mock('../api/events.api.js');
vi.mock('../context/AuthContext.jsx');

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
      roles: [],
    });
  });

  it('should render welcome message', () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to Campus Connect')).toBeInTheDocument();
  });

  it('should render login button', () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should render signup button', () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Signup as Student')).toBeInTheDocument();
  });

  it('should render "How It Works" section', () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('should render upcoming events section', () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('should render past events section', () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Past Events')).toBeInTheDocument();
  });


  it('should display empty state when no upcoming events', async () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No upcoming events right now.')).toBeInTheDocument();
    });
  });

  it('should display empty state when no past events', async () => {
    getEvents.mockResolvedValueOnce([]);
    getEvents.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No past events yet.')).toBeInTheDocument();
    });
  });
});

