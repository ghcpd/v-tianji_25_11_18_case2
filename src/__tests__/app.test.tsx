import React from 'react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithProviders, screen } from '../test-utils';

describe('App routing', () => {
  it('navigates between pages via sidebar', async () => {
    renderWithProviders(<App />);
    userEvent.click(screen.getByText('Reports'));
    await screen.findByRole('heading', { name: /reports/i });
    userEvent.click(screen.getByText('Settings'));
    await screen.findByRole('heading', { name: /settings/i });
  });
});
