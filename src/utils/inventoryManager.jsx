import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
    INVENTORY: 'inventory_items', // Corrected key name to match previous code
    TRANSACTIONS: 'pos_transactions',
    LAST_TRANSACTION_ID: 'lastTransactionId',
    INVENTORY_HISTORY: 'inventory_history',
    VENDORS: 'inventory_vendors'
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

// Validate barcode format (UPC/EAN)
const validateBarcode = (barcode) => {
    if (!barcode) return true;
    const barcodeRegex = /^(\d{12}|\d{13}|\d{8})$/;
    return barcodeRegex.test(barcode);
};

// Add inventory history entry
const addHistoryEntry = (itemId, action, details) => {
    const history = Storage.get(STORAGE_KEYS.INVENTORY_HISTORY);
    history.push({
        id: uuidv4(),
        itemId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
    Storage.set(STORAGE_KEYS.INVENTORY_HISTORY, history);
};

// Event listener management
const listeners = new Set();

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const InventoryManager = {
    // Event listener methods
    addUpdateListener: (listener) => {
        listeners.add(listener);
    },
    removeUpdateListener: (listener) => {
        listeners.delete(listener);
    },

    // Inventory operations
    getAll: () => Storage.get(STORAGE_KEYS.INVENTORY),

    getById: (id) => Storage.get(STORAGE_KEYS.INVENTORY).find(item => item.id === id),

    addItem: (item) => {
        if (item.barcode && !validateBarcode(item.barcode)) {
            throw new Error('Invalid barcode format. Must be 8, 12 or 13 digits');
        }

        const items = Storage.get(STORAGE_KEYS.INVENTORY);
        const newItem = {
            ...item,
            id: uuidv4(),
            quantity_on_hand: parseInt(item.quantity_on_hand) || 0,
            price: parseFloat(item.price) || 0, // Already pre-tax price
            barcode: item.barcode || null,
            vendor_id: item.vendor_id || null,
            low_stock_threshold: parseInt(item.low_stock_threshold) || 5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        Storage.set(STORAGE_KEYS.INVENTORY, [...items, newItem]);
        addHistoryEntry(newItem.id, 'CREATE', { details: 'Item created' });
        notifyListeners(); // Notify listeners after adding
        return newItem;
    },

    updateItem: (item) => {
        if (item.barcode && !validateBarcode(item.barcode)) {
            throw new Error('Invalid barcode format. Must be 8, 12 or 13 digits');
        }

        const items = Storage.get(STORAGE_KEYS.INVENTORY);
        const updatedItems = items.map(i =>
            i.id === item.id ? {
                ...i,
                ...item,
                quantity_on_hand: parseInt(item.quantity_on_hand) || 0,
                price: parseFloat(item.price) || 0, // Already pre-tax price
                updated_at: new Date().toISOString()
            } : i
        );

        Storage.set(STORAGE_KEYS.INVENTORY, updatedItems);
        addHistoryEntry(item.id, 'UPDATE', { details: 'Item updated' });
        notifyListeners(); // Notify listeners after updating
    },

    removeItem: (id) => {
        const items = Storage.get(STORAGE_KEYS.INVENTORY);
        Storage.set(STORAGE_KEYS.INVENTORY, items.filter(i => i.id !== id));
        addHistoryEntry(id, 'DELETE', { details: 'Item deleted' });
        notifyListeners(); // Notify listeners after deletion
    },

    // Bulk operations
    bulkImport: (items) => {
        const currentItems = Storage.get(STORAGE_KEYS.INVENTORY);
        const newItems = items.map(item => ({
            ...item,
            id: uuidv4(),
            quantity_on_hand: parseInt(item.quantity_on_hand) || 0,
            price: parseFloat(item.price) || 0,  // Already pre-tax price
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        Storage.set(STORAGE_KEYS.INVENTORY, [...currentItems, ...newItems]);
        addHistoryEntry(null, 'BULK_IMPORT', { count: items.length });
        notifyListeners(); // Notify listeners after bulk import
    },

    bulkExport: () => {
        return Storage.get(STORAGE_KEYS.INVENTORY);
    },

    // Vendor management
    addVendor: (vendor) => {
        const vendors = Storage.get(STORAGE_KEYS.VENDORS);
        const newVendor = {
            ...vendor,
            id: uuidv4(),
            created_at: new Date().toISOString()
        };
        Storage.set(STORAGE_KEYS.VENDORS, [...vendors, newVendor]);
        notifyListeners(); // Notify listeners after adding vendor
        return newVendor;
    },

    getVendors: () => Storage.get(STORAGE_KEYS.VENDORS),

    removeVendor: (vendorId) => { // Implemented removeVendor function
        const vendors = Storage.get(STORAGE_KEYS.VENDORS);
        const updatedVendors = vendors.filter(v => v.id !== vendorId);
        Storage.set(STORAGE_KEYS.VENDORS, updatedVendors);
        notifyListeners(); // Notify listeners after removing vendor
    },


    // Low stock alerts
    getLowStockItems: () => {
        return Storage.get(STORAGE_KEYS.INVENTORY).filter(item =>
            item.quantity_on_hand <= item.low_stock_threshold
        );
    },

    // Inventory history
    getItemHistory: (itemId) => {
        return Storage.get(STORAGE_KEYS.INVENTORY_HISTORY)
            .filter(entry => entry.itemId === itemId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // Barcode lookup
    getByBarcode: (barcode) => {
        if (!validateBarcode(barcode)) {
            throw new Error('Invalid barcode format');
        }
        return Storage.get(STORAGE_KEYS.INVENTORY)
            .find(item => item.barcode === barcode);
    }
};