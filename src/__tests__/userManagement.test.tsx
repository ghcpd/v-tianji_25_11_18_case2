import React from 'react';
import userEvent from '@testing-library/user-event';
import UserManagement from '../pages/UserManagement';
import { renderWithProviders, screen } from '../test-utils';

describe('UserManagement', () => {
  it('filters the list via search and toggles pagination', () => {
    renderWithProviders(<UserManagement />);
    const search = screen.getByPlaceholderText(/search by name, email, or username/i);
    userEvent.type(search, 'Avery');
    const row = screen.getByText(/avery cheng/i);
    expect(row).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByRole('button', { name: '2' })).toHaveClass('active');
  });

  it('selects all rows on the page and tracks selection count', () => {
    renderWithProviders(<UserManagement />);
    userEvent.click(screen.getByRole('button', { name: /select page/i }));
    expect(screen.getByRole('button', { name: /clear selection/i })).toBeInTheDocument();
    expect(screen.getByText(/15 users selected/i)).toBeInTheDocument();
  });
});
