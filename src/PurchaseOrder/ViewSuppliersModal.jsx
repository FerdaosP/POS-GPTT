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
            try {
                const response = await axios.get(apiUrl);
                 const suppliersData = response.data.map(item => ({
                id: item.id,
                name: item.name,
                address: item.address,
                contactPerson: item.contactPerson,
                 phone: item.phone,
                email: item.email,
                vatNumber: item.vatNumber,
                 }));
                setSuppliers(suppliersData);

            } catch (err) {
                console.error("Error fetching Suppliers", err);
                setError("Error fetching suppliers. Check the console");
            } finally {
                  setLoading(false);
            }
         }, [apiUrl]);

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