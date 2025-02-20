export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  timestamp: string;
}

export interface StockHistory {
  id: string;
  action: 'add' | 'remove' | 'update';
  item: StockItem;
  previousQuantity?: number;
  timestamp: string;
}

export interface ItemModalProps {
  item: StockItem;
  onClose: () => void;
  onUpdate: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}