import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, repairId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <p className="mb-4">
          Are you sure you want to delete this repair?
           {repairId && `(Ticket #${repairId})`}
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

export default DeleteConfirmationModal;