// File: /src/purchaseOrder/DeletePurchaseOrderModal.jsx

import React from 'react';

const DeletePurchaseOrderModal = ({ isOpen, onClose, onConfirm, purchaseOrderId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-premium">
      <div className="modal-content-premium">
        <p className="mb-4">
          Are you sure you want to delete this purchase order?
          {purchaseOrderId && ` (PO Number: ${purchaseOrderId})`}
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">
            Confirm Delete
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePurchaseOrderModal;