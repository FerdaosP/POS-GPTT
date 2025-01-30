import React, { useState } from 'react';

const ReceiptTemplateEditor = ({ onSave, onClose }) => {
  const [template, setTemplate] = useState({
    header: "Thank you for shopping with us!",
    footer: "Visit us again soon!",
    showLogo: false,
    logoUrl: "",
    terms: "No returns without receipt.",
  });

  const handleChange = (field, value) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Receipt Template Editor</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Header Text</label>
            <textarea
              value={template.header}
              onChange={e => handleChange('header', e.target.value)}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block mb-2">Footer Text</label>
            <textarea
              value={template.footer}
              onChange={e => handleChange('footer', e.target.value)}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block mb-2">Terms & Conditions</label>
            <textarea
              value={template.terms}
              onChange={e => handleChange('terms', e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-2">Logo URL</label>
            <input
              type="text"
              value={template.logoUrl}
              onChange={e => handleChange('logoUrl', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(template)}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplateEditor;