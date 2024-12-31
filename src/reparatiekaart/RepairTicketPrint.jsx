import React from 'react';

const RepairTicketPrint = ({ repair, isOpen = false, onClose }) => {
    const handlePrint = () => {
        if (!repair) return;
        const printWindow = window.open('', '_blank');
        const printContent = `
      <html>
        <head>
          <title>Repair Ticket</title>
          <style>
            @media print {
              body {
                font-family: monospace;
                margin: 0;
                padding: 0;
              }

              .print-ticket {
                width: 80mm;
                padding: 5mm;
                page-break-after: always;
              }

              .print-shop-name {
                text-align: center;
                font-size: 16pt;
                font-weight: bold;
                margin-bottom: 5mm;
              }

              .print-ticket-info p {
                font-size: 12pt;
                margin: 2mm 0;
              }

              .print-barcode {
                text-align: center;
                font-size: 14pt;
                margin-top: 5mm;
              }

              .print-footer {
                text-align: center;
                font-size: 12pt;
                margin-top: 5mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-ticket">
               <h2 class="print-shop-name">Repair Point BV</h2>
                 <div class="print-ticket-info">
                    <p><strong>Ticket #</strong> ${repair.repairTicketNumber}</p>
                    <p><strong>Customer:</strong> ${repair.customerName}</p>
                    <p><strong>Phone:</strong> ${repair.phoneNumber}</p>
                    <p><strong>Device:</strong> ${repair.deviceType}</p>
                    <p><strong>Issue:</strong> ${repair.issueDescription}</p>
                     <p><strong>Date:</strong> ${repair.dateReceived ? new Date(repair.dateReceived).toLocaleDateString() : "N/A"}</p>
                  </div>
                <p class="print-barcode">*{repair.repairTicketNumber}*</p>
               <p class="print-footer">Thank you!</p>
            </div>
        </body>
      </html>
    `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        onClose();
    };


  if (!isOpen || !repair) {
      return null;
  }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Print Preview</h2>
                <div className="p-4 border rounded">
                    <div className="print-ticket">
                        <h2 className="print-shop-name">Repair Point BV</h2>
                           <div className="print-ticket-info">
                                <p><strong>Ticket #</strong> {repair?.repairTicketNumber}</p>
                                <p><strong>Customer:</strong> {repair?.customerName}</p>
                                <p><strong>Phone:</strong> {repair?.phoneNumber}</p>
                                <p><strong>Device:</strong> {repair?.deviceType}</p>
                                <p><strong>Issue:</strong> {repair?.issueDescription}</p>
                                 <p><strong>Date:</strong> {repair?.dateReceived ? new Date(repair.dateReceived).toLocaleDateString() : "N/A"}</p>
                            </div>
                             <p className="print-barcode">*{repair?.repairTicketNumber}*</p>
                            <p className="print-footer">Thank you!</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Print
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RepairTicketPrint;