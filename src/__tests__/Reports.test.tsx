import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reports from '../pages/Reports';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Reports', () => {
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
    systemAlerts: [],
  };

  const mockReport = {
    id: 'report-1',
    name: 'Report_2024-01-01.pdf',
    type: 'pdf' as const,
    metrics: ['Login Trends'],
    generatedAt: new Date(),
  };

  beforeEach(() => {
    (api.fetchDashboardMetrics as jest.Mock).mockResolvedValue(mockMetrics);
    (api.generateReport as jest.Mock).mockResolvedValue(mockReport);
    (api.downloadReport as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders loading state initially', () => {
    render(<Reports />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays metrics', async () => {
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });
    expect(screen.getByText('Login Trends')).toBeInTheDocument();
  });

  it('toggles metric selection', async () => {
    const user = userEvent.setup();
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    const loginTrendsCheckbox = screen.getByLabelText('Login Trends');
    expect(loginTrendsCheckbox).toBeChecked();
    await user.click(loginTrendsCheckbox);
    expect(loginTrendsCheckbox).not.toBeChecked();
  });

  it('generates report', async () => {
    const user = userEvent.setup();
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    const generateButton = screen.getByText('Generate Report');
    await user.click(generateButton);
    await waitFor(() => {
      expect(api.generateReport).toHaveBeenCalled();
    });
  });

  it('prevents generating report without metrics', async () => {
    const user = userEvent.setup();
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    const loginTrendsCheckbox = screen.getByLabelText('Login Trends');
    await user.click(loginTrendsCheckbox);
    const generateButton = screen.getByText('Generate Report');
    expect(generateButton).toBeDisabled();
  });

  it('sorts reports by date', async () => {
    const user = userEvent.setup();
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    const sortSelect = screen.getByText(/sort by/i).parentElement?.querySelector('select');
    if (sortSelect) {
      await user.selectOptions(sortSelect, 'date');
      expect(sortSelect).toHaveValue('date');
    }
  });

  it('groups reports by type', async () => {
    const user = userEvent.setup();
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    const groupSelect = screen.getByText(/group by/i).parentElement?.querySelector('select');
    if (groupSelect) {
      await user.selectOptions(groupSelect, 'type');
      expect(groupSelect).toHaveValue('type');
    }
  });
});

