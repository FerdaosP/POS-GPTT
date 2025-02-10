// File: /src/utils/invoiceManager.js

const saveInvoiceForCustomer = (customerId, invoiceData) => {
    console.log("--- saveInvoiceForCustomer called ---"); // Added log
    console.log("Saving invoice for customer ID:", customerId);
    console.log("Invoice Data:", invoiceData);

    try {
        const invoices = JSON.parse(localStorage.getItem('customer_invoices') || '{}');
        console.log("Existing invoices (before save):", invoices); // Log existing invoices

        invoices[customerId] = invoices[customerId] || [];
        invoices[customerId].push(invoiceData);
        localStorage.setItem('customer_invoices', JSON.stringify(invoices));

        const updatedInvoices = JSON.parse(localStorage.getItem('customer_invoices') || '{}'); // Re-fetch and log
        console.log("Invoices after save:", updatedInvoices); // Log invoices after save
        console.log("Invoice saved to local storage (customer_invoices).");

        // --- Let's also update the customer object itself to store invoice IDs ---
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const customerIndex = customers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
            const customer = customers[customerIndex];
            const invoiceId = invoiceData.invoiceNumber; // Assuming invoiceNumber is unique ID
            const updatedCustomer = {
                ...customer,
                invoiceNumbers: customer.invoiceNumbers ? [...customer.invoiceNumbers, invoiceId] : [invoiceId]
            };
            customers[customerIndex] = updatedCustomer;
            localStorage.setItem('customers', JSON.stringify(customers));
            console.log("Customer object updated with invoice ID."); // Log customer update
        } else {
            console.warn("Customer not found when trying to save invoice association."); // Warn if customer not found
        }


    } catch (error) {
        console.error("Error saving invoice to local storage:", error);
    }

    return Promise.resolve();
};

export { saveInvoiceForCustomer };