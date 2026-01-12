import { User, ActivityLog, Metric, FeatureUsage, SystemAlert } from '../types';

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
  'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Frank', 'Rachel', 'Alexander', 'Carolyn', 'Patrick', 'Janet', 'Jack', 'Catherine',
  'Dennis', 'Maria', 'Jerry', 'Heather', 'Tyler', 'Diane', 'Aaron', 'Ruth'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson'
];

const actions = [
  'Logged in',
  'Updated profile',
  'Changed password',
  'Uploaded file',
  'Downloaded report',
  'Created project',
  'Deleted item',
  'Invited user',
  'Modified settings',
  'Viewed dashboard'
];

const roles: Array<'admin' | 'user' | 'moderator'> = ['admin', 'user', 'moderator'];
const statuses: Array<'active' | 'inactive' | 'suspended'> = ['active', 'inactive', 'suspended'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateActivityLogs(count: number): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now);
    logs.push({
      id: `log-${i}`,
      action: randomItem(actions),
      timestamp: timestamp.toISOString(),
      details: `Action performed successfully at ${timestamp.toLocaleString()}`
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateUsers(count: number = 100): User[] {
  const users: User[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;
    const email = `${username}@example.com`;
    const lastLogin = randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
    
    users.push({
      id: `user-${i + 1}`,
      name: `${firstName} ${lastName}`,
      username,
      email,
      role: randomItem(roles),
      status: randomItem(statuses),
      lastLogin: lastLogin.toISOString(),
      activityLogs: generateActivityLogs(Math.floor(Math.random() * 20) + 5)
    });
  }
  
  return users;
}

export function generateMetrics(days: number = 30): Metric[] {
  const metrics: Metric[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    metrics.push({
      date: date.toISOString().split('T')[0],
      logins: Math.floor(Math.random() * 500) + 200,
      signups: Math.floor(Math.random() * 50) + 10,
      activeUsers: Math.floor(Math.random() * 800) + 400
    });
  }
  
  return metrics;
}

export function generateFeatureUsage(): FeatureUsage[] {
  const features = [
    'Dashboard',
    'User Management',
    'Reports',
    'Settings',
    'Analytics',
    'File Upload',
    'Export Data',
    'Notifications'
  ];
  
  return features.map(feature => ({
    feature,
    count: Math.floor(Math.random() * 1000) + 100
  }));
}

export function generateSystemAlerts(count: number = 10): SystemAlert[] {
  const messages = [
    'System backup completed successfully',
    'New user registration spike detected',
    'Server CPU usage above 80%',
    'Database optimization recommended',
    'Security patch available',
    'Scheduled maintenance in 24 hours',
    'API rate limit reached for client X',
    'Cache cleared successfully',
    'New feature deployed',
    'Login attempts from unusual location'
  ];
  
  const types: Array<'info' | 'warning' | 'error'> = ['info', 'warning', 'error'];
  const alerts: SystemAlert[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now);
    alerts.push({
      id: `alert-${i + 1}`,
      type: randomItem(types),
      message: randomItem(messages),
      timestamp: timestamp.toISOString()
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Simulate async data fetching
export function fetchWithDelay<T>(data: T, delay: number = 800): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}
