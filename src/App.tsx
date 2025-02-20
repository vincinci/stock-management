import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { ChangePassword } from './components/ChangePassword';
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
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [items, setItems] = useState<StockItem[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: itemsData } = await supabase
          .from('stock_items')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: historyData } = await supabase
          .from('stock_history')
          .select('*')
          .order('timestamp', { ascending: false });

        if (itemsData) setItems(itemsData);
        if (historyData) setHistory(historyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  const handleAddItem = async (newItem: Omit<StockItem, 'id' | 'timestamp'>) => {
    try {
      const { data: insertedItem, error } = await supabase
        .from('stock_items')
        .insert({
          ...newItem,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      if (insertedItem) {
        setItems([insertedItem, ...items]);

        await supabase.from('stock_history').insert({
          item_id: insertedItem.id,
          action: 'add',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter((i) => i.id !== id));

      await supabase.from('stock_history').insert({
        item_id: id,
        action: 'remove',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateItem = async (id: string, newQuantity: number) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const { data: updatedItem, error } = await supabase
        .from('stock_items')
        .update({ quantity: newQuantity })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (updatedItem) {
        setItems(items.map((i) => (i.id === id ? updatedItem : i)));

        await supabase.from('stock_history').insert({
          item_id: id,
          action: 'update',
          previous_quantity: item.quantity,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (authLoading) {
      return <div>Loading...</div>;
    }
    if (!session) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="space-y-6">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-black" aria-hidden="true" />
                      <h1 className="ml-2 text-xl sm:text-2xl font-bold text-gray-900">Stock Management</h1>
                    </div>
                    <div className="flex flex-col xs:flex-row items-end xs:items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-700 whitespace-nowrap">Total Inventory Value</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900" aria-live="polite">
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

                  <div className="grid grid-cols-1 gap-6 xs:gap-4 sm:gap-6 md:grid-cols-2">
                    <div>
                      {items.length > 0 ? (
                        <StockList 
                          items={items} 
                          onRemoveItem={handleRemoveItem}
                          onItemClick={setSelectedItem}
                        />
                      ) : (
                        <div className="text-center p-4 xs:py-6 sm:py-12 bg-white rounded-lg shadow-md border border-gray-200">
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
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
