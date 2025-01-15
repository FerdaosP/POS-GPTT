import React, { useState, useEffect } from "react";
import InvoiceForm from "./InvoiceForm";
import CustomerForm from "../components/CustomerForm";

const InvoiceEntry = ({ customers, onSaveCustomer, invoices, onSaveInvoice, companyInfo }) => {
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
   const [mockInvoices, setMockInvoices] = useState([
        {
            invoiceNumber: 1,
            dateOfIssue: "2024-08-08",
            billTo: "Test Customer 1",
            billToEmail: "test1@test.com",
            billToAddress: "123 Test Street, Testville, Testland",
            billFrom: "Test Company",
            billFromEmail: "test@test.com",
            billFromAddress: "456 Test Street, Testtown, Testland",
            notes: "Thanks for your business!",
            total: "15.30",
            subTotal: "15.00",
            taxRate: "2.00",
            taxAmmount: "0.30",
            discountRate: "0.00",
            discountAmmount: "0.00",
             items: [
                  {
                    id: 0,
                    name: "Test Item",
                    description: "Test Item Description",
                    price: "15.00",
                    quantity: 1
                  }
                 ]
            },
        {
          invoiceNumber: 2,
            dateOfIssue: "2024-09-08",
            billTo: "Test Customer 2",
            billToEmail: "test2@test.com",
            billToAddress: "789 Fake Street, Fakesville, Fakeland",
            billFrom: "Test Company",
            billFromEmail: "test@test.com",
            billFromAddress: "456 Test Street, Testtown, Testland",
            notes: "Thanks for your business!",
            total: "32.20",
              subTotal: "32.00",
            taxRate: "0.00",
            taxAmmount: "0.00",
            discountRate: "0.00",
            discountAmmount: "0.00",
           items: [
                  {
                    id: 0,
                    name: "Test Item 2",
                    description: "Test Item Description 2",
                    price: "32.00",
                    quantity: 1
                  }
                 ]
        },
    ]);


  const handleSaveNewCustomer = (customer) => {
          onSaveCustomer(customer); // Save the customer to App state
        setShowCustomerForm(false); // Close form
    };
    const handleCancelCustomer = () => {
      setShowCustomerForm(false);
    }
   const handleAddCustomer = () => {
        setSelectedCustomer(null); // Clear form for a new customer
        setShowCustomerForm(true);
   };

  return (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Invoices</h2>
          {showCustomerForm ? (
              <CustomerForm
                  customer={selectedCustomer}
                  onSave={handleSaveNewCustomer}
                   onCancel={handleCancelCustomer}
              />
          ) : (
                <InvoiceForm
                    customers={customers}
                   onSaveInvoice={onSaveInvoice}
                 onAddCustomer={handleAddCustomer}
                   invoices={mockInvoices}
                    companyInfo={companyInfo}
                  />
            )}
    </div>
  );
};
export default InvoiceEntry;