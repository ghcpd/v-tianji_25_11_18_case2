import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../types';
import { fetchSettings, saveSettings } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const validateSettings = (s: Settings): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (s.itemsPerPage < 5 || s.itemsPerPage > 100) {
      errors.itemsPerPage = 'Items per page must be between 5 and 100';
    }

    return errors;
  };

  const handleChange = (field: keyof Settings, value: unknown) => {
    if (!settings) return;

    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);

    const errors = validateSettings(newSettings);
    setValidationErrors(errors);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!settings) return;

    const errors = validateSettings(settings);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await saveSettings(settings);
      setSaveSuccess(true);
      setValidationErrors({});
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !settings) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="settings">
      <h1 className="page-title">Settings</h1>

      {saveSuccess && (
        <div className="success-message">Settings saved successfully!</div>
      )}

      {error && (
        <div className="error-message">Error: {error}</div>
      )}

      <div className="settings-content">
        <div className="settings-section card">
          <h3 className="card-title">Appearance</h3>
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value as 'light' | 'dark')}
              className={`input ${validationErrors.theme ? 'input-error' : ''}`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            {validationErrors.theme && (
              <div className="error-text">{validationErrors.theme}</div>
            )}
          </div>
        </div>

        <div className="settings-section card">
          <h3 className="card-title">Notifications</h3>
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Enable Notifications</span>
            </label>
          </div>
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.emailReports}
                onChange={(e) => handleChange('emailReports', e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Email Reports</span>
            </label>
          </div>
        </div>

        <div className="settings-section card">
          <h3 className="card-title">User Preferences</h3>
          <div className="setting-item">
            <label>Default Role</label>
            <select
              value={settings.defaultRole}
              onChange={(e) => handleChange('defaultRole', e.target.value as Settings['defaultRole'])}
              className="input"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Items Per Page</label>
            <input
              type="number"
              value={settings.itemsPerPage}
              onChange={(e) => handleChange('itemsPerPage', Number(e.target.value))}
              className={`input ${validationErrors.itemsPerPage ? 'input-error' : ''}`}
              min="5"
              max="100"
            />
            {validationErrors.itemsPerPage && (
              <div className="error-text">{validationErrors.itemsPerPage}</div>
            )}
          </div>
        </div>

        <div className="settings-section card">
          <h3 className="card-title">System</h3>
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Auto Refresh</span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || Object.keys(validationErrors).length > 0}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={loadSettings}
          disabled={saving}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Settings;

