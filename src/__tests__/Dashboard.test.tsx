import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';

// Mock the chart library
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>
}));

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  test('shows loading spinner initially', () => {
    renderDashboard();
    expect(screen.getByText(/loading dashboard data/i)).toBeInTheDocument();
  });

  test('renders dashboard with data after loading', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading dashboard data/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Logins')).toBeInTheDocument();
    expect(screen.getByText('New Signups')).toBeInTheDocument();
  });

  test('updates data when date range changes', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading dashboard data/i)).not.toBeInTheDocument();
    });

    const select = screen.getByLabelText(/date range/i);
    fireEvent.change(select, { target: { value: '7' } });

    await waitFor(() => {
      expect(screen.getByText(/refreshing data/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText(/refreshing data/i)).not.toBeInTheDocument();
    });
  });

  test('renders all stat cards', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Total Logins')).toBeInTheDocument();
    });

    expect(screen.getByText('New Signups')).toBeInTheDocument();
    expect(screen.getByText('Avg Active Users')).toBeInTheDocument();
    expect(screen.getByText('Active Today')).toBeInTheDocument();
  });

  test('renders charts', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('User Activity Trends')).toBeInTheDocument();
    });

    expect(screen.getByText('Feature Usage')).toBeInTheDocument();
    expect(screen.getByText('Feature Distribution')).toBeInTheDocument();
    expect(screen.getByText('System Alerts')).toBeInTheDocument();
  });
});
