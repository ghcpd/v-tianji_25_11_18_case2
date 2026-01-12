import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Settings as SettingsType } from '../types';
import { fetchWithDelay } from '../utils/mockData';
import './Settings.css';

const DEFAULT_SETTINGS: SettingsType = {
  theme: 'light',
  notifications: true,
  autoRefresh: false,
  refreshInterval: 60,
  timezone: 'UTC'
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateSettings = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (settings.refreshInterval < 10) {
      newErrors.refreshInterval = 'Refresh interval must be at least 10 seconds';
    } else if (settings.refreshInterval > 3600) {
      newErrors.refreshInterval = 'Refresh interval cannot exceed 3600 seconds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      return;
    }

    setSaving(true);
    setSaved(false);
    
    await fetchWithDelay(null, 1500);
    
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setErrors({});
    setSaved(false);
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <Card title="Appearance">
        <div className="settings-section">
          <Select
            label="Theme"
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' }
            ]}
          />
          <p className="settings-description">
            Choose your preferred theme. Dark mode is easier on the eyes in low-light conditions.
          </p>
        </div>
      </Card>

      <Card title="Notifications">
        <div className="settings-section">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="toggle-checkbox"
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">Enable Notifications</span>
          </label>
          <p className="settings-description">
            Receive notifications for important events and updates.
          </p>
        </div>
      </Card>

      <Card title="Data Refresh">
        <div className="settings-section">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
              className="toggle-checkbox"
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">Auto-Refresh Data</span>
          </label>
          <p className="settings-description">
            Automatically refresh dashboard data at regular intervals.
          </p>

          {settings.autoRefresh && (
            <div className="settings-subsection">
              <Input
                label="Refresh Interval (seconds)"
                type="number"
                value={settings.refreshInterval}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setSettings({ ...settings, refreshInterval: value });
                  if (errors.refreshInterval) {
                    const newErrors = { ...errors };
                    delete newErrors.refreshInterval;
                    setErrors(newErrors);
                  }
                }}
                error={errors.refreshInterval}
                min={10}
                max={3600}
              />
            </div>
          )}
        </div>
      </Card>

      <Card title="Localization">
        <div className="settings-section">
          <Select
            label="Timezone"
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            options={[
              { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
              { value: 'America/New_York', label: 'Eastern Time (ET)' },
              { value: 'America/Chicago', label: 'Central Time (CT)' },
              { value: 'America/Denver', label: 'Mountain Time (MT)' },
              { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
              { value: 'Europe/London', label: 'London (GMT)' },
              { value: 'Europe/Paris', label: 'Paris (CET)' },
              { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
              { value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
            ]}
          />
          <p className="settings-description">
            Select your timezone for accurate date and time display.
          </p>
        </div>
      </Card>

      <div className="settings-actions">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={saving}
        >
          Reset to Defaults
        </Button>
      </div>

      {saved && (
        <div className="settings-saved-message">
          ✓ Settings saved successfully!
        </div>
      )}
    </div>
  );
};
