// AddCustomerForm.jsx
import React, { useState } from 'react';
import { saveCustomer } from '../utils/customerUtils'
const AddCustomerForm = ({ isOpen, onClose, onSave, editingCustomer }) => {  // Receive editingCustomer
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phone: '',
        type: editingCustomer ? editingCustomer.type : 'person', // Set type based on editingCustomer
        status: 'active',
        taxExempt: false // Adding Tax exempt boolean

    });

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const newCustomer = saveCustomer(formData); //this handles new or updated
            onSave(newCustomer);
            onClose(); //close after saving
        } catch (error) {
            alert(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add Customer</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/*Type is locked during editing*/}
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full p-2 border rounded"
                        disabled={!!editingCustomer}
                    >
                        <option value="person">Individual</option>
                        <option value="company">Company</option>
                    </select>

                    {formData.type === 'company' ? (
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    ) : (
                        <>
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
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-teal-600"
                            checked={formData.taxExempt}
                            onChange={(e) => setFormData(prev => ({ ...prev, taxExempt: e.target.checked }))}
                        />
                        <span className="ml-2 text-gray-700">Tax Exempt</span>
                    </label>
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

export default AddCustomerForm;