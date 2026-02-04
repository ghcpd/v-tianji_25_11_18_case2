import React from 'react';
import { FilterState, useAppState } from '../context/AppStateContext';

const roles = ['all', 'Admin', 'Analyst', 'Support', 'Manager'] as const;
const statuses = ['active', 'inactive', 'pending'] as const;
const ranges: FilterState['range'][] = ['7', '30', '90'];

const FilterPanel: React.FC = () => {
  const { filters, setFilters } = useAppState();

  const updateField = <K extends keyof FilterState>(field: K, value: FilterState[K]) => {
    setFilters((prev: FilterState) => ({ ...prev, [field]: value }));
  };

  const createHandler = <K extends keyof FilterState>(field: K) => (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextValue = event.target.value as FilterState[K];
    updateField(field, nextValue);
  };

  return (
    <div className="section-card">
      <div className="filter-panel">
        <label>
          Date Range
          <select value={filters.range} onChange={createHandler('range')}>
            {ranges.map((range) => (
              <option key={range} value={range}>
                Last {range} days
              </option>
            ))}
          </select>
        </label>
        <label>
          Role
          <select value={filters.role} onChange={createHandler('role')}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={filters.status} onChange={createHandler('status')}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
