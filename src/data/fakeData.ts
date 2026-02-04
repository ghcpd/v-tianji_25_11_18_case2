import dayjs from 'dayjs';

type BaseAttrs = {
  role: 'Admin' | 'Analyst' | 'Support' | 'Manager';
  status: 'active' | 'inactive' | 'pending';
};

export type ActivityLog = {
  timestamp: string;
  description: string;
};

export type UserProfile = BaseAttrs & {
  id: string;
  name: string;
  username: string;
  email: string;
  lastLogin: string;
  activityLogs: ActivityLog[];
};

const firstNames = ['Avery', 'Jordan', 'Taylor', 'Morgan', 'Reese', 'Casey', 'Sydney', 'Parker', 'Jamie', 'Skyler'];
const lastNames = ['Cheng', 'Patel', 'Davis', 'Ramos', 'Johnson', 'Lee', 'Garcia', 'Morgan', 'Silva', 'Nakamura'];
const teams: BaseAttrs['role'][] = ['Admin', 'Analyst', 'Support', 'Manager'];
const statuses: BaseAttrs['status'][] = ['active', 'inactive', 'pending'];
const actions = ['Logged in', 'Updated profile', 'Exported report', 'Changed password', 'Ran alert check'];

const createActivityLogs = (count: number) =>
  Array.from({ length: count }, (_, idx) => ({
    timestamp: dayjs().subtract(idx * 3, 'hour').toISOString(),
    description: actions[(idx + count) % actions.length]
  }));

export const users: UserProfile[] = Array.from({ length: 120 }, (_, idx) => {
  const name = `${firstNames[idx % firstNames.length]} ${lastNames[idx % lastNames.length]}`;
  const role = teams[idx % teams.length];
  const status = statuses[idx % statuses.length];
  const userNumber = idx + 1;
  return {
    id: `user-${userNumber}`,
    name,
    username: `${name.replace(' ', '.').toLowerCase()}${userNumber}`,
    email: `${name.replace(' ', '.').toLowerCase()}@example.com`,
    role,
    status,
    lastLogin: dayjs().subtract(userNumber % 10, 'day').toISOString(),
    activityLogs: createActivityLogs(5)
  };
});

export const loginTrend = Array.from({ length: 10 }, (_, idx) => ({
  day: dayjs().subtract(9 - idx, 'day').format('MMM D'),
  logins: 45 + Math.round(Math.sin(idx / 2) * 12 + idx * 2)
}));

export const featureUsage = [
  { feature: 'Dashboards', usage: 720 },
  { feature: 'Reports', usage: 540 },
  { feature: 'Alerts', usage: 420 },
  { feature: 'Admin Tasks', usage: 330 }
];

export const systemAlerts = [
  { id: 'alert-1', severity: 'Critical', detail: 'Database backup overdue', updatedAt: dayjs().subtract(4, 'hour').toISOString() },
  { id: 'alert-2', severity: 'Moderate', detail: 'High CPU on analytics nodes', updatedAt: dayjs().subtract(1, 'hour').toISOString() },
  { id: 'alert-3', severity: 'Low', detail: 'New user request pending approval', updatedAt: dayjs().subtract(30, 'minute').toISOString() }
];
