import React from 'react';
import { Link } from 'react-router-dom';

const CustomerList = ({ customers, currencySymbol }) => {
  const columns = [
    { key: 'name', header: 'Name', width: 'w-64' },
    { key: 'email', header: 'Email', width: 'w-64' },
    { key: 'phone', header: 'Phone', width: 'w-48' },
    { key: 'type', header: 'Type', width: 'w-32' },
    { key: 'totalSpending', header: 'Total Spending', width: 'w-48' },
    { key: 'lastActivityDate', header: 'Last Activity', width: 'w-48' },
    { key: 'actions', header: '', width: 'w-32' }
  ];

  const handleExportCustomers = () => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Total Spending', 'Last Activity'];
    const rows = customers.map(customer => [
      customer.type === 'company' ? customer.companyName : `${customer.firstName} ${customer.lastName}`,
      customer.email,
      customer.phone,
      customer.type || 'Unknown',
      customer.totalSpending?.toFixed(2) || '0.00',
      customer.lastActivityDate ? new Date(customer.lastActivityDate).toLocaleDateString() : 'No activity',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'customers_export.csv';
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Export Button */}
      <div className="p-4 border-b bg-gray-50 flex justify-end">
        <button
          onClick={handleExportCustomers}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Export Customers (CSV)
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b">
        {columns.map(col => (
          <div key={col.key} className={`${col.width} font-medium text-gray-600`}>
            {col.header}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y">
        {customers.map(customer => (
          <div key={customer.id} className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50">
            <div className="w-64">
              <Link to={`/customers/${customer.id}`} className="text-teal-600 hover:text-teal-700">
                {customer.type === 'company' ? customer.companyName : `${customer.firstName} ${customer.lastName}`}
              </Link>
            </div>
            <div className="w-64 truncate">{customer.email}</div>
            <div className="w-48">{customer.phone}</div>
            <div className="w-32 capitalize">{customer.type}</div>
            <div className="w-48">
              {currencySymbol}{customer.totalSpending?.toFixed(2) || '0.00'}
            </div>
            <div className="w-48">
              {customer.lastActivityDate 
                ? new Date(customer.lastActivityDate).toLocaleDateString() 
                : 'No activity'}
            </div>
            <div className="w-32 flex items-center gap-2">
              <button className="text-gray-500 hover:text-gray-700">
                {/* Edit icon */}
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                {/* More actions icon */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;