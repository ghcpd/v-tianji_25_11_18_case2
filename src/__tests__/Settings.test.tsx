import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../pages/Settings';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Settings', () => {
  const mockSettings = {
    theme: 'light' as const,
    notifications: true,
    emailReports: false,
    defaultRole: 'user' as const,
    itemsPerPage: 10,
    autoRefresh: false,
  };

  beforeEach(() => {
    (api.fetchSettings as jest.Mock).mockResolvedValue(mockSettings);
    (api.saveSettings as jest.Mock).mockResolvedValue(mockSettings);
  });

  it('renders loading state initially', () => {
    render(<Settings />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays settings', async () => {
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('light')).toBeInTheDocument();
  });

  it('updates theme setting', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    const themeSelect = screen.getByText(/^theme$/i).parentElement?.querySelector('select');
    if (themeSelect) {
      await user.selectOptions(themeSelect, 'dark');
      expect(themeSelect).toHaveValue('dark');
    }
  });

  it('toggles notification setting', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    const notificationsToggle = screen.getByText(/enable notifications/i).closest('label')?.querySelector('input');
    if (notificationsToggle) {
      expect(notificationsToggle).toBeChecked();
      await user.click(notificationsToggle);
      expect(notificationsToggle).not.toBeChecked();
    }
  });

  it('validates items per page', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    const itemsInput = screen.getByText(/items per page/i).parentElement?.querySelector('input');
    if (itemsInput) {
      await user.clear(itemsInput);
      await user.type(itemsInput, '200');
      await waitFor(() => {
        expect(screen.getByText(/must be between/i)).toBeInTheDocument();
      });
    }
  });

  it('saves settings', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Settings');
    await user.click(saveButton);
    await waitFor(() => {
      expect(api.saveSettings).toHaveBeenCalled();
    });
  });

  it('displays success message after saving', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Settings');
    await user.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
    });
  });

  it('prevents saving with validation errors', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    const itemsInput = screen.getByText(/items per page/i).parentElement?.querySelector('input');
    if (itemsInput) {
      await user.clear(itemsInput);
      await user.type(itemsInput, '200');
      await waitFor(() => {
        const saveButton = screen.getByText('Save Settings');
        expect(saveButton).toBeDisabled();
      });
    }
  });
});

