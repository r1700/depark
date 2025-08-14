import React, { useState } from 'react';
import FilterPanel from '../../../components/filter-panel/FilterPanel';
import { FieldConfig } from './adminUserTypes';

const fields: FieldConfig[] = [
  { name: 'search1', label: 'Search 1', type: 'free', placeholder: 'Type...' },
  { name: 'search2', label: 'Search 2', type: 'free', placeholder: 'Type...' },
  { name: 'search3', label: 'Search 3', type: 'free', placeholder: 'Type...' },

  { name: 'category', label: 'Category', type: 'select', options: ['A', 'B', 'C'] },
  { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Pending', 'Closed'] },
];

export const DemoFilter: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  return (
    <div>
      <FilterPanel
        fields={fields}
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onClear={() => setFilters({})}
      />
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
};