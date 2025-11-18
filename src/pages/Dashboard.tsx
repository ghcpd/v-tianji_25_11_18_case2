import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Select } from '../components/Select';
import { Spinner } from '../components/Spinner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  generateMetrics,
  generateFeatureUsage,
  generateSystemAlerts,
  fetchWithDelay
} from '../utils/mockData';
import { Metric, FeatureUsage, SystemAlert } from '../types';
import { formatDate } from '../utils/helpers';
import './Dashboard.css';

const COLORS = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const days = parseInt(dateRange);
      const [metricsData, usageData, alertsData] = await Promise.all([
        fetchWithDelay(generateMetrics(days), 500),
        fetchWithDelay(generateFeatureUsage(), 500),
        fetchWithDelay(generateSystemAlerts(), 500)
      ]);
      
      setMetrics(metricsData);
      setFeatureUsage(usageData);
      setAlerts(alertsData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner size="large" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const totalLogins = metrics.reduce((sum, m) => sum + m.logins, 0);
  const totalSignups = metrics.reduce((sum, m) => sum + m.signups, 0);
  const avgActiveUsers = Math.round(
    metrics.reduce((sum, m) => sum + m.activeUsers, 0) / metrics.length
  );
  const todayMetrics = metrics[metrics.length - 1];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-controls">
          <Select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '7', label: 'Last 7 Days' },
              { value: '14', label: 'Last 14 Days' },
              { value: '30', label: 'Last 30 Days' },
              { value: '60', label: 'Last 60 Days' }
            ]}
          />
        </div>
      </div>

      {refreshing && (
        <div className="dashboard-refreshing">
          <Spinner size="small" /> Refreshing data...
        </div>
      )}

      <div className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-value">{totalLogins.toLocaleString()}</div>
          <div className="stat-label">Total Logins</div>
          <div className="stat-change positive">+12.5%</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{totalSignups.toLocaleString()}</div>
          <div className="stat-label">New Signups</div>
          <div className="stat-change positive">+8.3%</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{avgActiveUsers.toLocaleString()}</div>
          <div className="stat-label">Avg Active Users</div>
          <div className="stat-change negative">-2.1%</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{todayMetrics?.activeUsers || 0}</div>
          <div className="stat-label">Active Today</div>
          <div className="stat-change positive">+5.7%</div>
        </Card>
      </div>

      <div className="dashboard-charts">
        <Card title="User Activity Trends" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatDate(value)}
              />
              <YAxis />
              <Tooltip labelFormatter={(value) => formatDate(String(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="logins"
                stroke="#3498db"
                name="Logins"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#2ecc71"
                name="Active Users"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#f39c12"
                name="Signups"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Feature Usage" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3498db" name="Usage Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Feature Distribution" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={featureUsage}
                dataKey="count"
                nameKey="feature"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {featureUsage.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="System Alerts" className="alerts-card">
          <div className="alerts-list">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                <div className="alert-icon">{getAlertIcon(alert.type)}</div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">{formatDate(alert.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

function getAlertIcon(type: 'info' | 'warning' | 'error'): string {
  switch (type) {
    case 'info':
      return 'ℹ️';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
  }
}
