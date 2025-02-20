import React from 'react';
import { History } from 'lucide-react';
import type { StockHistory } from '../types';

interface HistoryListProps {
  history: StockHistory[];
  filter: string;
}

export function HistoryList({ history, filter }: HistoryListProps) {
  const filteredHistory = history.filter(entry => 
    filter === 'all' || 
    entry.action === filter ||
    entry.item.category.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <History className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Activity History</h2>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredHistory.map((entry) => (
          <div key={entry.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">
                  {entry.action === 'add' ? 'Added' : 'Removed'}
                </span>
                <span className="ml-1 text-gray-700">
                  {entry.item.quantity} x {entry.item.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="mt-1 text-sm">
              <span className="text-gray-600">Category: {entry.item.category}</span>
              <span className="mx-2">•</span>
              <span className="text-gray-600">
                Value: {(entry.item.quantity * entry.item.price).toLocaleString()} RWF
              </span>
            </div>
          </div>
        ))}
        {filteredHistory.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No history entries found
          </div>
        )}
      </div>
    </div>
  );
}