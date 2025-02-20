import React, { useState } from 'react';
import { X, MinusCircle, PlusCircle } from 'lucide-react';
import type { ItemModalProps } from '../types';

export function ItemModal({ item, onClose, onUpdate, onRemove }: ItemModalProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [removeQuantity, setRemoveQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setRemoveQuantity(value);
    }
  };

  const handleRemove = () => {
    if (removeQuantity > 0 && removeQuantity <= item.quantity) {
      onUpdate(item.id, item.quantity - removeQuantity);
      onClose();
    }
  };

  const handleRemoveAll = () => {
    onRemove(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" role="dialog" aria-labelledby="modal-title">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">Manage Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Item Name</p>
            <p className="text-lg font-semibold text-gray-900">{item.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Category</p>
            <p className="text-lg text-gray-900">{item.category}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Current Quantity</p>
            <p className="text-lg text-gray-900">{item.quantity}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Price per Unit</p>
            <p className="text-lg text-gray-900">{item.price.toLocaleString()} RWF</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Total Value</p>
            <p className="text-lg font-bold text-gray-900">
              {(item.quantity * item.price).toLocaleString()} RWF
            </p>
          </div>

          <div className="border-t pt-4">
            <label htmlFor="removeQuantity" className="block text-sm font-medium text-gray-700">
              Quantity to Remove
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <button
                onClick={() => setRemoveQuantity(Math.max(1, removeQuantity - 1))}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Decrease quantity"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <input
                type="number"
                id="removeQuantity"
                min="1"
                max={item.quantity}
                value={removeQuantity}
                onChange={handleQuantityChange}
                className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-center"
              />
              <button
                onClick={() => setRemoveQuantity(Math.min(item.quantity, removeQuantity + 1))}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Increase quantity"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleRemove}
              className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              disabled={removeQuantity > item.quantity}
            >
              Remove {removeQuantity} {removeQuantity === 1 ? 'Item' : 'Items'}
            </button>
            <button
              onClick={handleRemoveAll}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remove All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}