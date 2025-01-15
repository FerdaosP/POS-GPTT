// File: /src/components/SupplierDropdown.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierDropdown = ({ onChange, value }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   const apiUrl = 'http://localhost:8000/api/suppliers/'; // URL to get suppliers

    useEffect(() => {
            setLoading(true);
            setError(null);
            // Mock suppliers data
            const mockSuppliers = [
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
              setSuppliers(mockSuppliers)
             setLoading(false);
           }, 200);
    }, []); // Removed API URL


    if (loading) {
        return <option>Loading suppliers...</option>;
    }

    if (error) {
        return <option>Error fetching suppliers</option>;
    }

    return (
        <select
            onChange={onChange}
            value={value}
           className="select-premium"
        >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                </option>
            ))}
        </select>
    );
};

export default SupplierDropdown;