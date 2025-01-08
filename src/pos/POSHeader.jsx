// src/pos/POSHeader.jsx
import React from 'react';

const POSHeader = () => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                     placeholder="Scan or enter Ticket ID"
                    className="border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring focus:ring-blue-200"
                     aria-label="Re-open in POS"
                    />
            </div>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Scan or enter invoice ID"
                    className="border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring focus:ring-blue-200"
                   aria-label="Search for invoice"
                   />
            </div>
        </div>
    );
};

export default POSHeader;