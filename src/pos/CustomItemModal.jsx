import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CustomItemModal = ({ isOpen, onClose, onAddItem, currencySymbol }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [vatRateId, setVatRateId] = useState('');
  const [saveTemporary, setSaveTemporary] = useState(false);
  const [vatRates, setVatRates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const rates = JSON.parse(localStorage.getItem('vatRates')) || [];
    setVatRates(rates);
    if (rates.length > 0) setVatRateId(rates[0].id);
  }, []);

  const handleSubmit = () => {
    if (!name || !price) {
      setError('Name and price are required');
      return;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      setError('Invalid price value');
      return;
    }

    const newItem = {
      id: `custom-${Date.now()}`,
      isCustom: true,
      name,
      price: parseFloat(price),
      qty: parseInt(quantity),
      vatRateId,
      customDescription: name,
      temporaryItem: saveTemporary
    };

    if (saveTemporary) {
      const temporaryItems = JSON.parse(localStorage.getItem('temporaryItems') || '[]');
      localStorage.setItem('temporaryItems', JSON.stringify([...temporaryItems, newItem]));
    }

    onAddItem(newItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Custom Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block mb-2">Item Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Price ({currencySymbol}) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">VAT Rate</label>
            <select
              value={vatRateId}
              onChange={(e) => setVatRateId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {vatRates.map(rate => (
                <option key={rate.id} value={rate.id}>
                  {rate.description} ({rate.rate}%)
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={saveTemporary}
              onChange={(e) => setSaveTemporary(e.target.checked)}
            />
            Save for later use
          </label>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Add to Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomItemModal;