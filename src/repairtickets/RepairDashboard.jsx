// /src/repairtickets/RepairDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RepairList from './components/RepairList';
import RepairFilters from './components/RepairFilters';
import AddRepairForm from './AddRepairForm';
import { getRepairs, updateRepairStatus } from '../utils/repairManager';

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

const RepairDashboard = () => {
  const [repairs, setRepairs] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: '30days',
    technician: 'all'
  });
  const [dateRange, setDateRange] = useState({});
  const [isAddRepairFormOpen, setIsAddRepairFormOpen] = useState(false);

  useEffect(() => {
    loadRepairs();
  }, [filters, dateRange]);

  const loadRepairs = () => {
    const allRepairs = getRepairs();
    const filteredRepairs = applyFilters(allRepairs);
    setRepairs(filteredRepairs);
  };

  const applyFilters = (repairs) => {
    return repairs.filter(repair => {
      // Status filter
      if (filters.status !== 'all' && repair.status !== filters.status) return false;
      
      // Search filter
      if (filters.search && !matchesSearch(repair)) return false;
      
      // Date range filter
      if (!withinDateRange(repair)) return false;
      
      // Technician filter
      if (filters.technician !== 'all' && repair.technician !== filters.technician) return false;
      
      return true;
    });
  };

  const matchesSearch = (repair) => {
    const searchLower = filters.search.toLowerCase();
    return (
      repair.ticketNumber.toLowerCase().includes(searchLower) ||
      repair.customerName.toLowerCase().includes(searchLower) ||
      repair.deviceType.toLowerCase().includes(searchLower) ||
      repair.imei.toLowerCase().includes(searchLower)
    );
  };

  const withinDateRange = (repair) => {
    const now = new Date();
    const repairDate = new Date(repair.dateReceived);
    
    switch (filters.dateRange) {
      case '7days':
        return now - repairDate <= 7 * 24 * 60 * 60 * 1000;
      case '30days':
        return now - repairDate <= 30 * 24 * 60 * 60 * 1000;
      case '90days':
        return now - repairDate <= 90 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  };

  const handleStatusChange = (repairId, newStatus) => {
    updateRepairStatus(repairId, newStatus);
    loadRepairs();
  };

  const handleSaveRepair = () => {
    setIsAddRepairFormOpen(false);
    loadRepairs(); // Refresh the repairs list after saving
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-teal-600 hover:text-teal-700 flex items-center">
            <ArrowLeft className="mr-1" size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Repair Management</h1>
          <div className="flex-1" />
          <ActionButton onClick={() => setIsAddRepairFormOpen(true)}>
            <Plus className="mr-2" size={16} />
            New Repair
          </ActionButton>
        </div>

        <DateFilter onChange={setDateRange} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Repairs</div>
            <div className="text-2xl font-bold">
              {repairs.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">In Progress</div>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'in-progress').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Completed</div>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'completed').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Pending</div>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'pending').length}
            </div>
          </div>
        </div>

        <RepairFilters filters={filters} setFilters={setFilters} />
        <RepairList repairs={repairs} onStatusChange={handleStatusChange} />

        {isAddRepairFormOpen && (
          <AddRepairForm
            isOpen={isAddRepairFormOpen}
            onClose={() => setIsAddRepairFormOpen(false)}
            onSave={handleSaveRepair}
          />
        )}
      </div>
    </div>
  );
};

export default RepairDashboard;
