import React from 'react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import Settings from '../pages/Settings';
import { renderWithProviders, screen, waitFor } from '../test-utils';

describe('Settings page', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows validation when timezone is empty', async () => {
    renderWithProviders(<Settings />);
    const timezoneInput = screen.getByPlaceholderText('UTC');
    await userEvent.clear(timezoneInput);
    userEvent.click(screen.getByRole('button', { name: /save preferences/i }));
    expect(screen.getByText(/timezone is required/i)).toBeInTheDocument();
  });

  it('saves preferences asynchronously', async () => {
    jest.useFakeTimers();
    renderWithProviders(<Settings />);
    const timezoneInput = screen.getByPlaceholderText('UTC');
    await userEvent.clear(timezoneInput);
    await userEvent.type(timezoneInput, 'Asia/Tokyo');

    await waitFor(() => expect(timezoneInput).toHaveValue('Asia/Tokyo'));
    userEvent.click(screen.getByRole('button', { name: /save preferences/i }));
    await act(async () => {
      jest.advanceTimersByTime(750);
    });

    const savedMessage = await screen.findByText(/settings saved successfully/i);
    expect(savedMessage).toBeInTheDocument();
  });
});
