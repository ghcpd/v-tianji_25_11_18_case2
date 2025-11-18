import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../pages/Dashboard';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Dashboard', () => {
  const mockMetrics = {
    totalUsers: 100,
    activeUsers: 75,
    loginTrends: [
      { date: '2024-01-01', logins: 200 },
      { date: '2024-01-02', logins: 250 },
    ],
    featureUsage: [
      { feature: 'Dashboard', usage: 500 },
      { feature: 'Reports', usage: 300 },
    ],
    systemAlerts: [
      {
        id: 'alert-1',
        type: 'warning' as const,
        message: 'Test alert',
        timestamp: new Date(),
      },
    ],
  };

  beforeEach(() => {
    (api.fetchDashboardMetrics as jest.Mock).mockResolvedValue(mockMetrics);
  });

  it('renders loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays metrics', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('filters by date range', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    const dateSelect = screen.getByText(/date range/i).parentElement?.querySelector('select');
    expect(dateSelect).toBeInTheDocument();
    if (dateSelect) {
      await user.selectOptions(dateSelect, '7d');
      expect(dateSelect).toHaveValue('7d');
    }
  });

  it('filters by role', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    const roleSelect = screen.getByText(/^role$/i).parentElement?.querySelector('select');
    expect(roleSelect).toBeInTheDocument();
    if (roleSelect) {
      await user.selectOptions(roleSelect, 'admin');
      expect(roleSelect).toHaveValue('admin');
    }
  });

  it('displays error message on failure', async () => {
    (api.fetchDashboardMetrics as jest.Mock).mockRejectedValue(new Error('Failed to load'));
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

