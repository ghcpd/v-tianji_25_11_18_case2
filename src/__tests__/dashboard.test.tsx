import React from 'react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../pages/Dashboard';
import { renderWithProviders, screen } from '../test-utils';

describe('Dashboard', () => {
  it('finishes loading and reveals user coverage', async () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('User Coverage')).toBeInTheDocument();

    const coverageText = await screen.findByText(/users matching current filters/i, { timeout: 2000 });
    expect(coverageText).toBeInTheDocument();
  });

  it('allows filters to change and preserves state', async () => {
    renderWithProviders(<Dashboard />);
    const roleSelect = screen.getByLabelText('Role');
    userEvent.selectOptions(roleSelect, 'Admin');

    await screen.findByText(/users matching current filters/i, { timeout: 2000 });
    expect(roleSelect).toHaveValue('Admin');
  });
});
