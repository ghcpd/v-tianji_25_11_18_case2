import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Pagination } from '../components/Pagination';
import { Spinner } from '../components/Spinner';
import { generateUsers, fetchWithDelay } from '../utils/mockData';
import { User } from '../types';
import { formatDate, formatRelativeTime, debounce } from '../utils/helpers';
import './UserManagement.css';

const ITEMS_PER_PAGE = 10;

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchWithDelay(generateUsers(100), 800);
      setUsers(data);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key as keyof User);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const newSelected = new Set(filteredAndSortedUsers.map(u => u.id));
      setSelectedUserIds(newSelected);
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUserIds(newSelected);
  };

  const handleBulkAction = async (action: string) => {
    setActionLoading(true);
    await fetchWithDelay(null, 1000);
    alert(`${action} applied to ${selectedUserIds.size} user(s)`);
    setSelectedUserIds(new Set());
    setActionLoading(false);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  // Memoized filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortKey, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedUsers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handleSearchChange = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  if (loading) {
    return (
      <div className="user-management-loading">
        <Spinner size="large" />
        <p>Loading users...</p>
      </div>
    );
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (user: User) => (
        <button
          className="user-name-link"
          onClick={() => handleViewUser(user)}
        >
          {user.name}
        </button>
      )
    },
    { key: 'username', header: 'Username', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (user: User) => (
        <span className={`role-badge role-${user.role}`}>{user.role}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (user: User) => (
        <span className={`status-badge status-${user.status}`}>{user.status}</span>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortable: true,
      render: (user: User) => formatRelativeTime(user.lastLogin)
    }
  ];

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>User Management</h1>
      </div>

      <Card>
        <div className="user-management-controls">
          <Input
            placeholder="Search by name, email, or username..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' },
              { value: 'moderator', label: 'Moderator' }
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' }
            ]}
          />
        </div>

        {selectedUserIds.size > 0 && (
          <div className="bulk-actions">
            <span>{selectedUserIds.size} user(s) selected</span>
            <div className="bulk-actions-buttons">
              <Button
                size="small"
                variant="primary"
                onClick={() => handleBulkAction('Activate')}
                disabled={actionLoading}
              >
                Activate
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={() => handleBulkAction('Deactivate')}
                disabled={actionLoading}
              >
                Deactivate
              </Button>
              <Button
                size="small"
                variant="danger"
                onClick={() => handleBulkAction('Delete')}
                disabled={actionLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        <Table
          data={paginatedUsers}
          columns={columns}
          keyExtractor={(user) => user.id}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          selectedIds={selectedUserIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
        />

        {filteredAndSortedUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredAndSortedUsers.length}
          />
        )}
      </Card>

      {selectedUser && (
        <div className="user-detail-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="user-detail-header">
              <h2>User Details</h2>
              <button
                className="close-button"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>
            <div className="user-detail-content">
              <div className="user-detail-section">
                <h3>Profile Information</h3>
                <div className="user-detail-grid">
                  <div className="user-detail-item">
                    <strong>Name:</strong> {selectedUser.name}
                  </div>
                  <div className="user-detail-item">
                    <strong>Username:</strong> {selectedUser.username}
                  </div>
                  <div className="user-detail-item">
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div className="user-detail-item">
                    <strong>Role:</strong>{' '}
                    <span className={`role-badge role-${selectedUser.role}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="user-detail-item">
                    <strong>Status:</strong>{' '}
                    <span className={`status-badge status-${selectedUser.status}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="user-detail-item">
                    <strong>Last Login:</strong> {formatDate(selectedUser.lastLogin)}
                  </div>
                </div>
              </div>

              <div className="user-detail-section">
                <h3>Activity Logs</h3>
                <div className="activity-logs">
                  {selectedUser.activityLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="activity-log-item">
                      <div className="activity-log-action">{log.action}</div>
                      <div className="activity-log-time">
                        {formatRelativeTime(log.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
