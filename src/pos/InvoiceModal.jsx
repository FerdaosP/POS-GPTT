// /src/pos/InvoiceModal.jsx
import React from 'react';
import Invoice from './Invoice';

const InvoiceModal = ({ currency, invoice, template, onNewTransaction }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-green-600">Invoice Generated</h2>
          <p className="text-sm text-gray-600">
            Review your invoice below. Use the options to print or start a new transaction.
          </p>
        </div>

        {/* Render the Invoice using the Invoice component */}
        <Invoice 
          invoice={invoice} 
          template={template} 
          currency={currency} 
          taxByRate={invoice.taxByRate} 
        />

        {/* Action Buttons */}
        <div className="print:hidden flex gap-2 mt-4">
          <button
            onClick={() => window.print()}
            className="flex-1 p-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Print Invoice
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
};

export default InvoiceModal;