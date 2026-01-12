import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Settings } from '../pages/Settings';

const renderSettings = () => {
  return render(
    <BrowserRouter>
      <Settings />
    </BrowserRouter>
  );
};

describe('Settings', () => {
  test('renders settings page', () => {
    renderSettings();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('changes theme setting', () => {
    renderSettings();
    
    const themeSelect = screen.getByLabelText('Theme');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    expect((themeSelect as HTMLSelectElement).value).toBe('dark');
  });

  test('toggles notifications', () => {
    renderSettings();
    
    const notificationsToggle = screen.getByText('Enable Notifications')
      .previousElementSibling as HTMLInputElement;
    
    const initialValue = notificationsToggle.checked;
    fireEvent.click(notificationsToggle);
    
    expect(notificationsToggle.checked).toBe(!initialValue);
  });

  test('toggles auto-refresh', () => {
    renderSettings();
    
    const autoRefreshToggle = screen.getByText('Auto-Refresh Data')
      .previousElementSibling as HTMLInputElement;
    
    fireEvent.click(autoRefreshToggle);
    
    // Refresh interval input should appear
    expect(screen.getByLabelText(/refresh interval/i)).toBeInTheDocument();
  });

  test('validates refresh interval', async () => {
    const user = userEvent.setup();
    renderSettings();
    
    // Enable auto-refresh
    const autoRefreshToggle = screen.getByText('Auto-Refresh Data')
      .previousElementSibling as HTMLInputElement;
    fireEvent.click(autoRefreshToggle);

    const intervalInput = screen.getByLabelText(/refresh interval/i);
    
    // Clear and enter invalid value
    await user.clear(intervalInput);
    await user.type(intervalInput, '5');
    
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/refresh interval must be at least 10 seconds/i)).toBeInTheDocument();
    });
  });

  test('validates max refresh interval', async () => {
    const user = userEvent.setup();
    renderSettings();
    
    const autoRefreshToggle = screen.getByText('Auto-Refresh Data')
      .previousElementSibling as HTMLInputElement;
    fireEvent.click(autoRefreshToggle);

    const intervalInput = screen.getByLabelText(/refresh interval/i);
    
    await user.clear(intervalInput);
    await user.type(intervalInput, '5000');
    
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/refresh interval cannot exceed 3600 seconds/i)).toBeInTheDocument();
    });
  });

  test('saves settings successfully', async () => {
    renderSettings();
    
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('resets to default settings', () => {
    renderSettings();
    
    // Change a setting
    const themeSelect = screen.getByLabelText('Theme');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    expect((themeSelect as HTMLSelectElement).value).toBe('dark');

    // Reset
    const resetButton = screen.getByText('Reset to Defaults');
    fireEvent.click(resetButton);

    expect((themeSelect as HTMLSelectElement).value).toBe('light');
  });

  test('changes timezone', () => {
    renderSettings();
    
    const timezoneSelect = screen.getByLabelText('Timezone');
    fireEvent.change(timezoneSelect, { target: { value: 'America/New_York' } });

    expect((timezoneSelect as HTMLSelectElement).value).toBe('America/New_York');
  });

  test('clears error when fixing validation', async () => {
    const user = userEvent.setup();
    renderSettings();
    
    const autoRefreshToggle = screen.getByText('Auto-Refresh Data')
      .previousElementSibling as HTMLInputElement;
    fireEvent.click(autoRefreshToggle);

    const intervalInput = screen.getByLabelText(/refresh interval/i);
    
    // Set invalid value
    await user.clear(intervalInput);
    await user.type(intervalInput, '5');
    
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/refresh interval must be at least 10 seconds/i)).toBeInTheDocument();
    });

    // Fix the value
    await user.clear(intervalInput);
    await user.type(intervalInput, '30');

    // Error should clear
    await waitFor(() => {
      expect(screen.queryByText(/refresh interval must be at least 10 seconds/i)).not.toBeInTheDocument();
    });
  });
});
