import React from 'react';
import { FileDown } from 'lucide-react';
import type { StockItem, StockHistory } from '../types';

interface ExportButtonProps {
  items: StockItem[];
  history: StockHistory[];
}

export function ExportButton({ items, history }: ExportButtonProps) {
  const generateReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    const itemsReport = items.map(item => ({
      Name: item.name,
      Category: item.category,
      Quantity: item.quantity,
      'Price (RWF)': item.price,
      'Total Value (RWF)': item.quantity * item.price,
      'Added Date': new Date(item.timestamp).toLocaleString()
    }));

    const historyReport = history.map(entry => ({
      Action: entry.action,
      'Item Name': entry.item.name,
      Category: entry.item.category,
      Quantity: entry.item.quantity,
      'Previous Quantity': entry.previousQuantity || '-',
      'Price (RWF)': entry.item.price,
      'Total Value (RWF)': entry.item.quantity * entry.item.price,
      Timestamp: new Date(entry.timestamp).toLocaleString()
    }));

    const report = {
      'Inventory Summary': {
        'Total Items': items.length,
        'Total Value': items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString() + ' RWF',
        'Generated At': new Date().toLocaleString()
      },
      'Current Inventory': itemsReport,
      'Transaction History': historyReport
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateReport}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      aria-label="Export inventory report"
    >
      <FileDown className="h-4 w-4 mr-2" aria-hidden="true" />
      Export Report
    </button>
  );
}