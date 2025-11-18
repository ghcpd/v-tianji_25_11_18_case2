import { User, DashboardMetrics, Report, Settings } from '../types';
import { generateUsers, generateDashboardMetrics } from '../data/mockData';

const USERS = generateUsers(100);
const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  notifications: true,
  emailReports: false,
  defaultRole: 'user',
  itemsPerPage: 10,
  autoRefresh: false,
};

let settings: Settings = { ...DEFAULT_SETTINGS };

export async function fetchUsers(): Promise<User[]> {
  await delay(500);
  return [...USERS];
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  await delay(800);
  return generateDashboardMetrics();
}

export async function fetchSettings(): Promise<Settings> {
  await delay(300);
  return { ...settings };
}

export async function saveSettings(newSettings: Settings): Promise<Settings> {
  await delay(1000);
  settings = { ...newSettings };
  return { ...settings };
}

export async function generateReport(
  metrics: string[],
  type: 'pdf' | 'csv'
): Promise<Report> {
  await delay(2000);
  return {
    id: `report-${Date.now()}`,
    name: `Report_${new Date().toISOString().split('T')[0]}.${type}`,
    type,
    metrics,
    generatedAt: new Date(),
  };
}

export async function downloadReport(report: Report): Promise<void> {
  await delay(500);
  const blob = new Blob(['Simulated report content'], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = report.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

