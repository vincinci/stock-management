import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { StockForm } from './components/StockForm';
import { StockList } from './components/StockList';
import { HistoryList } from './components/HistoryList';
import { FilterBar } from './components/FilterBar';
import { ItemModal } from './components/ItemModal';
import { ExportButton } from './components/ExportButton';
import type { StockItem, StockHistory } from './types';

const categories = ['First', 'Second', 'Third'];

function App() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  const handleAddItem = (newItem: Omit<StockItem, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString();
    const id = crypto.randomUUID();
    const item = {
      ...newItem,
      id,
      timestamp,
    };

    setItems([...items, item]);
    setHistory([
      {
        id: crypto.randomUUID(),
        action: 'add',
        item,
        timestamp,
      },
      ...history,
    ]);
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems(items.filter((i) => i.id !== id));
    setHistory([
      {
        id: crypto.randomUUID(),
        action: 'remove',
        item,
        timestamp: new Date().toISOString(),
      },
      ...history,
    ]);
  };

  const handleUpdateItem = (id: string, newQuantity: number) => {
    const itemIndex = items.findIndex((i) => i.id === id);
    if (itemIndex === -1) return;

    const item = items[itemIndex];
    const updatedItem = { ...item, quantity: newQuantity };
    const newItems = [...items];
    newItems[itemIndex] = updatedItem;

    setItems(newItems);
    setHistory([
      {
        id: crypto.randomUUID(),
        action: 'update',
        item: updatedItem,
        previousQuantity: item.quantity,
        timestamp: new Date().toISOString(),
      },
      ...history,
    ]);
  };

  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-black" aria-hidden="true" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Stock Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-700">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900" aria-live="polite">
                  {totalValue.toLocaleString()} RWF
                </p>
              </div>
              <ExportButton items={items} history={history} />
            </div>
          </div>

          <div className="mb-8">
            <StockForm onAddItem={handleAddItem} />
          </div>

          <FilterBar
            categories={categories}
            currentFilter={filter}
            onFilterChange={setFilter}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {items.length > 0 ? (
                <StockList 
                  items={items} 
                  onRemoveItem={handleRemoveItem}
                  onItemClick={setSelectedItem}
                />
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
                  <Package className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
                  <p className="mt-1 text-sm text-gray-500">Add your first item to get started.</p>
                </div>
              )}
            </div>
            <div>
              <HistoryList history={history} filter={filter} />
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdateItem}
          onRemove={handleRemoveItem}
        />
      )}
    </div>
  );
}

export default App;