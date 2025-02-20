import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { StockItem } from '../types';

interface StockFormProps {
  onAddItem: (item: Omit<StockItem, 'id' | 'timestamp'>) => void;
}

const categories = ['First', 'Second', 'Third'];

export function StockForm({ onAddItem }: StockFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    category: categories[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      name: formData.name,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      category: formData.category,
    });
    setFormData({ name: '', quantity: '', price: '', category: categories[0] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            Item Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            aria-label="Item name"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-900">
            Category
          </label>
          <select
            id="category"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            aria-label="Item category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            aria-label="Item quantity"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-900">
            Price (RWF)
          </label>
          <input
            type="number"
            id="price"
            required
            min="0"
            step="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            aria-label="Item price in Rwandan Francs"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        aria-label="Add new item to inventory"
      >
        <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
        Add Item
      </button>
    </form>
  );
}