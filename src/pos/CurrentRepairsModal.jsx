import React, { useState } from 'react';
import { getRepairsByStatus } from '../utils/repairManager';
import RepairStatusBadge from '../repairtickets/components/RepairStatusBadge';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

const CurrentRepairsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('in-progress');

  const repairs = getRepairsByStatus(activeTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Current Repairs</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['in-progress', 'waiting', 'on-hold'].map(status => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === status
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'in-progress' && 'In Progress'}
              {status === 'waiting' && 'Waiting for Parts'}
              {status === 'on-hold' && 'On Hold'}
            </button>
          ))}
        </div>

        {/* Repair List */}
        <div className="flex-1 overflow-y-auto p-6">
          {repairs.length > 0 ? (
            repairs.map(repair => (
              <div key={repair.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{repair.ticketNumber}</div>
                  <div className="text-sm text-gray-600">{repair.deviceType}</div>
                </div>
                <div className="flex items-center gap-4">
                  <RepairStatusBadge status={repair.status} />
                  <div className="text-sm text-gray-600">
                    {format(new Date(repair.dateReceived), 'MMM dd')}
                  </div>
                  {/* Use Link to navigate to RepairDetailPage */}
                  <Link
                    to={`/repairs/${repair.id}`}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">
              No {activeTab === 'in-progress' ? 'in progress' : activeTab} repairs
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentRepairsModal;