import React from 'react';
import Receipt from './Receipt';

const ReceiptModal = ({ transaction, onNewTransaction }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-lg max-w-md print:p-0 print:shadow-none print:bg-transparent pointer-events-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-green-600">Success!</h2>
        <p className="text-sm text-gray-600">Transaction completed</p>
      </div>
      
      <Receipt receipt={transaction} />

      <div className="print:hidden flex gap-2 mt-4">
        <button 
          onClick={() => window.print()}
          className="flex-1 p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Print Receipt
        </button>
        <button
          onClick={onNewTransaction}
          className="flex-1 p-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          New Transaction
        </button>
      </div>
    </div>
  </div>
);

export default ReceiptModal;