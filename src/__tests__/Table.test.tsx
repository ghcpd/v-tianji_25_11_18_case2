import { render, screen } from '@testing-library/react';
import { Table } from '../components/Table';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const testData: TestItem[] = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
  { id: '3', name: 'Item 3', value: 300 }
];

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'value', header: 'Value', sortable: true }
];

describe('Table Component', () => {
  test('renders table with data', () => {
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('renders column headers', () => {
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(
      <Table
        data={[]}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('handles sorting', () => {
    const handleSort = jest.fn();
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
        onSort={handleSort}
        sortKey="name"
        sortDirection="asc"
      />
    );
    
    const nameHeader = screen.getByText('Name');
    nameHeader.click();
    
    expect(handleSort).toHaveBeenCalledWith('name');
  });

  test('renders with selection checkboxes', () => {
    const selectedIds = new Set(['1']);
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
        selectedIds={selectedIds}
        onSelectRow={jest.fn()}
        onSelectAll={jest.fn()}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  test('handles row selection', () => {
    const handleSelectRow = jest.fn();
    const selectedIds = new Set<string>();
    
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
        selectedIds={selectedIds}
        onSelectRow={handleSelectRow}
        onSelectAll={jest.fn()}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes[1].click(); // Click first data row checkbox
    
    expect(handleSelectRow).toHaveBeenCalledWith('1');
  });

  test('handles select all', () => {
    const handleSelectAll = jest.fn();
    const selectedIds = new Set<string>();
    
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
        selectedIds={selectedIds}
        onSelectRow={jest.fn()}
        onSelectAll={handleSelectAll}
      />
    );
    
    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    selectAllCheckbox.click();
    
    expect(handleSelectAll).toHaveBeenCalledWith(true);
  });

  test('renders custom cell content', () => {
    const customColumns = [
      {
        key: 'name',
        header: 'Name',
        render: (item: TestItem) => <strong>{item.name}</strong>
      }
    ];
    
    render(
      <Table
        data={testData}
        columns={customColumns}
        keyExtractor={(item) => item.id}
      />
    );
    
    const firstItem = screen.getByText('Item 1');
    expect(firstItem.tagName).toBe('STRONG');
  });
});
