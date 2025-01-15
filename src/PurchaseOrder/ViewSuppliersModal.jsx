// File: /src/purchaseOrder/ViewSuppliersModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import SupplierForm from './SupplierForm'; // Create this next
import axios from 'axios';

const ViewSuppliersModal = ({
    isOpen,
    onClose,
    showAddSupplierForm,
    onToggleAddSupplierForm,
    onSaveSupplier,
    onEditSupplier,
    onDeleteSupplier,
}) => {
    const [suppliers, setSuppliers] = useState([]);
     const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const apiUrl = 'http://localhost:8000/api/suppliers/'; // URL to get suppliers


   const fetchSuppliers = useCallback(async () => {
           setLoading(true);
            setError(null);
         // Mock suppliers data
            const mockSuppliers =  [
                {
                   id: 1,
                    name: "Supplier A",
                     address: "123 Main St",
                    contactPerson: "John Doe",
                    phone: "555-1234",
                    email: "john.doe@example.com",
                  vatNumber: "123456789",
                },
                {
                    id: 2,
                    name: "Supplier B",
                      address: "456 Oak Ave",
                    contactPerson: "Jane Smith",
                      phone: "555-5678",
                     email: "jane.smith@example.com",
                      vatNumber: "987654321",
                 },
            ];
           setTimeout(() => {
               setSuppliers(mockSuppliers);
               setLoading(false);
           }, 200);
         }, []);

    useEffect(() => {
        if(isOpen){
              fetchSuppliers();
        }
    }, [isOpen, fetchSuppliers]); // Added isOpen and fetchSuppliers dependency


     const handleEditClick = (supplier) => {
        setEditingSupplier(supplier);
    };

    const handleSaveEdit = async (updatedSupplier) => {
        await onEditSupplier(updatedSupplier);
        setEditingSupplier(null);
        await fetchSuppliers()
    };

    const handleCancelEdit = () => {
        setEditingSupplier(null);
    };

    const handleDelete = async (supplierId) => {
        await onDeleteSupplier(supplierId);
         await fetchSuppliers();
     }


    if (!isOpen) return null;
    if (loading) {
          return <div>Loading categories...</div>
      }

      if(error) {
          return <div className="text-red-500">Error loading categories.</div>
      }

    return (
        <div className="modal-premium">
            <div className="modal-content-premium">
                <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
                {!showAddSupplierForm ? (
                    <>
                        {suppliers?.map((supplier) => (
                            <div key={supplier.id} className="p-2 border rounded mb-2 flex justify-between items-center">
                                {editingSupplier?.id === supplier.id ? (
                                    <SupplierForm
                                        initialSupplier={editingSupplier}
                                        onSave={handleSaveEdit}
                                        onClose={handleCancelEdit}
                                    />
                                ) : (
                                    <>
                                        <span>{supplier.name}</span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(supplier)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supplier.id)} // Pass the supplier ID
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={onToggleAddSupplierForm}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Add Supplier
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <SupplierForm onSave={onSaveSupplier} onClose={onToggleAddSupplierForm} />
                        <button
                            onClick={onToggleAddSupplierForm}
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Back to Suppliers
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewSuppliersModal;