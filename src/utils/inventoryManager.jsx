import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  INVENTORY: 'inventory_data',
  TRANSACTIONS: 'pos_transactions',
  LAST_TRANSACTION_ID: 'lastTransactionId'
};

// Centralized storage handler to reduce repetition
const Storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (err) {
      console.error(`Error loading ${key}:`, err);
      return [];
    }
  },
  set: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Error saving ${key}:`, err);
    }
  }
};

export const InventoryManager = {
  getAll: () => Storage.get(STORAGE_KEYS.INVENTORY),
  
  getById: (id) => Storage.get(STORAGE_KEYS.INVENTORY).find(item => item.id === id),
  
  addItem: (item) => {
    const items = Storage.get(STORAGE_KEYS.INVENTORY);
    const newItem = { 
      ...item, 
      id: uuidv4(),
      quantity_on_hand: parseInt(item.quantity_on_hand) || 0,
      price: parseFloat(item.price) || 0
    };
    Storage.set(STORAGE_KEYS.INVENTORY, [...items, newItem]);
    return newItem;
  },
  
  updateItem: (item) => {
    const items = Storage.get(STORAGE_KEYS.INVENTORY);
    const updatedItems = items.map(i => 
      i.id === item.id ? {
        ...i,
        ...item,
        quantity_on_hand: parseInt(item.quantity_on_hand) || 0,
        price: parseFloat(item.price) || 0
      } : i
    );
    Storage.set(STORAGE_KEYS.INVENTORY, updatedItems);
  },
  
  removeItem: (id) => {
    const items = Storage.get(STORAGE_KEYS.INVENTORY);
    Storage.set(STORAGE_KEYS.INVENTORY, items.filter(i => i.id !== id));
  }
};
