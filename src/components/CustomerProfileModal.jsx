import React, { useEffect, useState } from 'react';

const CustomerProfileModal = ({ customer, onClose }) => {
  const [history, setHistory] = useState({
    repairs: [],
    transactions: []
  });

  useEffect(() => {
    const loadData = () => {
      const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]')
        .filter(t => t.customerId === customer.id);
      
      const repairs = JSON.parse(localStorage.getItem('repairs') || '[]')
        .filter(r => r.customerId === customer.id);

      setHistory({ repairs, transactions });
    };
    
    loadData();
  }, [customer]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {customer.type === 'company' 
            ? customer.companyName 
            : `${customer.firstName} ${customer.lastName}`}
        </h2>

        {/* Company Details */}
        {customer.type === 'company' && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Company Details</h3>
            <div className="p-3 border-b">
              <div className="flex justify-between">
                <span>VAT Number:</span>
                <span>{customer.vatNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* Repair History */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Repair History</h3>
          {history.repairs.map(repair => (
            <div key={repair.id} className="p-3 border-b">
              <div className="flex justify-between">
                <span>{repair.deviceType}</span>
                <span>${repair.basePrice}</span>
              </div>
              <div className="text-sm text-gray-600">
                {repair.repairTicketNumber} | {repair.status}
              </div>
            </div>
          ))}
        </div>

        {/* Transaction History */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Transaction History</h3>
          {history.transactions.map(transaction => (
            <div key={transaction.id} className="p-3 border-b">
              <div className="flex justify-between">
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                <span>${transaction.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600">
                {transaction.receiptId}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-4 bg-gray-200 py-2 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerProfileModal;