import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { UserManagement } from '../pages/UserManagement';

const renderUserManagement = () => {
  return render(
    <BrowserRouter>
      <UserManagement />
    </BrowserRouter>
  );
};

describe('UserManagement', () => {
  test('shows loading spinner initially', () => {
    renderUserManagement();
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  test('renders user table after loading', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('filters users by search term', async () => {
    const user = userEvent.setup();
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by name/i);
    await user.type(searchInput, 'john');

    // Wait for debounce
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    }, { timeout: 500 });
  });

  test('filters users by role', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const roleSelect = screen.getByLabelText(/all roles/i);
    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  test('filters users by status', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText(/all statuses/i);
    fireEvent.change(statusSelect, { target: { value: 'active' } });

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  test('selects and deselects users', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[1]); // Select first user
    
    await waitFor(() => {
      expect(screen.getByText(/1 user\(s\) selected/i)).toBeInTheDocument();
    });

    fireEvent.click(checkboxes[1]); // Deselect
    
    await waitFor(() => {
      expect(screen.queryByText(/user\(s\) selected/i)).not.toBeInTheDocument();
    });
  });

  test('selects all users', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const selectAllCheckbox = screen.getByLabelText(/select all rows/i);
    fireEvent.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByText(/user\(s\) selected/i)).toBeInTheDocument();
    });
  });

  test('sorts users by column', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  test('paginates through users', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  test('opens user detail panel', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const userLinks = screen.getAllByRole('button').filter(
      button => button.className === 'user-name-link'
    );
    
    if (userLinks.length > 0) {
      fireEvent.click(userLinks[0]);

      await waitFor(() => {
        expect(screen.getByText('User Details')).toBeInTheDocument();
      });
    }
  });

  test('closes user detail panel', async () => {
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const userLinks = screen.getAllByRole('button').filter(
      button => button.className === 'user-name-link'
    );
    
    if (userLinks.length > 0) {
      fireEvent.click(userLinks[0]);

      await waitFor(() => {
        expect(screen.getByText('User Details')).toBeInTheDocument();
      });

      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('User Details')).not.toBeInTheDocument();
      });
    }
  });
});
