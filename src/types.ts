export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  activityLogs: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Metric {
  date: string;
  logins: number;
  signups: number;
  activeUsers: number;
}

export interface FeatureUsage {
  feature: string;
  count: number;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  timezone: string;
}

export interface ReportConfig {
  metrics: string[];
  dateRange: {
    start: string;
    end: string;
  };
  format: 'pdf' | 'csv';
  groupBy: 'day' | 'week' | 'month';
}
