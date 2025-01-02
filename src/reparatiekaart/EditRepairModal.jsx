import React, { useState, useEffect } from "react";
import { XCircle, FileText } from "lucide-react";
import PatternModal from "./PatternModal";

const EditRepairModal = ({ repair, isOpen, onClose, onSave }) => {
  const [editedRepair, setEditedRepair] = useState(repair);
  const [showPatternModal, setShowPatternModal] = useState(false);
  
    useEffect(() => {
        setEditedRepair(repair);
    }, [repair]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setEditedRepair((prev) => {
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


            if(name === "usePattern" && checked){
                setShowPatternModal(true)
            } else if(name === "usePattern"){
                updatedValue = false;
                return { ...prev, [name]: updatedValue, pattern: "" }
              }

            return { ...prev, [name]: updatedValue };
        });
    };

    const handlePatternSelect = (pattern) => {
        setEditedRepair(prev => ({...prev, pattern: pattern}));
      setShowPatternModal(false);
    };


  const handleSubmit = () => {
    onSave(editedRepair);
    onClose();
  };

  if (!isOpen || !repair) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">Edit Repair</h2>
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
                                  value={editedRepair?.customerName || ""}
                                  onChange={handleInputChange}
                                  className="border rounded p-2 w-full max-w-full"
                                  required
                              />
                          </div>
                          <div>
                              <label className="block font-medium mb-1">Phone Number:</label>
                              <input
                                  type="tel"
                                  name="phoneNumber"
                                  value={editedRepair?.phoneNumber || ""}
                                  onChange={handleInputChange}
                                  className="border rounded p-2 w-full max-w-full"
                                  required
                              />
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
                                  value={editedRepair?.deviceType || ""}
                                  onChange={handleInputChange}
                                  className="border rounded p-2 w-full max-w-full"
                                  required
                              />
                          </div>
                          <div>
                              <label className="block font-medium mb-1">IMEI:</label>
                              <input
                                  type="text"
                                  name="imei"
                                  value={editedRepair?.imei || ""}
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
                                    checked={editedRepair?.usePattern}
                                     onChange={handleInputChange}
                                     className="mr-2"
                                  />
                                    Use Pattern
                                 </label>
                                   {editedRepair?.usePattern ? (
                                       <div className="border rounded p-2 w-full max-w-full bg-gray-100 text-gray-600">
                                          {editedRepair?.pattern ? `Pattern: ${editedRepair?.pattern}` : "No Pattern Selected"}
                                       </div>
                                     ) : (
                                        <input
                                            type="text"
                                            name="accessCode"
                                            value={editedRepair?.accessCode || ""}
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
                                  value={editedRepair?.simCode || ""}
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
                                  value={editedRepair?.priceEstimate || ""}
                                  onChange={handleInputChange}
                                  className="border rounded p-2 w-full max-w-full"
                              />
                          </div>
                          <div>
                              <label className="block font-medium mb-1">Repair Technician:</label>
                              <input
                                  type="text"
                                  name="repairTechnician"
                                  value={editedRepair?.repairTechnician || ""}
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
                                  value={editedRepair?.dateReceived || ""}
                                  onChange={handleInputChange}
                                  className="border rounded p-2 w-full max-w-full"
                              />
                          </div>
                          <div>
                              <label className="block font-medium mb-1">Completion Date:</label>
                              <input
                                  type="date"
                                  name="completionDate"
                                  value={editedRepair?.completionDate || ""}
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
                          value={editedRepair?.issueDescription || ""}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full max-w-full"
                          required
                          rows={3}
                      />
                  </div>
                  <div>
                      <label className="block font-medium mb-1">Notes:</label>
                      <textarea
                          name="notes"
                          value={editedRepair?.notes || ""}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full max-w-full"
                          rows={3}
                      />
                  </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                  <button
                      onClick={handleSubmit}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                      Update
                  </button>
                  <button
                      onClick={onClose}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
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

export default EditRepairModal;