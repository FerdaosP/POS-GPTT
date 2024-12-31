import React, { useState, useEffect } from "react";
import InvoiceForm from "./InvoiceForm";

const InvoiceEntry = ({onSaveInvoice, invoices}) => {
  const handleSaveInvoice = (invoice) => {
          onSaveInvoice((prevInvoices) => [...prevInvoices, invoice]);
    }
  return (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      <InvoiceForm onSaveInvoice={handleSaveInvoice} />
    </div>
  );
};
export default InvoiceEntry;