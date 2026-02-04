import React, { useEffect, useState } from 'react';
import { SettingsState, useAppState } from '../context/AppStateContext';

const Settings: React.FC = () => {
  const { settings, setSettings } = useAppState();
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [draftSettings, setDraftSettings] = useState<SettingsState>(settings);

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  const handleToggle = (key: keyof SettingsState) => {
    setDraftSettings((prev: SettingsState) => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !(prev[key] as boolean) : prev[key]
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setDraftSettings((prev: SettingsState) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = () => {
    if (!draftSettings.timezone) {
      setFlash('Timezone is required.');
      return;
    }
    setSaving(true);
    setFlash('');
    setTimeout(() => {
      setSaving(false);
      setSettings(draftSettings);
      setFlash('Settings saved successfully.');
    }, 700);
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className="section-card">
        <h3>User Preferences</h3>
        <div className="filter-panel">
          <label>
            Timezone
            <input
              name="timezone"
              value={draftSettings.timezone}
              onChange={handleChange}
              placeholder="UTC"
            />
          </label>
          <label>
            Notifications
            <button type="button" onClick={() => handleToggle('notificationsEnabled')}>
              {draftSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </label>
          <label>
            Auto report
            <input
              type="checkbox"
              name="autoReport"
              checked={draftSettings.autoReport}
              onChange={() => handleToggle('autoReport')}
            />
          </label>
          <label>
            Alerts
            <select name="systemAlerts" value={draftSettings.systemAlerts} onChange={handleChange}>
              <option value="all">All alerts</option>
              <option value="critical">Critical only</option>
            </select>
          </label>
        </div>
        <div className="filter-panel">
          <button type="button" onClick={saveSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save preferences'}
          </button>
        </div>
        {flash && <p>{flash}</p>}
      </div>
    </div>
  );
};

export default Settings;
