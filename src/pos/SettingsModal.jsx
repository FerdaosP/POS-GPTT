// File: /src/pos/SettingsModal.jsx

import React, { useState } from 'react';
import ReceiptTemplateEditor from './ReceiptTemplateEditor';
import { Plus, Trash2 } from 'lucide-react';
import { TechnicianManager } from '../utils/technicianManager';
import { InventoryManager } from '../utils/inventoryManager';
import ConfirmationModal from '../components/ConfirmationModal'; // Import ConfirmationModal

const VATRatesSettings = () => {
    const [rates, setRates] = useState(() => {
        const stored = localStorage.getItem('vatRates');
        return stored ? JSON.parse(stored) : [
            { id: 1, description: 'Standard Rate', rate: 21 },
            { id: 2, description: 'Reduced Rate for Repairs', rate: 9 },
            { id: 3, description: 'Zero Rate', rate: 0 }
        ];
    });
    const [newRate, setNewRate] = useState({ description: '', rate: 0 });

    const addRate = () => {
        if (!newRate.description.trim() || isNaN(newRate.rate)) return;
        const updated = [...rates, { ...newRate, id: Date.now() }];
        setRates(updated);
        localStorage.setItem('vatRates', JSON.stringify(updated));
        setNewRate({ description: '', rate: 0 });
    };

    const removeRate = (id) => {
        const updated = rates.filter(rate => rate.id !== id);
        setRates(updated);
        localStorage.setItem('vatRates', JSON.stringify(updated));
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">VAT Rates</h3>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={newRate.description}
                    onChange={(e) => setNewRate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description"
                    className="w-full p-2 border rounded text-sm"
                />
                <input
                    type="number"
                    value={newRate.rate}
                    onChange={(e) => setNewRate(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    placeholder="Rate (%)"
                    className="w-24 p-2 border rounded text-sm"
                    min="0"
                    step="0.1"
                />
                <button
                    onClick={addRate}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                    <Plus size={16} />
                </button>
            </div>
            {rates.length > 0 && (
                <ul className="border rounded">
                    {rates.map(rate => (
                        <li key={rate.id} className="flex items-center justify-between p-2 border-b">
                            <span>{rate.description} ({rate.rate}%)</span>
                            <button
                                onClick={() => removeRate(rate.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const PaymentMethodsSettings = () => {
    const [methods, setMethods] = useState(() => {
        const stored = localStorage.getItem('customPaymentMethods');
        return stored ? JSON.parse(stored) : [];
    });
    const [newMethod, setNewMethod] = useState('');

    const addMethod = () => {
        if (!newMethod.trim()) return;
        const updated = [...methods, newMethod.trim()];
        setMethods(updated);
        localStorage.setItem('customPaymentMethods', JSON.stringify(updated));
        setNewMethod('');
    };

    const removeMethod = (indexToRemove) => {
        const updated = methods.filter((_, index) => index !== indexToRemove);
        setMethods(updated);
        localStorage.setItem('customPaymentMethods', JSON.stringify(updated));
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Custom Payment Methods</h3>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                    placeholder="Enter new payment method"
                    className="w-full p-2 border rounded text-sm"
                />
                <button
                    onClick={addMethod}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                    <Plus size={16} />
                </button>
            </div>
            {methods.length > 0 && (
                <ul className="border rounded">
                    {methods.map((m, index) => (
                        <li key={index} className="flex items-center justify-between p-2 border-b">
                            <span>{m}</span>
                            <button
                                onClick={() => removeMethod(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const SettingsModal = ({ onClose, onSave, initialTemplate, initialCurrency }) => {
    // Receipt Template and Currency
    const [template, setTemplate] = useState(initialTemplate);
    const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

    // Technician Management
    const [technicians, setTechnicians] = useState(TechnicianManager.getAll());
    const [newTechnician, setNewTechnician] = useState('');

    // Vendor Management
    const [vendors, setVendors] = useState(InventoryManager.getVendors());
    const [newVendor, setNewVendor] = useState('');
    const [vendorToDelete, setVendorToDelete] = useState(null); // State for vendor to delete
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for confirmation modal

    // Handler for saving settings
    const handleSave = () => {
        onSave(template, selectedCurrency);
        onClose();
    };

    // Technician handlers
    const handleAddTechnician = () => {
        if (newTechnician.trim()) {
            const added = TechnicianManager.add({ name: newTechnician.trim() });
            setTechnicians(prev => [...prev, added]);
            setNewTechnician('');
        }
    };

    const handleDeleteTechnician = (id) => {
        TechnicianManager.delete(id);
        setTechnicians(prev => prev.filter(t => t.id !== id));
    };

    // Vendor handlers
    const handleAddVendor = () => {
        if (newVendor.trim()) {
            const added = InventoryManager.addVendor({ name: newVendor.trim() });
            setVendors(prev => [...prev, added]);
            setNewVendor('');
        }
    };

    const confirmDeleteVendor = (vendor) => {
        setVendorToDelete(vendor);
        setShowConfirmationModal(true);
    };

    const handleDeleteVendor = (vendorId) => {
        InventoryManager.removeVendor(vendorId); // Call removeVendor from InventoryManager
        setVendors(prev => prev.filter(v => v.id !== vendorId));
        setShowConfirmationModal(false); // Close confirmation modal
        setVendorToDelete(null); // Reset vendorToDelete
    };

    const cancelDeleteVendor = () => {
        setShowConfirmationModal(false); // Close confirmation modal
        setVendorToDelete(null); // Reset vendorToDelete
    };


    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">System Settings</h2>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* VAT Rates Section */}
                    <VATRatesSettings />

                    {/* Currency Settings */}
                    <div>
                        <label className="block text-sm font-medium mb-4">Currency Settings</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-2">Currency Code</label>
                                <select
                                    value={selectedCurrency.code}
                                    onChange={(e) => {
                                        const code = e.target.value;
                                        const symbol = { USD: '$', EUR: '€', GBP: '£' }[code];
                                        setSelectedCurrency({ code, symbol });
                                    }}
                                    className="w-full p-2 border rounded text-sm"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Currency Symbol</label>
                                <input
                                    type="text"
                                    value={selectedCurrency.symbol}
                                    readOnly
                                    className="w-full p-2 border rounded bg-gray-100 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Receipt Template Editor with Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-4">Receipt Template</label>
                        <div className="mb-4">
                            <label className="block mb-2">Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setTemplate(prev => ({
                                                ...prev,
                                                logoUrl: event.target.result,
                                                showLogo: true
                                            }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full p-2 border rounded"
                            />
                            {template.logoUrl && (
                                <img src={template.logoUrl} alt="Logo Preview" className="mt-2 max-h-20" />
                            )}
                        </div>
                        <ReceiptTemplateEditor
                            template={template}
                            onSave={setTemplate}
                            inlineMode={true}
                        />
                    </div>

                    {/* Payment Methods Section */}
                    <PaymentMethodsSettings />

                    {/* Technician Management */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Technician Management</h3>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newTechnician}
                                onChange={(e) => setNewTechnician(e.target.value)}
                                placeholder="New technician name"
                                className="w-full p-2 border rounded text-sm"
                            />
                            <button
                                onClick={handleAddTechnician}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {technicians.length > 0 && (
                            <ul className="border rounded">
                                {technicians.map(tech => (
                                    <li key={tech.id} className="flex items-center justify-between p-2 border-b">
                                        <span>{tech.name}</span>
                                        <button
                                            onClick={() => handleDeleteTechnician(tech.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Vendor Management */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Vendor Management</h3>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newVendor}
                                onChange={(e) => setNewVendor(e.target.value)}
                                placeholder="Enter new vendor name"
                                className="w-full p-2 border rounded text-sm"
                            />
                            <button
                                onClick={handleAddVendor}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {vendors.length > 0 && (
                            <ul className="border rounded">
                                {vendors.map(vendor => (
                                    <li key={vendor.id} className="flex items-center justify-between p-2 border-b">
                                        <span>{vendor.name}</span>
                                        <button
                                            onClick={() => confirmDeleteVendor(vendor)} // Call confirmDeleteVendor
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            {/* Confirmation Modal for Vendor Delete */}
            {showConfirmationModal && vendorToDelete && (
                <ConfirmationModal
                    message={`Are you sure you want to delete vendor "${vendorToDelete.name}"?`}
                    confirmText="Delete Vendor"
                    cancelText="Cancel"
                    onConfirm={() => handleDeleteVendor(vendorToDelete.id)}
                    onCancel={cancelDeleteVendor}
                />
            )}
        </div>
    );
};

export default SettingsModal;