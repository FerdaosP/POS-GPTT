// File: /src/repairtickets/RepairDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRepairById } from '../utils/repairManager';
import RepairStatusBadge from './components/RepairStatusBadge';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Printer, Download } from 'lucide-react';
// Import renderToStaticMarkup to convert a React component to an HTML string.
import { renderToStaticMarkup } from 'react-dom/server';
import ThermalTicket from './ThermalTicket';

const RepairDetailPage = () => {
  const { repairId } = useParams();
  const [repair, setRepair] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRepair, setEditedRepair] = useState(null);

  useEffect(() => {
    const fetchRepair = () => {
      const foundRepair = getRepairById(repairId);
      setRepair(foundRepair);
      setIsLoading(false);
    };
    fetchRepair();
  }, [repairId]);

  useEffect(() => {
    if (repair) {
      setEditedRepair({ ...repair });
    }
  }, [repair]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRepair((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    // For simplicity, update localStorage directly:
    const repairs = JSON.parse(localStorage.getItem('repairs') || '[]');
    const index = repairs.findIndex((r) => r.id === repair.id);
    if (index !== -1) {
      repairs[index] = { ...repairs[index], ...editedRepair, updatedAt: new Date().toISOString() };
      localStorage.setItem('repairs', JSON.stringify(repairs));
      setRepair(repairs[index]);
    }
    setIsEditing(false);
  };

  // Render the thermal ticket as an HTML string
  const getThermalTicketHTML = () => {
    const ticketMarkup = renderToStaticMarkup(<ThermalTicket repair={repair} />);
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Repair Ticket</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0; padding: 0; }
            }
            body { font-family: monospace; }
          </style>
        </head>
        <body>
          ${ticketMarkup}
        </body>
      </html>
    `;
  };

  // Download the ticket as an HTML file
  const handleDownload = () => {
    const fullHtml = getThermalTicketHTML();
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repair.ticketNumber || 'repair_ticket'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Open a new window to print the thermal ticket
  const handlePrint = () => {
    const fullHtml = getThermalTicketHTML();
    const printWindow = window.open('', '_blank', 'width=320,height=600');
    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (isLoading) {
    return <div>Loading repair details...</div>;
  }

  if (!repair) {
    return <div>Repair not found</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Repairs
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                >
                  <Download size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">
              Editing {editedRepair.ticketNumber} - {editedRepair.deviceType}
            </h1>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Device Type</label>
                <input
                  type="text"
                  name="deviceType"
                  value={editedRepair.deviceType || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">IMEI/Serial</label>
                <input
                  type="text"
                  name="imei"
                  value={editedRepair.imei || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Issue Description</label>
                <textarea
                  name="issueDescription"
                  value={editedRepair.issueDescription || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Technician</label>
                <input
                  type="text"
                  name="technician"
                  value={editedRepair.technician || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  value={editedRepair.status || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="received">Received</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="waiting">Waiting for Parts</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date Received</label>
                <input
                  type="date"
                  name="dateReceived"
                  value={editedRepair.dateReceived ? editedRepair.dateReceived.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-6">
                {repair.ticketNumber} - {repair.deviceType}
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <RepairStatusBadge status={repair.status} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Received</div>
                  <div>{format(new Date(repair.dateReceived), 'MMM dd, yyyy')}</div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div>{repair.customerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div>{repair.phoneNumber}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Device Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Device Type</div>
                    <div>{repair.deviceType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">IMEI/Serial</div>
                    <div>{repair.imei}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Issue Description</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {repair.issueDescription}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Technician</h2>
                <div className="text-gray-600">
                  {repair.technician || 'Unassigned'}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Repair History</h2>
                <div className="space-y-3">
                  {repair.history?.map((entry, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{entry.status}</div>
                      <div className="text-gray-500">
                        {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairDetailPage;