import React, { useEffect, useState } from 'react';
import { UserProfile, users } from '../data/fakeData';
import { useAppState } from '../context/AppStateContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

const rowsPerPage = 15;

const UserManagement: React.FC = () => {
  const { selectedUsers, toggleSelection, selectRange, clearSelection } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Admin' | 'Analyst' | 'Support' | 'Manager'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'pending'>('active');
  const [sortKey, setSortKey] = useState<'name' | 'lastLogin'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>(users);

  useEffect(() => {
    setLoading(true);
    const execute = () => {
      const next = users
        .filter((user) => {
          const matchesRole = roleFilter === 'all' || user.role === roleFilter;
          const matchesStatus = user.status === statusFilter;
          const matchesTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesRole && matchesStatus && matchesTerm;
        })
        .sort((a, b) => {
          const base = sortKey === 'name'
            ? a.name.localeCompare(b.name)
            : new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
          return sortDir === 'asc' ? base : -base;
        });
      setFilteredUsers(next);
      setLoading(false);
      setPage(1);
    };

    if (process.env.NODE_ENV === 'test') {
      execute();
      return;
    }

    const timer = setTimeout(() => {
      execute();
    }, 320);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(Math.ceil(filteredUsers.length / rowsPerPage), 1);
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const activeUserId = selectedUsers[0] ?? paginatedUsers[0]?.id;
  const activeUser = users.find((user) => user.id === activeUserId);

  const toggleSort = (key: 'name' | 'lastLogin') => {
    if (sortKey === key) {
      setSortDir((prev: 'asc' | 'desc') => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleBulkSelect = () => {
    if (paginatedUsers.length === selectedUsers.length) {
      clearSelection();
    } else {
      selectRange(paginatedUsers.map((user) => user.id));
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <div className="section-card">
        <div className="filter-panel">
          <label>
            Search
            <input
              type="search"
              value={searchTerm}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
              placeholder="Search by name, email, or username"
            />
          </label>
          <label>
            Role
            <select value={roleFilter} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setRoleFilter(event.target.value as typeof roleFilter)}>
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
              <option value="Support">Support</option>
              <option value="Manager">Manager</option>
            </select>
          </label>
          <label>
            Status
            <select value={statusFilter} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(event.target.value as typeof statusFilter)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </label>
          <label>
            Sort
            <select value={sortKey} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => toggleSort(event.target.value as 'name' | 'lastLogin')}>
              <option value="name">Name</option>
              <option value="lastLogin">Last Login</option>
            </select>
          </label>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card__toolbar">
          <button type="button" onClick={handleBulkSelect}>
            {paginatedUsers.every((user) => selectedUsers.includes(user.id)) ? 'Clear selection' : 'Select page'}
          </button>
          <span>{selectedUsers.length} users selected</span>
        </div>
        {loading && <LoadingSkeleton />}
        {!loading && (
          <table className="user-table">
            <thead>
              <tr>
                <th>Select</th>
                <th onClick={() => toggleSort('name')}>
                  Name {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Role</th>
                <th>Status</th>
                <th onClick={() => toggleSort('lastLogin')}>
                  Last Login {sortKey === 'lastLogin' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelection(user.id)}
                    />
                  </td>
                  <td>
                    <strong>{user.name}</strong>
                    <div>{user.email}</div>
                  </td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{new Date(user.lastLogin).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? 'active' : ''}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {activeUser && (
        <div className="section-card">
          <h3>Detail Panel</h3>
          <p>
            <strong>{activeUser.name}</strong> ({activeUser.username})
          </p>
          <p>Role: {activeUser.role}</p>
          <p>Status: {activeUser.status}</p>
          <p>Last login: {new Date(activeUser.lastLogin).toLocaleString()}</p>
          <div>
            <h4>Activity logs</h4>
            <ul>
              {activeUser.activityLogs.map((log) => (
                <li key={log.timestamp}>
                  {new Date(log.timestamp).toLocaleString()}: {log.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
