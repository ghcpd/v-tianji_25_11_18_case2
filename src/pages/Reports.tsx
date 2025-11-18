import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { generateMetrics, generateFeatureUsage } from '../utils/mockData';
import { downloadFile, formatDate } from '../utils/helpers';
import './Reports.css';

type MetricType = 'logins' | 'signups' | 'activeUsers';
type GroupBy = 'day' | 'week' | 'month';

export const Reports: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['logins', 'activeUsers']);
  const [dateRange, setDateRange] = useState('30');
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [generating, setGenerating] = useState(false);

  const metrics = useMemo(() => {
    return generateMetrics(parseInt(dateRange));
  }, [dateRange]);

  const featureUsage = useMemo(() => {
    return generateFeatureUsage();
  }, []);

  const groupedMetrics = useMemo(() => {
    if (groupBy === 'day') return metrics;

    const grouped: { [key: string]: any } = {};
    
    metrics.forEach((metric) => {
      const date = new Date(metric.date);
      let key: string;
      
      if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          logins: 0,
          signups: 0,
          activeUsers: 0,
          count: 0
        };
      }
      
      grouped[key].logins += metric.logins;
      grouped[key].signups += metric.signups;
      grouped[key].activeUsers += metric.activeUsers;
      grouped[key].count += 1;
    });

    return Object.values(grouped).map((item: any) => ({
      date: item.date,
      logins: Math.round(item.logins / item.count),
      signups: Math.round(item.signups / item.count),
      activeUsers: Math.round(item.activeUsers / item.count)
    }));
  }, [metrics, groupBy]);

  const handleMetricToggle = (metric: MetricType) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metric)) {
        return prev.filter((m) => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };

  const handleDownloadCSV = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const headers = ['Date', ...selectedMetrics.map(m => m.charAt(0).toUpperCase() + m.slice(1))];
    const rows = groupedMetrics.map((m) => {
      const row = [m.date];
      selectedMetrics.forEach((metric) => {
        row.push(String(m[metric]));
      });
      return row.join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    downloadFile(csv, `report-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    setGenerating(false);
  };

  const handleDownloadPDF = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert('PDF report generation simulated. In a real app, this would generate a PDF file.');
    setGenerating(false);
  };

  const tableColumns = [
    {
      key: 'date',
      header: 'Date',
      render: (item: any) => formatDate(item.date)
    },
    ...selectedMetrics.map((metric) => ({
      key: metric,
      header: metric.charAt(0).toUpperCase() + metric.slice(1),
      render: (item: any) => item[metric].toLocaleString()
    }))
  ];

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;
  const DataComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="reports">
      <div className="reports-header">
        <h1>Reports</h1>
      </div>

      <Card title="Report Configuration">
        <div className="report-config">
          <div className="config-section">
            <h3>Metrics</h3>
            <div className="metrics-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('logins')}
                  onChange={() => handleMetricToggle('logins')}
                />
                Logins
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('signups')}
                  onChange={() => handleMetricToggle('signups')}
                />
                Signups
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('activeUsers')}
                  onChange={() => handleMetricToggle('activeUsers')}
                />
                Active Users
              </label>
            </div>
          </div>

          <div className="config-section">
            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: '7', label: 'Last 7 Days' },
                { value: '14', label: 'Last 14 Days' },
                { value: '30', label: 'Last 30 Days' },
                { value: '60', label: 'Last 60 Days' },
                { value: '90', label: 'Last 90 Days' }
              ]}
            />
          </div>

          <div className="config-section">
            <Select
              label="Group By"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' }
              ]}
            />
          </div>

          <div className="config-section">
            <Select
              label="Chart Type"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
              options={[
                { value: 'line', label: 'Line Chart' },
                { value: 'bar', label: 'Bar Chart' }
              ]}
            />
          </div>
        </div>

        <div className="download-actions">
          <Button
            variant="primary"
            onClick={handleDownloadCSV}
            disabled={generating || selectedMetrics.length === 0}
          >
            {generating ? 'Generating...' : 'Download CSV'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownloadPDF}
            disabled={generating || selectedMetrics.length === 0}
          >
            {generating ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </Card>

      {selectedMetrics.length > 0 && (
        <>
          <Card title="Metrics Chart" className="chart-card">
            <ResponsiveContainer width="100%" height={350}>
              <ChartComponent data={groupedMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis />
                <Tooltip labelFormatter={(value) => formatDate(String(value))} />
                <Legend />
                {selectedMetrics.includes('logins') && (
                  <DataComponent
                    type="monotone"
                    dataKey="logins"
                    stroke="#3498db"
                    fill="#3498db"
                    name="Logins"
                  />
                )}
                {selectedMetrics.includes('signups') && (
                  <DataComponent
                    type="monotone"
                    dataKey="signups"
                    stroke="#f39c12"
                    fill="#f39c12"
                    name="Signups"
                  />
                )}
                {selectedMetrics.includes('activeUsers') && (
                  <DataComponent
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#2ecc71"
                    fill="#2ecc71"
                    name="Active Users"
                  />
                )}
              </ChartComponent>
            </ResponsiveContainer>
          </Card>

          <Card title="Data Table">
            <Table
              data={groupedMetrics}
              columns={tableColumns}
              keyExtractor={(item) => item.date}
            />
          </Card>
        </>
      )}

      <Card title="Feature Usage Summary">
        <Table
          data={featureUsage}
          columns={[
            { key: 'feature', header: 'Feature' },
            {
              key: 'count',
              header: 'Usage Count',
              render: (item) => item.count.toLocaleString()
            }
          ]}
          keyExtractor={(item) => item.feature}
        />
      </Card>
    </div>
  );
};
