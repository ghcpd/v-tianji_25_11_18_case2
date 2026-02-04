import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { featureUsage, loginTrend, users } from '../data/fakeData';

const Reports: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['logins']);
  const [groupBy, setGroupBy] = useState<'role' | 'status'>('role');
  const [sortBy, setSortBy] = useState<'count' | 'group'>('count');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const aggregated = useMemo(() => {
    const next = users.reduce<Record<string, number>>((acc, user) => {
      const key = groupBy === 'role' ? user.role : user.status;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const rows = Object.entries(next).map(([label, count]) => ({ label, count }));
    return rows.sort((a, b) => {
      if (sortBy === 'count') {
        return b.count - a.count;
      }
      return a.label.localeCompare(b.label);
    });
  }, [groupBy, sortBy]);

  const metricData = selectedMetrics.includes('logins') ? loginTrend : featureUsage;

  const handleGenerate = (format: 'pdf' | 'csv') => {
    setGenerating(true);
    setMessage('');
    setTimeout(() => {
      setGenerating(false);
      setMessage(`Report ready (${format.toUpperCase()}) — downloaded ${new Date().toLocaleTimeString()}`);
    }, 900);
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev: string[]) =>
      prev.includes(metric) ? prev.filter((it) => it !== metric) : [...prev, metric]
    );
  };

  const metricLabel = (metric: string) => (metric === 'logins' ? 'Login trends' : 'Feature usage');

  return (
    <div>
      <h1>Reports</h1>
      <div className="section-card">
        <h3>Select metrics</h3>
        <div className="filter-panel">
          {['logins', 'features'].map((metric) => (
            <label key={metric}>
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric)}
                onChange={() => toggleMetric(metric)}
              />
              {metricLabel(metric)}
            </label>
          ))}
        </div>
        <div className="filter-panel">
          <label>
            Group by
            <select value={groupBy} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setGroupBy(event.target.value as 'role' | 'status')}>
              <option value="role">Role</option>
              <option value="status">Status</option>
            </select>
          </label>
          <label>
            Sort by
            <select value={sortBy} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value as 'count' | 'group')}>
              <option value="count">Count</option>
              <option value="group">Group</option>
            </select>
          </label>
        </div>
      </div>

      <div className="section-card">
        <h3>Metrics Chart</h3>
        {selectedMetrics.length === 0 ? (
          <p>Please select at least one metric.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={metricData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedMetrics.includes('logins') ? 'day' : 'feature'} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={selectedMetrics.includes('logins') ? 'logins' : 'usage'} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="section-card">
        <h3>Grouped data</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {aggregated.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-card">
        <h3>Generate report</h3>
        <div className="filter-panel">
          <button type="button" onClick={() => handleGenerate('pdf')} disabled={generating}>
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
          <button type="button" onClick={() => handleGenerate('csv')} disabled={generating}>
            {generating ? 'Generating...' : 'Download CSV'}
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Reports;
