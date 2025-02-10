// /src/repairtickets/components/RepairList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getCustomerById } from '../../utils/customerUtils'; // Import getCustomerById
import { Edit, MoreHorizontal } from 'lucide-react'; // Import Icons

const statusOptions = [
  { value: 'received', label: 'Received' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'waiting', label: 'Waiting for Parts' },
  { value: 'cancelled', label: 'Cancelled' }
];

const RepairList = ({ repairs, onStatusChange }) => {
  const columns = [
    { key: 'ticketNumber', header: 'Ticket #', width: 'w-32' },
    { key: 'status', header: 'Status', width: 'w-40' }, // a bit wider for the dropdown
    { key: 'customerName', header: 'Customer', width: 'w-64' },
    { key: 'deviceType', header: 'Device', width: 'w-64' },
    { key: 'dateReceived', header: 'Received', width: 'w-48' },
    { key: 'technician', header: 'Technician', width: 'w-48' },
    { key: 'actions', header: '', width: 'w-32' }
  ];

  const handleStatusChange = (repairId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(repairId, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table Header */}
      <div className="flex px-6 py-3 bg-gray-50 border-b">
        {columns.map(col => (
          <div key={col.key} className={`${col.width} px-4 font-medium text-gray-600`}>
            {col.header}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y">
        {repairs.map(repair => (
          <div key={repair.id} className="flex px-6 py-4 hover:bg-gray-50">
            <div className="w-32 px-4">
              <Link
                to={`/repairs/${repair.id}`}
                className="text-teal-600 hover:text-teal-700 truncate block"
              >
                {repair.ticketNumber}
              </Link>
            </div>
            <div className="w-40 px-4">
              <select
                value={repair.status}
                onChange={(e) => handleStatusChange(repair.id, e.target.value)}
                className="border p-1 rounded text-sm"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-64 px-4 truncate">{repair.customerName}</div>
            <div className="w-64 px-4 truncate">{repair.deviceType}</div>
            <div className="w-48 px-4">
              {format(new Date(repair.dateReceived), 'MMM dd, yyyy')}
            </div>
            <div className="w-48 px-4 truncate">{repair.technician || 'Unassigned'}</div>
            <div className="w-32 px-4 flex items-center justify-center gap-2"> {/* Changed to justify-center for better icon alignment */}
              <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"> {/* Added padding and background for hover */}
                <Edit size={16} /> {/* Edit Icon */}
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"> {/* Added padding and background for hover */}
                <MoreHorizontal size={16} /> {/* More Actions Icon */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepairList;