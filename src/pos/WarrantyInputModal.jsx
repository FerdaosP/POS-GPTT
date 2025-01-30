import React, { useState } from 'react';

const WarrantyInputModal = ({ device, onClose, onConfirm }) => {
  const [months, setMonths] = useState(12);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full pointer-events-auto">
        <h2 className="text-lg font-bold mb-4">Add Warranty for {device.deviceType}</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Warranty Duration (months)</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(months)}
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

export default WarrantyInputModal;