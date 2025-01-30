export const getCustomers = () => {
  const customers = JSON.parse(localStorage.getItem('customers')) || [];
  return customers.map(c => ({
    type: 'person',
    loyaltyPoints: 0,
    storeCredits: 0,
    purchaseHistory: [],
    ...c
  }));
};

export const saveCustomer = (customer) => {
    const customers = getCustomers();
    if (customer.id) {
      const index = customers.findIndex(c => c.id === customer.id);
      if (index === -1) throw new Error('Customer not found');
      
      customers[index] = {
        ...customers[index],
        ...customer
      };
    } else {
      customers.push({
        id: `CUST-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...customer
      });
    }
    localStorage.setItem('customers', JSON.stringify(customers));
    return customer;
};

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

export const addLoyaltyPoints = (customerId, points) => {
    const customer = getCustomers().find(c => c.id === customerId);
    if (!customer) throw new Error('Customer not found');
    
    return updateCustomer(customerId, {
      loyaltyPoints: (customer.loyaltyPoints || 0) + points
    });
};

export const addStoreCredits = (customerId, amount) => {
    const customer = getCustomers().find(c => c.id === customerId);
    if (!customer) throw new Error('Customer not found');
    
    return updateCustomer(customerId, {
      storeCredits: (customer.storeCredits || 0) + amount
    });
};

export const deleteCustomer = (customerId) => {
    const customers = getCustomers();
    const updatedCustomers = customers.filter(c => c.id !== customerId); // Filter out the customer to delete
    localStorage.setItem('customers', JSON.stringify(updatedCustomers)); // Save the updated list
    return updatedCustomers; // Return the updated list for immediate use
};