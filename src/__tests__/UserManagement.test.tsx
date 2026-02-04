import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserManagement from '../pages/UserManagement';
import * as api from '../services/api';

jest.mock('../services/api');

describe('UserManagement', () => {
  const mockUsers = [
    {
      id: 'user-1',
      name: 'John Doe',
      username: 'john.doe',
      email: 'john@example.com',
      role: 'admin' as const,
      status: 'active' as const,
      lastLogin: new Date('2024-01-01'),
      activityLogs: [],
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      username: 'jane.smith',
      email: 'jane@example.com',
      role: 'user' as const,
      status: 'inactive' as const,
      lastLogin: new Date('2024-01-02'),
      activityLogs: [],
    },
  ];

  beforeEach(() => {
    (api.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('renders loading state initially', () => {
    render(<UserManagement />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays users', async () => {
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('searches users by name', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search users/i);
    await user.type(searchInput, 'John');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('filters by role', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const roleSelects = screen.getAllByText(/role/i);
    const roleSelect = roleSelects[0].parentElement?.querySelector('select');
    if (roleSelect) {
      await user.selectOptions(roleSelect, 'admin');
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    }
  });

  it('sorts users by name', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const nameHeader = screen.getByText(/name/i);
    await user.click(nameHeader);
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Jane Smith');
  });

  it('selects and deselects users', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    const firstUserCheckbox = checkboxes[1];
    await user.click(firstUserCheckbox);
    expect(firstUserCheckbox).toBeChecked();
  });

  it('paginates users', async () => {
    const manyUsers = Array.from({ length: 25 }, (_, i) => ({
      id: `user-${i}`,
      name: `User ${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      role: 'user' as const,
      status: 'active' as const,
      lastLogin: new Date(),
      activityLogs: [],
    }));

    (api.fetchUsers as jest.Mock).mockResolvedValue(manyUsers);
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('User 0')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText('User 10')).toBeInTheDocument();
    });
  });

  it('displays user detail panel on click', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButton = screen.getAllByText('View')[0];
    await user.click(viewButton);
    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });
  });
});

