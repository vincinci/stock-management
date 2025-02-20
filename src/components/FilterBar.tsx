import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({ categories, currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center space-x-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center text-gray-700">
        <Filter className="h-5 w-5 mr-2" />
        <span className="font-medium">Filter by:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentFilter === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={currentFilter === 'all'}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('add')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentFilter === 'add'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={currentFilter === 'add'}
        >
          Added Items
        </button>
        <button
          onClick={() => onFilterChange('remove')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentFilter === 'remove'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={currentFilter === 'remove'}
        >
          Removed Items
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilterChange(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentFilter === category
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={currentFilter === category}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}