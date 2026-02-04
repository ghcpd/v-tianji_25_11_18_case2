import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';

export type FilterState = {
  role: string;
  status: string;
  range: '7' | '30' | '90';
};

export type SettingsState = {
  notificationsEnabled: boolean;
  systemAlerts: 'all' | 'critical';
  timezone: string;
  autoReport: boolean;
};

type AppStateContextValue = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedUsers: string[];
  toggleSelection: (userId: string) => void;
  selectRange: (ids: string[]) => void;
  clearSelection: () => void;
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
};

const defaultFilters: FilterState = { role: 'all', status: 'active', range: '7' };
const defaultSettings: SettingsState = {
  notificationsEnabled: true,
  systemAlerts: 'all',
  timezone: 'UTC',
  autoReport: false
};

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  const toggleSelection = (userId: string) => {
    setSelectedUsers((prev: string[]) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectRange = (ids: string[]) => {
    setSelectedUsers(ids);
  };

  const clearSelection = () => setSelectedUsers([]);

  const value = useMemo(
    () => ({ filters, setFilters, selectedUsers, toggleSelection, selectRange, clearSelection, settings, setSettings }),
    [filters, selectedUsers, settings]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
