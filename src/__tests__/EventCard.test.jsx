import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventCard from '../components/EventCard.jsx';

describe('EventCard Component', () => {
  const mockEvent = {
    id: 'event-1',
    title: 'Test Event',
    description: 'This is a test event description',
    start_time: '2024-12-25T10:00:00Z',
    end_time: '2024-12-25T12:00:00Z',
    location_name: 'Hall A',
    available_seats: 50,
  };

  it('should render event title', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('should render event description', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('This is a test event description')).toBeInTheDocument();
  });

  it('should render location name', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Hall A')).toBeInTheDocument();
  });

  it('should render available seats', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should render badge when provided', () => {
    render(<EventCard event={mockEvent} badge="Registered" />);
    expect(screen.getByText('Registered')).toBeInTheDocument();
  });

  it('should not render badge when not provided', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.queryByText('Registered')).not.toBeInTheDocument();
  });

  it('should display "Full" when available_seats is 0', () => {
    const fullEvent = { ...mockEvent, available_seats: 0 };
    render(<EventCard event={fullEvent} />);
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('should render children content when provided', () => {
    render(
      <EventCard event={mockEvent}>
        <div>Child Content</div>
      </EventCard>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render actions when provided', () => {
    render(
      <EventCard event={mockEvent} actions={<button>Register</button>} />
    );
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should use location_display when location_name is not available', () => {
    const eventWithDisplay = {
      ...mockEvent,
      location_name: undefined,
      location_display: 'Auditorium',
    };
    render(<EventCard event={eventWithDisplay} />);
    expect(screen.getByText('Auditorium')).toBeInTheDocument();
  });
});

