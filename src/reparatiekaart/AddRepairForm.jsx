import React, { useState } from "react";
import { XCircle, FileText } from "lucide-react";
import { generateRepairID } from "./utils";
import PatternModal from "./PatternModal";

const AddRepairForm = ({ isOpen, onClose, onSave }) => {
  const [newRepair, setNewRepair] = useState({
    repairTicketNumber: generateRepairID(),
    paymentStatus: "Not Paid",
    repairStatus: "Received",
    customerName: "",
    phoneNumber: "",
    deviceType: "",
    imei: "",
    accessCode: "",
    usePattern: false,
    pattern: "",
    simCode: "",
    issueDescription: "",
    priceEstimate: "",
    repairTechnician: "",
    dateReceived: new Date().toISOString().split("T")[0],
    completionDate: "",
    notes: "",
    attachments: [],
  });
  const [modalError, setModalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [showPatternModal, setShowPatternModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
        let updatedValue = type === "checkbox" ? checked : value;
        
        if (name === "completionDate") {
            try {
                const dateObject = value ? new Date(value) : null;
                updatedValue = dateObject ? dateObject.toISOString().split("T")[0] : null;
              } catch(error) {
                   updatedValue = null;
              }
        }
   
        if (name === "dateReceived" && value) {
             try {
               const dateObject = new Date(value);
               updatedValue = dateObject.toISOString().split("T")[0];
           } catch (error) {
                 updatedValue = null;
             }
         }
   
    setNewRepair((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
      if (name === "usePattern" && checked) {
          setShowPatternModal(true);
      } else if (name === "usePattern") {
          setNewRepair(prev => ({...prev, pattern: ""}));
      }
   };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);

    if (files && files.length > 0) {
      const newPreviews = [];
      const newAttachments = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            name: file.name,
            type: file.type,
            url: reader.result,
          });

          if (newPreviews.length === files.length) {
            setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
            setNewRepair((prev) => ({
              ...prev,
              attachments: [...prev.attachments, ...files],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveAttachment = (index) => {
    setAttachmentPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    setNewRepair((prevRepair) => {
      const updatedAttachments = prevRepair.attachments.filter(
        (_, i) => i !== index
      );
      return { ...prevRepair, attachments: updatedAttachments };
    });
  };

  const handleSubmit = async () => {
    const requiredFields = ["customerName", "phoneNumber", "deviceType", "issueDescription"];
    const errors = {};
    const phoneRegex = /^\d{10}$/;

    requiredFields.forEach((field) => {
      if (!newRepair[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    if (newRepair.phoneNumber && !phoneRegex.test(newRepair.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits.";
    }

    if (Object.keys(errors).length > 0) {
      setModalError("Please fill out all required fields before saving.");
      setFieldErrors(errors);
      return;
    }

    setModalError("");
    setFieldErrors({});

    // Call the onSave function (passed from NewRepairEntry) to add the repair
    onSave(newRepair);

    // Reset the form state
    setNewRepair({
      repairTicketNumber: generateRepairID(),
      paymentStatus: "Not Paid",
      repairStatus: "Received",
      customerName: "",
      phoneNumber: "",
      deviceType: "",
      imei: "",
      accessCode: "",
      usePattern: false, // Reset usePattern
      pattern: "",
      simCode: "",
      issueDescription: "",
      priceEstimate: "",
      repairTechnician: "",
      dateReceived: new Date().toISOString().split("T")[0],
      completionDate: "",
      notes: "",
      attachments: [],
    });
    setAttachmentPreviews([]);
    onClose(); // Close the modal
  };

  const handlePatternSelect = (pattern) => {
        setNewRepair(prev => ({...prev, pattern: pattern}));
      setShowPatternModal(false);
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">New Repair</h2>
        {modalError && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{modalError}</div>
        )}
        <div className="space-y-4">
          {/* Customer Information */}
          <div>
            <h3 className="text-md font-semibold mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Customer Name:</label>
                <input
                  type="text"
                  name="customerName"
                  value={newRepair.customerName}
                  onChange={handleInputChange}
                  className={`border rounded p-2 w-full max-w-full ${
                    fieldErrors.customerName ? "border-red-500" : ""
                  }`}
                  required
                />
                {fieldErrors.customerName && (
                  <span className="text-red-500 text-sm">
                    {fieldErrors.customerName}
                  </span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Phone Number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={newRepair.phoneNumber}
                  onChange={handleInputChange}
                  className={`border rounded p-2 w-full max-w-full ${
                    fieldErrors.phoneNumber ? "border-red-500" : ""
                  }`}
                  required
                />
                {fieldErrors.phoneNumber && (
                  <span className="text-red-500 text-sm">
                    {fieldErrors.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Device Information */}
          <div>
            <h3 className="text-md font-semibold mb-2">Device Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Device Type:</label>
                <input
                  type="text"
                  name="deviceType"
                  value={newRepair.deviceType}
                  onChange={handleInputChange}
                  className={`border rounded p-2 w-full max-w-full ${
                    fieldErrors.deviceType ? "border-red-500" : ""
                  }`}
                  required
                />
                {fieldErrors.deviceType && (
                  <span className="text-red-500 text-sm">{fieldErrors.deviceType}</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">IMEI:</label>
                <input
                  type="text"
                  name="imei"
                  value={newRepair.imei}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full max-w-full"
                />
              </div>
            </div>
          </div>

          {/* Security Codes */}
          <div>
            <h3 className="text-md font-semibold mb-2">Security Codes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  <input
                    type="checkbox"
                    name="usePattern"
                    checked={newRepair.usePattern}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Use Pattern
                </label>
                {newRepair.usePattern ? (
                     <div className="border rounded p-2 w-full max-w-full bg-gray-100 text-gray-600">
                            {newRepair.pattern ? `Pattern: ${newRepair.pattern}` : "No Pattern Selected"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      name="accessCode"
                      value={newRepair.accessCode}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full max-w-full"
                    />
                  )}
              </div>
              <div>
                <label className="block font-medium mb-1">SIM Code:</label>
                <input
                  type="text"
                  name="simCode"
                  value={newRepair.simCode}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full max-w-full"
                />
              </div>
            </div>
          </div>

          {/* Repair Details */}
          <div>
            <h3 className="text-md font-semibold mb-2">Repair Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Price Estimate:</label>
                <input
                  type="text"
                  name="priceEstimate"
                  value={newRepair.priceEstimate}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full max-w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Repair Technician:</label>
                <input
                  type="text"
                  name="repairTechnician"
                  value={newRepair.repairTechnician}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full max-w-full"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-md font-semibold mb-2">Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Date Received:</label>
                <input
                  type="date"
                  name="dateReceived"
                  value={newRepair.dateReceived}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full max-w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Completion Date:</label>
                <input
                  type="date"
                  name="completionDate"
                  value={newRepair.completionDate}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full max-w-full"
                />
              </div>
            </div>
          </div>
          {/* Full Width Fields */}
          <div>
            <label className="block font-medium mb-1">Issue Description:</label>
            <textarea
              name="issueDescription"
              value={newRepair.issueDescription}
              onChange={handleInputChange}
              className={`border rounded p-2 w-full max-w-full ${
                fieldErrors.issueDescription ? "border-red-500" : ""
              }`}
              required
              rows={3}
            />
            {fieldErrors.issueDescription && (
              <span className="text-red-500 text-sm">{fieldErrors.issueDescription}</span>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Notes:</label>
            <textarea
              name="notes"
              value={newRepair.notes}
              onChange={handleInputChange}
              className="border rounded p-2 w-full max-w-full"
              rows={3}
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block font-medium mb-1">Attachments:</label>
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="border rounded p-2 w-full max-w-full"
              multiple
            />
            {attachmentPreviews && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {attachmentPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    {preview.type.startsWith("image/") ? (
                      <div className="relative">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="max-w-full mt-2 border rounded"
                        />
                        <button
                          onClick={() => handleRemoveAttachment(index)}
                          className="absolute top-0 right-0 bg-gray-500 text-white rounded-full p-1"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 p-2 border rounded flex items-center justify-between">
                        <FileText className="inline-block mr-2" />
                        <span className="truncate">{preview.name}</span>
                        <button
                          onClick={() => handleRemoveAttachment(index)}
                          className="bg-gray-500 text-white rounded-full p-1"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Repair
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
        {showPatternModal && (
           <PatternModal
                isOpen={showPatternModal}
               onClose={() => setShowPatternModal(false)}
               onPatternSelect={handlePatternSelect}
           />
        )}
    </div>
  );
};

export default AddRepairForm;