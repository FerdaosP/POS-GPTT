import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomerList from './components/CustomerList';
import CustomerFilters from './components/CustomerFilters';
import AddCustomerForm from './AddCustomerForm';
import { getCustomers } from '../utils/customerUtils';

const ActionButton = ({ children, ...props }) => (
  <button
    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
    {...props}
  >
    {children}
  </button>
);

const DateFilter = ({ onChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (startDate && endDate) {
      onChange({ start: startDate, end: endDate });
    }
  }, [startDate, endDate, onChange]);

  const handleQuickFilter = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case 'today':
        start = new Date(today);
        end = new Date(today);
        break;
      case 'thisWeek':
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        end = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        start = null;
        end = null;
    }

    setDateRange([start, end]);
    onChange({ start, end });
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleQuickFilter('today')}
          className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          Today
        </button>
        <button
          onClick={() => handleQuickFilter('thisWeek')}
          className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          This Week
        </button>
        <button
          onClick={() => handleQuickFilter('thisMonth')}
          className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          This Month
        </button>
      </div>
      <ReactDatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        isClearable
        placeholderText="Select date range"
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    dateRange: '30days',
    status: 'all'
  });
  const [dateRange, setDateRange] = useState({});
  const [isAddCustomerFormOpen, setIsAddCustomerFormOpen] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [filters, dateRange]);

  const loadCustomers = () => {
    const allCustomers = getCustomers();
    const filteredCustomers = applyFilters(allCustomers);
    setCustomers(filteredCustomers);
  };

  const applyFilters = (customers) => {
    return customers.filter(customer => {
      // Type filter
      if (filters.type !== 'all' && customer.type !== filters.type) return false;
      
      // Search filter
      if (filters.search && !matchesSearch(customer)) return false;
      
      // Date range filter
      if (!withinDateRange(customer)) return false;
      
      // Status filter
      if (filters.status !== 'all' && customer.status !== filters.status) return false;
      
      return true;
    });
  };

  const matchesSearch = (customer) => {
    const searchLower = filters.search.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    );
  };

  const withinDateRange = (customer) => {
    const customerDate = new Date(customer.createdAt);
    const now = new Date();

    // Check custom date range first
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return customerDate >= start && customerDate <= end;
    }

    // Check dropdown filter
    switch (filters.dateRange) {
      case '7days':
        return now - customerDate <= 7 * 24 * 60 * 60 * 1000;
      case '30days':
        return now - customerDate <= 30 * 24 * 60 * 60 * 1000;
      case '90days':
        return now - customerDate <= 90 * 24 * 60 * 60 * 1000;
      case 'all':
      default:
        return true;
    }
  };

  const handleSaveCustomer = () => {
    setIsAddCustomerFormOpen(false);
    loadCustomers(); // Refresh the customers list after saving
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-teal-600 hover:text-teal-700 flex items-center">
            <ArrowLeft className="mr-1" size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <div className="flex-1" />
          <ActionButton onClick={() => setIsAddCustomerFormOpen(true)}>
            <Plus className="mr-2" size={16} />
            New Customer
          </ActionButton>
        </div>

        <DateFilter onChange={setDateRange} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Customers</div>
            <div className="text-2xl font-bold">
              {customers.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Active Customers</div>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Inactive Customers</div>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'inactive').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">New Customers (30d)</div>
            <div className="text-2xl font-bold">
              {customers.filter(c => new Date() - new Date(c.createdAt) <= 30 * 24 * 60 * 60 * 1000).length}
            </div>
          </div>
        </div>

        <CustomerFilters filters={filters} setFilters={setFilters} />
        <CustomerList customers={customers} />

        {isAddCustomerFormOpen && (
          <AddCustomerForm
            isOpen={isAddCustomerFormOpen}
            onClose={() => setIsAddCustomerFormOpen(false)}
            onSave={handleSaveCustomer}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;