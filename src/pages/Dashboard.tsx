import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import FilterPanel from '../components/FilterPanel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { systemAlerts, loginTrend, featureUsage, users } from '../data/fakeData';
import { useAppState } from '../context/AppStateContext';

const Dashboard: React.FC = () => {
  const { filters } = useAppState();
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const latestRequestRef = useRef(0);

  const filteredByTime = useMemo(() => {
    const multiplier = Number(filters.range);
    const sliceIndex = Math.max(users.length - multiplier * 2, 0);
    return users.slice(sliceIndex);
  }, [filters.range]);

  useEffect(() => {
    const requestId = Date.now();
    latestRequestRef.current = requestId;
    setLoading(true);

    const computeResults = () => {
      const next = users.filter((user) => {
        const matchRole = filters.role === 'all' || user.role === filters.role;
        const matchStatus = user.status === filters.status;
        return matchRole && matchStatus;
      });
      setFilteredUsers(next);
      setLoading(false);
    };

    if (process.env.NODE_ENV === 'test') {
      computeResults();
      return;
    }

    const timeout = setTimeout(() => {
      if (latestRequestRef.current !== requestId) {
        return;
      }
      computeResults();
    }, 550);

    return () => clearTimeout(timeout);
  }, [filters]);

  const engagementRate = useMemo(() => {
    const total = filteredUsers.length;
    const active = filteredUsers.filter((user) => user.status === 'active').length;
    return total ? Math.round((active / total) * 100) : 0;
  }, [filteredUsers]);

  return (
    <div>
      <h1>Dashboard</h1>
      <FilterPanel />
      <div className="section-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="section-card">
          <h3>User Coverage</h3>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <p>{filteredUsers.length} users matching current filters</p>
          )}
        </div>
        <div className="section-card">
          <h3>Engagement</h3>
          {loading ? <LoadingSkeleton /> : <p>{engagementRate}% active</p>}
        </div>
        <div className="section-card">
          <h3>System Alerts</h3>
          <ul>
            {systemAlerts.map((alert) => (
              <li key={alert.id}>
                <strong>{alert.severity}:</strong> {alert.detail} ({alert.updatedAt})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-card">
        <h3>Login Trends</h3>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={loginTrend} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="logins" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="section-card">
        <h3>Feature Usage</h3>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={featureUsage} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="section-card">
        <h3>Selected Users</h3>
        <p>Showing {filteredUsers.length} records after filters.</p>
        {loading ? <LoadingSkeleton /> : null}
      </div>
    </div>
  );
};

export default Dashboard;
