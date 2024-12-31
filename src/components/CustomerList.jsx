import React, { useState } from "react";
import CustomerForm from "./CustomerForm";

const CustomerList = ({ customers = [], onSaveCustomer, onDeleteCustomer }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleAddCustomer = () => {
    setSelectedCustomer(null); // Clear form for a new customer
    setShowForm(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer); // Populate form with selected customer details
    setShowForm(true);
  };

  const handleSaveCustomer = (customer) => {
    onSaveCustomer(customer); // Save the customer to App state
    setShowForm(false); // Close form
  };

  const handleCancel = () => {
    setShowForm(false); // Close form without saving
  };

  const handleDelete = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      onDeleteCustomer(customerId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{customer.id}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.name}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
              <td className="border border-gray-300 px-4 py-2">{customer.phone}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  onClick={() => handleEditCustomer(customer)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddCustomer}
        className="mt-4 bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
      >
        Add Customer
      </button>

      {showForm && (
        <CustomerForm
          customer={selectedCustomer}
          onSave={handleSaveCustomer}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default CustomerList;
