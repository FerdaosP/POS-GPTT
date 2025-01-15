// File: /src/purchaseOrder/ViewPurchaseOrderModal.jsx

import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const ViewPurchaseOrderModal = ({ isOpen, onClose, purchaseOrder }) => {
  if (!isOpen || !purchaseOrder) return null;

  return (
    <Modal show={isOpen} onHide={onClose} centered className="modal-premium" style={{zIndex:1600}}>
      <div className="modal-content-premium" style={{ maxWidth: '800px' }}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <p><strong>PO Number:</strong> {purchaseOrder.poNumber}</p>
            <p><strong>Supplier:</strong> {purchaseOrder.supplierName}</p>
            <p><strong>PO Date:</strong> {purchaseOrder.poDate}</p>
            <p><strong>Expected Delivery Date:</strong> {purchaseOrder.expectedDeliveryDate}</p>
              <p><strong>Total Amount:</strong> €{purchaseOrder.totalAmount}</p>
            <p><strong>Status:</strong> {purchaseOrder.status}</p>
          </div>

          {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Item SKU</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                    <th>Tax Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemDescription}</td>
                    <td>{item.itemSKU}</td>
                    <td>{item.quantity}</td>
                    <td>€{item.unitPrice}</td>
                      <td>{item.taxRate}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No items in this purchase order.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ViewPurchaseOrderModal;