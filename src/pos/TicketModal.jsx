// In /src/pos/TicketModal.jsx
import React from 'react';

const TicketModal = ({ repairs, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full pointer-events-auto">
        <h2 className="text-xl font-bold mb-4">Active Repair Tickets</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">Ticket #</th>
                <th className="p-2">Device</th>
                <th className="p-2">IMEI</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair) => (
                <tr key={repair.id} className="border-b">
                  <td className="p-2">{repair.ticketNumber}</td>
                  <td className="p-2">{repair.deviceType}</td>
                  <td className="p-2">{repair.imei}</td>
                  <td className="p-2">
                    <button
                      onClick={() => onAddToCart(repair)}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TicketModal;