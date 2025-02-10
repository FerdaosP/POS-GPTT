// customerUtils.jsx
// Utility functions for managing customers

/**
 * Get all customers from localStorage
 * @returns {Array} List of customers
 */
export const getCustomers = () => {
  const customers = JSON.parse(localStorage.getItem('customers')) || [];
  return customers
    .map((c) => ({
      type: 'person',
      loyaltyPoints: 0,
      storeCredits: 0,
      purchaseHistory: [],
      ...c,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by most recent
};

/**
 * Get a customer by their ID
 * @param {string} customerId - The ID of the customer to find
 * @returns {Object|null} The customer object or null if not found
 */
export const getCustomerById = (customerId) => {
  const customers = getCustomers();
  return customers.find(c => c.id === customerId) || null;
};

/**
 * Save a customer to localStorage
 * @param {Object} customer - The customer object to save
 * @returns {Object} The saved customer
 */
export const saveCustomer = (customer) => {
    const customers = getCustomers();
    if (customer.id) {
      // Update existing customer
      const index = customers.findIndex((c) => c.id === customer.id);
      if (index === -1) throw new Error("Customer not found");

      customers[index] = {
        ...customers[index], // Keep existing fields
        ...customer,        // Overwrite with new data
      };
      localStorage.setItem("customers", JSON.stringify(customers));
      return customers[index]; //return the updated customer
    } else {
      // Create new customer
      const newCustomer = {
        id: `CUST-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...customer,
      };
      customers.push(newCustomer);
      localStorage.setItem("customers", JSON.stringify(customers));
      return newCustomer; // Return newly created customer
    }
  };

/**
 * Update a customer's details
 * @param {string} customerId - The ID of the customer to update
 * @param {Object} updates - The updates to apply
 * @returns {Object} The updated customer
 */
export const updateCustomer = (customerId, updates) => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === customerId);
  if (index === -1) throw new Error('Customer not found');

  const updatedCustomer = {
    ...customers[index],
    ...updates
  };

  customers[index] = updatedCustomer;
  localStorage.setItem('customers', JSON.stringify(customers));
  return updatedCustomer;
};

/**
 * Add loyalty points to a customer
 * @param {string} customerId - The ID of the customer
 * @param {number} points - The number of points to add
 * @returns {Object} The updated customer
 */
export const addLoyaltyPoints = (customerId, points) => {
  const customer = getCustomers().find(c => c.id === customerId);
  if (!customer) throw new Error('Customer not found');

  return updateCustomer(customerId, {
    loyaltyPoints: (customer.loyaltyPoints || 0) + points
  });
};

/**
 * Add store credits to a customer
 * @param {string} customerId - The ID of the customer
 * @param {number} amount - The amount of store credits to add
 * @returns {Object} The updated customer
 */
export const addStoreCredits = (customerId, amount) => {
  const customer = getCustomers().find(c => c.id === customerId);
  if (!customer) throw new Error('Customer not found');

  return updateCustomer(customerId, {
    storeCredits: (customer.storeCredits || 0) + amount
  });
};

/**
 * Delete a customer by their ID
 * @param {string} customerId - The ID of the customer to delete
 * @returns {Array} The updated list of customers -  No longer needed
 */
export const deleteCustomer = (customerId) => {
    const customers = getCustomers();
    const filteredCustomers = customers.filter((c) => c.id !== customerId);
    localStorage.setItem("customers", JSON.stringify(filteredCustomers));
  };

/**
 * Append an invoice to the specified customer’s record.
 * @param {string} customerId - The ID of the customer
 * @param {Object} invoice - The invoice object to append
 * @returns {Object} The updated customer object
 */
export const saveInvoiceForCustomer = (customerId, invoice) => {
  // Get the current customer (using your existing getter)
  const customer = getCustomerById(customerId);
  if (!customer) throw new Error('Customer not found');

  // Append the invoice to the customer's invoices array.
  const updatedCustomer = {
    ...customer,
    invoices: customer.invoices ? [...customer.invoices, invoice] : [invoice],
  };

  // Use the existing updateCustomer to save the changes.
  return updateCustomer(customerId, updatedCustomer);
};