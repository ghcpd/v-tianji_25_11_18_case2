import React from 'react';
import './Table.css';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectedIds?: Set<string>;
  onSelectAll?: (selected: boolean) => void;
  onSelectRow?: (id: string) => void;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onSort,
  sortKey,
  sortDirection,
  selectedIds,
  onSelectAll,
  onSelectRow
}: TableProps<T>) {
  const hasSelection = selectedIds !== undefined && onSelectRow !== undefined;
  const allSelected = hasSelection && data.length > 0 && data.every(item => selectedIds.has(keyExtractor(item)));
  
  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(!allSelected);
    }
  };
  
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {hasSelection && (
              <th className="table-header table-header-checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.key}
                className={`table-header ${column.sortable ? 'table-header-sortable' : ''}`}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="table-header-content">
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            const id = keyExtractor(item);
            const isSelected = hasSelection && selectedIds.has(id);
            
            return (
              <tr
                key={id}
                className={`table-row ${isSelected ? 'table-row-selected' : ''}`}
              >
                {hasSelection && (
                  <td className="table-cell table-cell-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectRow(id)}
                      aria-label={`Select row ${id}`}
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td key={column.key} className="table-cell">
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="table-empty">No data available</div>
      )}
    </div>
  );
}
