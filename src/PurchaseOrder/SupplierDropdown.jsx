// File: /src/components/SupplierDropdown.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierDropdown = ({ onChange, value }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   const apiUrl = 'http://localhost:8000/api/suppliers/'; // URL to get suppliers

    useEffect(() => {
        const fetchSuppliers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(apiUrl); // URL to fetch all the suppliers
                setSuppliers(response.data);
            } catch (err) {
                console.error("Error fetching suppliers:", err);
                setError("Error fetching suppliers. Please check the console.");
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, [apiUrl]); // Added apiUrl to dependency array

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