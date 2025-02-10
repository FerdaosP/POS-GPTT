import React, { useState, useEffect, useRef } from 'react';
import { InventoryManager } from '../utils/inventoryManager';
import { AlertCircle, History } from 'lucide-react';

const ItemSelectorModal = ({ onClose, onSelectItem, currencySymbol }) => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedItemHistory, setSelectedItemHistory] = useState([]);

  useEffect(() => {
    loadInventory();
    // Listen for inventory updates from other components
    const updateListener = () => loadInventory();
    InventoryManager.addUpdateListener(updateListener);
    return () => InventoryManager.removeUpdateListener(updateListener);
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, inventory]);

  const loadInventory = () => {
    setInventory(InventoryManager.getAll());
  };

  const filterItems = () => {
        let items = inventory;

        // Filter by search query
        if (searchQuery) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.barcode?.includes(searchQuery) // Search by barcode too
            );
        }

        // Filter by category
        if (selectedCategory) {
            items = items.filter(item => item.type === selectedCategory);
        }

        setFilteredItems(items);
    };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleViewHistory = (itemId) => {
    setSelectedItemHistory(InventoryManager.getItemHistory(itemId));
    setShowHistory(true);
  };

  const categories = [...new Set(inventory.map(item => item.type))];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Select Item from Inventory</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`p-2 rounded ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Item List */}
          <div className="overflow-x-auto max-h-96">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 sticky top-0">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Stock</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {item.quantity_on_hand <= item.low_stock_threshold && (
                        <span className="text-yellow-600 mr-2" title="Low stock">
                          <AlertCircle size={16} />
                        </span>
                      )}
                      {item.name}
                    </td>
                    <td className="p-2">{item.type}</td>
                    <td className="p-2 text-right">{currencySymbol}{parseFloat(item.price).toFixed(2)}</td>
                    <td className="p-2 text-right">
                      <span className={item.quantity_on_hand <= item.low_stock_threshold ? 'text-yellow-600' : ''}>
                        {item.quantity_on_hand}
                      </span>
                    </td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => {
                          if (item.quantity_on_hand > 0) {
                            onSelectItem(item);
                          } else {
                            alert('Item out of stock');
                          }
                        }}
                        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-300"
                        disabled={item.quantity_on_hand <= 0}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleViewHistory(item.id)}
                        className="text-gray-600 hover:text-gray-800"
                        title="View History"
                      >
                        <History size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Item History</h3>
            <div className="max-h-96 overflow-y-auto">
              {selectedItemHistory.map(entry => (
                <div key={entry.id} className="border-b py-2">
                  <div className="text-sm text-gray-600">{new Date(entry.timestamp).toLocaleString()}</div>
                  <div className="font-medium">{entry.action}</div>
                  <div className="text-sm text-gray-600">{entry.details}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemSelectorModal;