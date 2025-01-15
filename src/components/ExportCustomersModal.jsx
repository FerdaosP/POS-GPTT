import React, { useState } from 'react';
import axios from 'axios';
import { XCircle } from "lucide-react";

const ExportCustomersModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

    const handleExport = async () => {
        setError(null);
        setLoading(true);
           // Simulate a download
            setTimeout(() => {
                setLoading(false);
                  onClose();
                alert("Simulated export completed! In a real app, a file would be downloaded");
            }, 1000); // Simulate a 1 second delay
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Export Customers</h2>
                      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full" aria-label="close modal">
                         <XCircle size={20}/>
                       </button>
                  </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleExport}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                          disabled={loading}
                        >
                        {loading ? "Exporting..." : "Export"}
                       </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                         Cancel
                      </button>
                </div>
           </div>
       </div>
    );
};

export default ExportCustomersModal;