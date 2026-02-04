import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Report, DashboardMetrics } from '../types';
import { generateReport, downloadReport, fetchDashboardMetrics } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Reports.css';

const AVAILABLE_METRICS = [
  'Login Trends',
  'Feature Usage',
  'User Statistics',
  'System Alerts',
  'Activity Logs',
];

const Reports = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(['Login Trends', 'Feature Usage'])
  );
  const [reportType, setReportType] = useState<'pdf' | 'csv'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [groupBy, setGroupBy] = useState<'none' | 'type'>('none');

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(metric)) {
        newSet.delete(metric);
      } else {
        newSet.add(metric);
      }
      return newSet;
    });
  };

  const handleGenerateReport = async () => {
    if (selectedMetrics.size === 0) {
      alert('Please select at least one metric');
      return;
    }

    try {
      setGenerating(true);
      const report = await generateReport(Array.from(selectedMetrics), reportType);
      setReports((prev) => [report, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      await downloadReport(report);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download report');
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'date') {
      return b.generatedAt.getTime() - a.generatedAt.getTime();
    }
    return a.name.localeCompare(b.name);
  });

  const groupedReports =
    groupBy === 'type'
      ? sortedReports.reduce(
          (acc, report) => {
            if (!acc[report.type]) {
              acc[report.type] = [];
            }
            acc[report.type].push(report);
            return acc;
          },
          {} as Record<string, Report[]>
        )
      : { all: sortedReports };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="reports">
      <h1 className="page-title">Reports</h1>

      <div className="reports-content">
        <div className="reports-config">
          <div className="card">
            <h3 className="card-title">Generate Report</h3>
            <div className="config-section">
              <label>Select Metrics:</label>
              <div className="metrics-list">
                {AVAILABLE_METRICS.map((metric) => (
                  <label key={metric} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.has(metric)}
                      onChange={() => handleMetricToggle(metric)}
                    />
                    <span>{metric}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="config-section">
              <label>Report Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'pdf' | 'csv')}
                className="input"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleGenerateReport}
              disabled={generating || selectedMetrics.size === 0}
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">Display Options</h3>
            <div className="config-section">
              <label>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                className="input"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="config-section">
              <label>Group By:</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as 'none' | 'type')}
                className="input"
              >
                <option value="none">None</option>
                <option value="type">Type</option>
              </select>
            </div>
          </div>
        </div>

        <div className="reports-charts">
          {selectedMetrics.has('Login Trends') && (
            <div className="card">
              <h3 className="card-title">Login Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.loginTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="logins" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedMetrics.has('Feature Usage') && (
            <div className="card">
              <h3 className="card-title">Feature Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.featureUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="reports-list">
          <h2 className="section-title">Generated Reports</h2>
          {Object.keys(groupedReports).length === 0 || reports.length === 0 ? (
            <div className="empty-state">No reports generated yet.</div>
          ) : (
            Object.entries(groupedReports).map(([group, groupReports]) => (
              <div key={group} className="report-group">
                {groupBy !== 'none' && <h3 className="group-title">{group.toUpperCase()}</h3>}
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Metrics</th>
                      <th>Generated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.name}</td>
                        <td>
                          <span className={`badge badge-info`}>{report.type.toUpperCase()}</span>
                        </td>
                        <td>{report.metrics.join(', ')}</td>
                        <td>{report.generatedAt.toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleDownload(report)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;

