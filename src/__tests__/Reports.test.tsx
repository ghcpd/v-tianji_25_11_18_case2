import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Reports } from '../pages/Reports';

// Mock recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>
}));

const renderReports = () => {
  return render(
    <BrowserRouter>
      <Reports />
    </BrowserRouter>
  );
};

describe('Reports', () => {
  test('renders reports page', () => {
    renderReports();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Report Configuration')).toBeInTheDocument();
  });

  test('toggles metric selection', () => {
    renderReports();
    
    const loginsCheckbox = screen.getByLabelText('Logins') as HTMLInputElement;
    expect(loginsCheckbox.checked).toBe(true);

    fireEvent.click(loginsCheckbox);
    expect(loginsCheckbox.checked).toBe(false);

    fireEvent.click(loginsCheckbox);
    expect(loginsCheckbox.checked).toBe(true);
  });

  test('changes date range', () => {
    renderReports();
    
    const dateRangeSelect = screen.getByLabelText(/date range/i);
    fireEvent.change(dateRangeSelect, { target: { value: '60' } });

    expect((dateRangeSelect as HTMLSelectElement).value).toBe('60');
  });

  test('changes grouping', () => {
    renderReports();
    
    const groupBySelect = screen.getByLabelText(/group by/i);
    fireEvent.change(groupBySelect, { target: { value: 'week' } });

    expect((groupBySelect as HTMLSelectElement).value).toBe('week');
  });

  test('changes chart type', () => {
    renderReports();
    
    const chartTypeSelect = screen.getByLabelText(/chart type/i);
    fireEvent.change(chartTypeSelect, { target: { value: 'bar' } });

    expect((chartTypeSelect as HTMLSelectElement).value).toBe('bar');
  });

  test('download CSV button works', async () => {
    renderReports();
    
    const downloadButton = screen.getByText('Download CSV');
    expect(downloadButton).not.toBeDisabled();

    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Download CSV')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('download PDF button shows alert', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderReports();
    
    const downloadButton = screen.getByText('Download PDF');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    }, { timeout: 2000 });

    alertMock.mockRestore();
  });

  test('disables download buttons when no metrics selected', () => {
    renderReports();
    
    // Uncheck all metrics
    const loginsCheckbox = screen.getByLabelText('Logins');
    const signupsCheckbox = screen.getByLabelText('Signups');
    const activeUsersCheckbox = screen.getByLabelText('Active Users');

    fireEvent.click(loginsCheckbox);
    fireEvent.click(activeUsersCheckbox);

    const downloadCSVButton = screen.getByText('Download CSV');
    const downloadPDFButton = screen.getByText('Download PDF');

    expect(downloadCSVButton).toBeDisabled();
    expect(downloadPDFButton).toBeDisabled();
  });

  test('renders data table', () => {
    renderReports();
    expect(screen.getByText('Data Table')).toBeInTheDocument();
    expect(screen.getAllByRole('table').length).toBeGreaterThan(0);
  });

  test('renders feature usage summary', () => {
    renderReports();
    expect(screen.getByText('Feature Usage Summary')).toBeInTheDocument();
  });
});
