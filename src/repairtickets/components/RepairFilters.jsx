import React from 'react';
import { Search, Calendar, User, Filter } from 'lucide-react';

const RepairFilters = ({ filters, setFilters }) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'received', label: 'Received' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'waiting', label: 'Waiting for Parts' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search repairs..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Date Range Filter */}
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
        >
          {dateRangeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Technician Filter */}
        <select
          value={filters.technician}
          onChange={(e) => setFilters({ ...filters, technician: e.target.value })}
          className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
        >
          <option value="all">All Technicians</option>
          {/* Populate with actual technicians */}
        </select>
      </div>
    </div>
  );
};

export default RepairFilters;