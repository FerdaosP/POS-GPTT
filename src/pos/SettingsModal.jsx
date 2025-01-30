import React from 'react';
import ReceiptTemplateEditor from './ReceiptTemplateEditor';

const SettingsModal = ({ onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        {/* Receipt Template Section */}
        <ReceiptTemplateEditor
          onSave={(template) => {
            onSave(template);
            onClose();
          }}
          onClose={onClose}
        />
        {/* Future Settings Can Be Added Here */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;