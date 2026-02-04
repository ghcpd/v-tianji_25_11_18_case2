import { User, DashboardMetrics, LoginTrend, FeatureUsage, SystemAlert } from '../types';

const roles: Array<'admin' | 'user' | 'moderator'> = ['admin', 'user', 'moderator'];
const statuses: Array<'active' | 'inactive' | 'suspended'> = ['active', 'inactive', 'suspended'];

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
  'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Melissa', 'Daniel',
  'Michelle', 'Matthew', 'Kimberly', 'Anthony', 'Amy', 'Mark', 'Angela',
  'Donald', 'Stephanie', 'Steven', 'Nicole', 'Paul', 'Elizabeth', 'Andrew',
  'Helen', 'Joshua', 'Sandra', 'Kenneth', 'Donna', 'Kevin', 'Carol', 'Brian',
  'Ruth', 'George', 'Sharon', 'Edward', 'Michelle', 'Ronald', 'Laura',
  'Timothy', 'Sarah', 'Jason', 'Kimberly', 'Jeffrey', 'Deborah'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips'
];

const actions = [
  'Login', 'Logout', 'Profile Update', 'Password Change', 'Role Change',
  'Data Export', 'Report Generated', 'Settings Updated', 'User Created',
  'User Deleted', 'Permission Granted', 'Permission Revoked'
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateActivityLogs(count: number): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    logs.push({
      id: `log-${i}`,
      action: randomElement(actions),
      timestamp: randomDate(thirtyDaysAgo, now),
      details: `Action performed: ${randomElement(actions)}`,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  details: string;
}

export function generateUsers(count: number): User[] {
  const users: User[] = [];
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;
    const email = `${username}@example.com`;

    users.push({
      id: `user-${i}`,
      name: `${firstName} ${lastName}`,
      username,
      email,
      role: randomElement(roles),
      status: randomElement(statuses),
      lastLogin: randomDate(ninetyDaysAgo, now),
      activityLogs: generateActivityLogs(Math.floor(Math.random() * 10) + 1),
    });
  }

  return users;
}

export function generateDashboardMetrics(): DashboardMetrics {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const loginTrends: LoginTrend[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    loginTrends.push({
      date: date.toISOString().split('T')[0],
      logins: Math.floor(Math.random() * 500) + 100,
    });
  }

  const featureUsage: FeatureUsage[] = [
    { feature: 'Dashboard', usage: Math.floor(Math.random() * 1000) + 500 },
    { feature: 'User Management', usage: Math.floor(Math.random() * 800) + 300 },
    { feature: 'Reports', usage: Math.floor(Math.random() * 600) + 200 },
    { feature: 'Settings', usage: Math.floor(Math.random() * 400) + 100 },
    { feature: 'Analytics', usage: Math.floor(Math.random() * 700) + 250 },
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: 'alert-1',
      type: 'warning',
      message: 'High memory usage detected',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'alert-2',
      type: 'info',
      message: 'Scheduled maintenance completed',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      id: 'alert-3',
      type: 'error',
      message: 'Failed login attempts exceeded threshold',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
  ];

  return {
    totalUsers: 100,
    activeUsers: 75,
    loginTrends,
    featureUsage,
    systemAlerts,
  };
}

