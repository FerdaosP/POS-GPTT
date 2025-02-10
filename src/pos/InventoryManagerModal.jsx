// File: /pos/InventoryManagerModal.jsx

import React, { useState, useEffect } from 'react';
import { InventoryManager } from '../utils/inventoryManager';
import { Download, Upload, AlertCircle, History, Plus } from 'lucide-react';

const InventoryForm = ({ item, onSubmit, onCancel, currencySymbol, vendors }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        price: item?.price || '',
        quantity_on_hand: item?.quantity_on_hand || '',
        type: item?.type || '',
        barcode: item?.barcode || '',
        vendor_id: item?.vendor_id || '',
        low_stock_threshold: item?.low_stock_threshold || 5,
        vatRateId: item?.vatRateId || ''
    });

    const [vatRates, setVatRates] = useState([]);
    const [isPriceInclusiveOfTax, setIsPriceInclusiveOfTax] = useState(false);

    useEffect(() => {
        const rates = JSON.parse(localStorage.getItem('vatRates')) || [];
        setVatRates(rates);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Parse to int if the field is quantity_on_hand or low_stock_threshold,
        // Parse to float if it is price.  Otherwise, keep as string
        const parsedValue = (name === 'quantity_on_hand' || name === 'low_stock_threshold')
            ? parseInt(value, 10)
            : name === 'price'
                ? parseFloat(value)
                : value;

        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const calculatePriceBeforeTax = (inclusivePrice, vatRateId) => {
        if (!inclusivePrice || !vatRateId) return inclusivePrice;

        const vatRate = vatRates.find(rate => rate.id === parseInt(vatRateId, 10));
        if (!vatRate) return inclusivePrice;

        const taxRatePercentage = vatRate.rate / 100;
        return inclusivePrice / (1 + taxRatePercentage);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalPrice = formData.price;

        if (isPriceInclusiveOfTax) {
            finalPrice = calculatePriceBeforeTax(formData.price, formData.vatRateId);
        }

        // Convert vatRateId to a number, or null if empty string
        const finalFormData = {
            ...formData,
            price: finalPrice,
            vatRateId: formData.vatRateId ? parseInt(formData.vatRateId, 10) : null,
        };
        onSubmit(finalFormData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium">Barcode</label>
                    <input
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Optional"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <div>
                    <label className="block text-sm font-medium">Vendor</label>
                    <select
                        name="vendor_id"
                        value={formData.vendor_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select Vendor</option>
                        {vendors.map(vendor => (
                            <option key={vendor.id} value={vendor.id}>
                                {vendor.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium">Low Stock Threshold</label>
                <input
                    name="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    min="0"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">VAT Rate</label>
                <select
                    name="vatRateId"
                    value={formData.vatRateId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select VAT Rate</option>
                    {vatRates.map(rate => (
                        <option key={rate.id} value={rate.id}>
                            {rate.description} ({rate.rate}%)
                        </option>
                    ))}
                </select>
            </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-teal-600"
                    checked={isPriceInclusiveOfTax}
                    onChange={(e) => setIsPriceInclusiveOfTax(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-700">Price Includes Tax</span>
                </label>
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

const InventoryManagerModal = ({ onClose, currencySymbol }) => {
    const [inventory, setInventory] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [selectedItemHistory, setSelectedItemHistory] = useState([]);


    useEffect(() => {
        loadInventory();
        loadVendors();
    }, []);

    const loadInventory = () => {
        setInventory(InventoryManager.getAll());
    };

    const loadVendors = () => {
        setVendors(InventoryManager.getVendors());
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

    const handleBulkImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const items = JSON.parse(event.target.result);
                    // Convert vatRateId to a number (or null) for each imported item.
                    const itemsWithVat = items.map(item => ({
                        ...item,
                        vatRateId: item.vatRateId ? parseInt(item.vatRateId, 10) : null,
                    }));

                    InventoryManager.bulkImport(itemsWithVat);
                    loadInventory();
                } catch (error) {
                    alert('Error importing inventory: Invalid file format');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleBulkExport = () => {
        const data = InventoryManager.bulkExport();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory_export.json';
        link.click();
    };

    const handleViewHistory = (itemId) => {
        setSelectedItemHistory(InventoryManager.getItemHistory(itemId));
        setShowHistory(true);
    };

    const lowStockItems = InventoryManager.getLowStockItems();

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Inventory Manager</h2>
                    <div className="flex gap-2">
                        {!showForm && (
                            <>
                                <button
                                    onClick={() => {
                                        setShowForm(true);
                                        setEditingItem(null); // Ensure editingItem is null when adding a new item
                                    }}
                                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Item
                                </button>
                                <label className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                                    <Upload size={16} />
                                    Import
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleBulkImport}
                                        accept=".json"
                                    />
                                </label>
                                <button
                                    onClick={handleBulkExport}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    Export
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {showForm ? (
                    <InventoryForm
                        currencySymbol={currencySymbol}
                        item={editingItem}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingItem(null);
                        }}
                        vendors={vendors}
                    />
                ) : (
                    <div className="space-y-4">
                        {lowStockItems.length > 0 && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    Low Stock Alerts
                                </h3>
                                <div className="mt-2 space-y-2">
                                    {lowStockItems.map(item => (
                                        <div key={item.id} className="text-sm text-yellow-700">
                                            {item.name} - Only {item.quantity_on_hand} remaining (threshold: {item.low_stock_threshold})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 text-left">Name</th>
                                        <th className="p-2 text-left">Type</th>
                                        <th className="p-2 text-left">Barcode</th>
                                        <th className="p-2 text-right">Price</th>
                                        <th className="p-2 text-right">Stock</th>
                                        <th className="p-2 text-left">VAT Rate</th> {/* Added VAT Rate column */}
                                        <th className="p-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(item => {
                                        const vatRate = JSON.parse(localStorage.getItem('vatRates'))?.find(rate => rate.id === item.vatRateId);
                                        return (
                                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2">{item.name}</td>
                                                <td className="p-2">{item.type}</td>
                                                <td className="p-2">{item.barcode || '-'}</td>
                                                <td className="p-2 text-right">{currencySymbol}{parseFloat(item.price).toFixed(2)}</td>
                                                <td className="p-2 text-right">{item.quantity_on_hand}</td>
                                                <td className="p-2">{vatRate ? `${vatRate.description} (${vatRate.rate}%)` : 'N/A'}</td> {/* Display VAT Rate */}
                                                <td className="p-2 text-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingItem(item);
                                                            setShowForm(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewHistory(item.id)}
                                                        className="text-gray-600 hover:text-gray-800"
                                                    >
                                                        <History size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {showHistory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                            <h3 className="text-lg font-bold mb-4">Inventory History</h3>
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