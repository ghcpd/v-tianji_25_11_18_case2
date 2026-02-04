import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '../types';
import { fetchUsers } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import './UserManagement.css';

type SortField = 'name' | 'email' | 'role' | 'status' | 'lastLogin';
type SortDirection = 'asc' | 'desc';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user' | 'moderator'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastLogin':
          aValue = a.lastLogin;
          bValue = b.lastLogin;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(start, start + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.size === 0) return;
    alert(`Bulk action "${action}" performed on ${selectedUsers.size} user(s)`);
    setSelectedUsers(new Set());
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        {selectedUsers.size > 0 && (
          <div className="bulk-actions">
            <button
              className="btn btn-primary"
              onClick={() => handleBulkAction('Activate')}
            >
              Activate ({selectedUsers.size})
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleBulkAction('Deactivate')}
            >
              Deactivate ({selectedUsers.size})
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleBulkAction('Delete')}
            >
              Delete ({selectedUsers.size})
            </button>
          </div>
        )}
      </div>

      <div className="user-filters">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{ maxWidth: '300px' }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="input"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="input"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="input"
          style={{ width: 'auto', minWidth: '100px' }}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>

      <div className="user-content">
        <div className="user-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('role')}>
                  Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('lastLogin')}>
                  Last Login {sortField === 'lastLogin' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={selectedUsers.has(user.id) ? 'selected' : ''}
                  onClick={() => setSelectedUser(user)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-info`}>{user.role}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === 'active'
                          ? 'badge-success'
                          : user.status === 'inactive'
                          ? 'badge-warning'
                          : 'badge-error'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{format(user.lastLogin, 'MMM dd, yyyy HH:mm')}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedUsers.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              No users found matching your criteria.
            </div>
          )}

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of{' '}
            {filteredAndSortedUsers.length} users
          </div>
        </div>

        {selectedUser && (
          <div className="user-detail-panel">
            <div className="panel-header">
              <h3>User Details</h3>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedUser(null)}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                Close
              </button>
            </div>
            <div className="panel-content">
              <div className="detail-section">
                <h4>Profile Information</h4>
                <div className="detail-item">
                  <strong>Name:</strong> {selectedUser.name}
                </div>
                <div className="detail-item">
                  <strong>Username:</strong> {selectedUser.username}
                </div>
                <div className="detail-item">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="detail-item">
                  <strong>Role:</strong>{' '}
                  <span className="badge badge-info">{selectedUser.role}</span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`badge ${
                      selectedUser.status === 'active'
                        ? 'badge-success'
                        : selectedUser.status === 'inactive'
                        ? 'badge-warning'
                        : 'badge-error'
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Last Login:</strong>{' '}
                  {format(selectedUser.lastLogin, 'MMM dd, yyyy HH:mm:ss')}
                </div>
              </div>

              <div className="detail-section">
                <h4>Role Management</h4>
                <select
                  className="input"
                  value={selectedUser.role}
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value as User['role'],
                    });
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                </select>
                <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Update Role
                </button>
              </div>

              <div className="detail-section">
                <h4>Activity Logs</h4>
                <div className="activity-logs">
                  {selectedUser.activityLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="activity-log-item">
                      <div className="log-action">{log.action}</div>
                      <div className="log-time">
                        {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                      </div>
                      <div className="log-details">{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

