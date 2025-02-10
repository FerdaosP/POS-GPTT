// /src/pos/ReceiptTemplateEditor.jsx
import React, { useState } from 'react';

const ReceiptTemplateEditor = ({ template, onSave, inlineMode }) => {
  const [localTemplate, setLocalTemplate] = useState(
    template || {
      businessName: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
      bankAccount: "",         // New: Bankrekeningnummer
      vatNumber: "",           // New: BTW- of ondernemingsnummer
      placeOfIssuance: "",     // New: Plaats van opmaak
      header: "Thank you for shopping with us!",
      footer: "Visit us again soon!",
      showLogo: false,
      logoUrl: "",
      terms: "No returns without receipt.",
    }
  );

  const handleChange = (field, value) => {
    const updatedTemplate = { ...localTemplate, [field]: value };
    setLocalTemplate(updatedTemplate);
    if (onSave) onSave(updatedTemplate);
  };

  return (
    <div className={`${!inlineMode ? 'bg-white rounded-lg p-6 max-w-2xl w-full' : ''}`}>
      {!inlineMode && (
        <h2 className="text-xl font-bold mb-4">
          Receipt/Invoice Template Editor
        </h2>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold">Business Information</h3>
        <div>
          <label className="block mb-2">Business Name</label>
          <input
            type="text"
            value={localTemplate.businessName}
            onChange={e => handleChange('businessName', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Business Address</label>
          <textarea
            value={localTemplate.businessAddress}
            onChange={e => handleChange('businessAddress', e.target.value)}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div>
          <label className="block mb-2">Phone Number</label>
          <input
            type="text"
            value={localTemplate.businessPhone}
            onChange={e => handleChange('businessPhone', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Email Address</label>
          <input
            type="text"
            value={localTemplate.businessEmail}
            onChange={e => handleChange('businessEmail', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* New fields for invoicing */}
        <div>
          <label className="block mb-2">Bank Account Number</label>
          <input
            type="text"
            value={localTemplate.bankAccount}
            onChange={e => handleChange('bankAccount', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">VAT / Business Number</label>
          <input
            type="text"
            value={localTemplate.vatNumber}
            onChange={e => handleChange('vatNumber', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Place of Issuance</label>
          <input
            type="text"
            value={localTemplate.placeOfIssuance}
            onChange={e => handleChange('placeOfIssuance', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Header Text</label>
          <textarea
            value={localTemplate.header}
            onChange={e => handleChange('header', e.target.value)}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div>
          <label className="block mb-2">Footer Text</label>
          <textarea
            value={localTemplate.footer}
            onChange={e => handleChange('footer', e.target.value)}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div>
          <label className="block mb-2">Terms &amp; Conditions</label>
          <textarea
            value={localTemplate.terms}
            onChange={e => handleChange('terms', e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2">Logo URL</label>
          <input
            type="text"
            value={localTemplate.logoUrl}
            onChange={e => handleChange('logoUrl', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplateEditor;
