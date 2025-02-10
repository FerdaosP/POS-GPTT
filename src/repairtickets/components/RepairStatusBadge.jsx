import React from 'react';

const statusColors = {
  received: { bg: 'bg-blue-100', text: 'text-blue-800' },
  'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
  'on-hold': { bg: 'bg-red-100', text: 'text-red-800' },
  waiting: { bg: 'bg-purple-100', text: 'text-purple-800' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800' }
};

const statusLabels = {
  received: 'Received',
  'in-progress': 'In Progress',
  completed: 'Completed',
  'on-hold': 'On Hold',
  waiting: 'Waiting for Parts',
  cancelled: 'Cancelled'
};

const RepairStatusBadge = ({ status }) => {
  const { bg, text } = statusColors[status] || statusColors.received;
  const label = statusLabels[status] || 'Unknown';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
};

export default RepairStatusBadge;