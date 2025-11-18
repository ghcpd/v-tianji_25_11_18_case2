export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  activityLogs: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  details: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  loginTrends: LoginTrend[];
  featureUsage: FeatureUsage[];
  systemAlerts: SystemAlert[];
}

export interface LoginTrend {
  date: string;
  logins: number;
}

export interface FeatureUsage {
  feature: string;
  usage: number;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface Report {
  id: string;
  name: string;
  type: 'pdf' | 'csv';
  metrics: string[];
  generatedAt: Date;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailReports: boolean;
  defaultRole: 'admin' | 'user' | 'moderator';
  itemsPerPage: number;
  autoRefresh: boolean;
}

