import React, { useState, useEffect } from 'react';
import { InventoryManager } from '../utils/inventoryManager';

const InventoryForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    price: item?.price || '',
    quantity_on_hand: item?.quantity_on_hand || '',
    type: item?.type || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          name="quantity_on_hand"
          type="number"
          value={formData.quantity_on_hand}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="device">Device</option>
          <option value="accessory">Accessory</option>
          <option value="part">Part</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {item ? 'Update' : 'Add'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const InventoryManagerModal = ({ onClose }) => {
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    setInventory(InventoryManager.getAll());
  };

  const handleSubmit = (formData) => {
    if (editingItem) {
      InventoryManager.updateItem({ ...editingItem, ...formData });
    } else {
      InventoryManager.addItem(formData);
    }
    loadInventory();
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      InventoryManager.removeItem(id);
      loadInventory();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inventory Manager</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Add Item
            </button>
          )}
        </div>

        {showForm ? (
          <InventoryForm
            item={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Stock</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.type}</td>
                    <td className="p-2 text-right">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="p-2 text-right">{item.quantity_on_hand}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InventoryManagerModal;