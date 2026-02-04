import React from 'react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import Reports from '../pages/Reports';
import { renderWithProviders, screen } from '../test-utils';

describe('Reports page', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows grouped data sorted by group when requested', () => {
    renderWithProviders(<Reports />);
    const sortSelect = screen.getByLabelText('Sort by');
    userEvent.selectOptions(sortSelect, 'group');
    const firstGroup = screen.getAllByRole('row')[1];
    expect(firstGroup).toHaveTextContent(/admin/i);
  });

  it('simulates report generation and displays status', async () => {
    jest.useFakeTimers();
    renderWithProviders(<Reports />);
    const pdfButton = screen.getByRole('button', { name: /download pdf/i });
    userEvent.click(pdfButton);
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeDisabled();

    await act(async () => {
      jest.advanceTimersByTime(950);
    });

    const status = await screen.findByText(/report ready/i);
    expect(status).toBeInTheDocument();
  });
});
