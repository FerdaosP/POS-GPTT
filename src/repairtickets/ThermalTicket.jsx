import React from 'react';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';

const ThermalTicket = ({ repair }) => {
  const containerStyle = {
    width: '300px',
    fontFamily: 'monospace',
    fontSize: '12px',
    padding: '5px',
    color: '#000'
  };

  const hrStyle = {
    border: 'none',
    borderBottom: '1px dashed #000',
    margin: '5px 0'
  };

  const qrContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', margin: '5px 0' }}>Repair Ticket</h2>
      <hr style={hrStyle} />
      <p><strong>Ticket:</strong> {repair.ticketNumber}</p>
      <p>
        <strong>Date:</strong>{' '}
        {repair.dateReceived ? format(new Date(repair.dateReceived), 'MMM dd, yyyy') : ''}
      </p>
      <hr style={hrStyle} />
      <p><strong>Customer:</strong></p>
      <p>{repair.customerName}</p>
      <p><strong>Phone:</strong> {repair.phoneNumber}</p>
      <hr style={hrStyle} />
      <p><strong>Device:</strong> {repair.deviceType}</p>
      <p><strong>IMEI/Serial:</strong> {repair.imei}</p>
      <hr style={hrStyle} />
      <p><strong>Issue:</strong></p>
      <p>{repair.issueDescription}</p>
      <hr style={hrStyle} />
      <p><strong>Status:</strong> {repair.status}</p>
      <p><strong>Technician:</strong> {repair.technician || 'Unassigned'}</p>
      <hr style={hrStyle} />
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Thank you for your business!
      </p>
      {/* Render the QR code below. It encodes the repair ticket number. */}
      <div style={qrContainerStyle}>
        <QRCode value={repair.ticketNumber} size={80} />
      </div>
    </div>
  );
};

export default ThermalTicket;