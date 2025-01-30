import React, { useState, useEffect } from 'react';
import { InventoryManager } from '../utils/inventoryManager';

const ItemSelectorModal = ({ onClose, onSelectItem }) => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    loadInventory();
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
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const categories = [...new Set(inventory.map(item => item.type))];

  return (
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
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2 text-right">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="p-2 text-right">{item.quantity_on_hand}</td>
                  <td className="p-2 text-center">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectorModal;