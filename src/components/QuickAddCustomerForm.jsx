import React, { useState } from 'react';
import { saveCustomer } from '../utils/customerUtils';

const QuickAddCustomerForm = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    primaryAddress: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newCustomer = saveCustomer(formData);
      onSave(newCustomer);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full pointer-events-auto">
        <h2 className="text-xl font-bold mb-4">Add Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Primary Address"
            value={formData.primaryAddress}
            onChange={(e) => setFormData({ ...formData, primaryAddress: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddCustomerForm;