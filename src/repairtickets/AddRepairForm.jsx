// File: src/repairtickets/AddRepairForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { XCircle, FileText, UserPlus } from "lucide-react";
import { generateRepairID } from "../utils/repairUtils.jsx";
import PatternModal from "./PatternModal";
import CustomerManagerModal from "../components/CustomerManagerModal";
import { saveRepair } from "../utils/repairManager";
import { getCustomers } from "../utils/customerUtils"; // Import getCustomers
import { TechnicianManager } from "../utils/technicianManager"; // Import

const AddRepairForm = ({ isOpen, onClose, onSave, defaultCustomer }) => {
  const [newRepair, setNewRepair] = useState({
    repairTicketNumber: generateRepairID(),
    paymentStatus: "Not Paid",
    repairStatus: "Received",
    customer: null,
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
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  // --- Customer Search States and Refs ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

    // --- Technician Search States and Refs ---
    const [technicians, setTechnicians] = useState([]);
    const [techSearch, setTechSearch] = useState('');
    const [showTechDropdown, setShowTechDropdown] = useState(false);
    const techDropdownRef = useRef(null);

  // --- useEffect for default customer ---
  useEffect(() => {
    if (defaultCustomer) {
      setNewRepair((prev) => ({
        ...prev,
        customer: defaultCustomer.id,
        customerName:
          defaultCustomer.companyName ||
          `${defaultCustomer.firstName} ${defaultCustomer.lastName}`,
        phoneNumber: defaultCustomer.phone,
      }));
      setSearchQuery(
        defaultCustomer.companyName ||
          `${defaultCustomer.firstName} ${defaultCustomer.lastName}`
      ); // Set search query
    }
  }, [defaultCustomer]);

  // --- useEffect for click outside (Customer) ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    // --- useEffect for click outside (Technician) ---
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (techDropdownRef.current && !techDropdownRef.current.contains(e.target)) {
            setShowTechDropdown(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load technicians (Technician)
    useEffect(() => {
        setTechnicians(TechnicianManager.getAll());
    }, []);

  // --- Customer Search Handler ---
  const handleCustomerSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = getCustomers().filter((customer) => {
        const searchString = `${customer.firstName || ""} ${
          customer.lastName || ""
        } ${customer.companyName || ""} ${customer.phone || ""}`.toLowerCase();
        return searchString.includes(query.toLowerCase());
      });
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // --- Select Customer Handler ---
  const handleSelectCustomer = (customer) => {
    setNewRepair((prev) => ({
      ...prev,
      customer: customer.id,
      customerName:
        customer.companyName || `${customer.firstName} ${customer.lastName}`,
      phoneNumber: customer.phone,
    }));
    setSearchQuery(
      customer.companyName || `${customer.firstName} ${customer.lastName}`
    ); // Set search query
    setShowCustomerModal(false);
    setShowResults(false); // Hide results after selection
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === "checkbox" ? checked : value;

    if (name === "completionDate" || name === "dateReceived") {
      try {
        const dateObject = value ? new Date(value) : null;
        updatedValue = dateObject ? dateObject.toISOString().split("T")[0] : null;
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
      setNewRepair((prev) => ({ ...prev, pattern: "" }));
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
      setNewRepair((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...files],
      }));
    }
  };

  const handleRemoveAttachment = (index) => {
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewRepair((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

    // Filtered technicians (Technician)
    const filteredTechs = technicians.filter(tech =>
        tech.name.toLowerCase().includes(techSearch.toLowerCase())
    );

  const handleSubmit = async () => {
    const requiredFields = ["deviceType", "issueDescription", "customer"];
    const errors = {};
    requiredFields.forEach((field) => {
      if (!newRepair[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setModalError("Please fill out all required fields before saving.");
      setFieldErrors(errors);
      return;
    }

    try {
      const repairData = {
        ...newRepair,
        customerId: newRepair.customer,
        ticketNumber: newRepair.repairTicketNumber,
        status: newRepair.repairStatus,
        dateReceived: new Date(newRepair.dateReceived).toISOString(),
        customerName: newRepair.customerName,
        phone: newRepair.phoneNumber,
      };

      const savedRepair = saveRepair(repairData);
      onSave(savedRepair); // Now call onSave with savedRepair
      onClose();
    } catch (error) {
      setModalError(`Error saving repair: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">New Repair Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle size={24} />
          </button>
        </div>

        {modalError && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {modalError}
          </div>
        )}

        <div className="space-y-4">
          {/* Customer Selection Section */}
          <div className="mb-4" ref={searchRef}>
            <label className="block font-medium mb-2">Select Customer:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, company, or phone"
                value={searchQuery}
                onChange={handleCustomerSearch}
                onFocus={() => setShowResults(true)}
                className="border rounded p-2 w-full"
              />
              {showResults && (
                <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleSelectCustomer(customer); // Use the handler
                        }}
                      >
                        <div className="font-medium">
                          {customer.companyName ||
                            `${customer.firstName} ${customer.lastName}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {customer.phone}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No customers found</div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowCustomerModal(true)}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                + Add New Customer
              </button>
            </div>
          </div>

          {/* Device Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Device Type *</label>
              <input
                type="text"
                name="deviceType"
                value={newRepair.deviceType}
                onChange={handleInputChange}
                className={`border rounded p-2 w-full ${
                  fieldErrors.deviceType ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.deviceType && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.deviceType}
                </span>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">IMEI/Serial:</label>
              <input
                type="text"
                name="imei"
                value={newRepair.imei}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 flex items-center">
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
                <div className="border rounded p-2 bg-gray-100">
                  {newRepair.pattern || "No pattern selected"}
                </div>
              ) : (
                <input
                  type="text"
                  name="accessCode"
                  value={newRepair.accessCode}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                  placeholder="Access Code"
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
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block font-medium mb-2">Payment Status:</label>
            <div className="grid grid-cols-3 gap-4">
              {["Paid", "Not Paid", "Deposit"].map((status) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value={status}
                    checked={newRepair.paymentStatus === status}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span>{status}</span>
                  {status === "Deposit" && newRepair.paymentStatus === "Deposit" && (
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Amount"
                      className="border rounded p-2 ml-2 flex-1"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Repair Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Price Estimate:</label>
              <input
                type="text"
                name="priceEstimate"
                value={newRepair.priceEstimate}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              />
            </div>
            {/* Technician Input Field (Technician) */}
            <div>
                <label className="block font-medium mb-1">Technician:</label>
                <div className="relative" ref={techDropdownRef}>
                <input
                    type="text"
                    name="repairTechnician"
                    value={techSearch}
                    onChange={(e) => {
                    setTechSearch(e.target.value);
                    setShowTechDropdown(true);
                    }}
                    onFocus={() => setShowTechDropdown(true)}
                    className="border rounded p-2 w-full"
                    placeholder="Search technicians..."
                />
                {showTechDropdown && (
                    <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                    {filteredTechs.map(tech => (
                        <div
                        key={tech.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            setNewRepair(prev => ({ ...prev, repairTechnician: tech.name }));
                            setTechSearch(tech.name);
                            setShowTechDropdown(false);
                        }}
                        >
                        {tech.name}
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Date Received:</label>
              <input
                type="date"
                name="dateReceived"
                value={newRepair.dateReceived}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Completion Date:</label>
              <input
                type="date"
                name="completionDate"
                value={newRepair.completionDate}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block font-medium mb-1">
              Issue Description *
            </label>
            <textarea
              name="issueDescription"
              value={newRepair.issueDescription}
              onChange={handleInputChange}
              className={`border rounded p-2 w-full ${
                fieldErrors.issueDescription ? "border-red-500" : ""
              }`}
              rows={3}
            />
            {fieldErrors.issueDescription && (
              <span className="text-red-500 text-sm">
                {fieldErrors.issueDescription}
              </span>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block font-medium mb-1">Attachments:</label>
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="border rounded p-2 w-full"
              multiple
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {attachmentPreviews.map((preview, index) => (
                <div key={index} className="relative border rounded p-2">
                  {preview.type.startsWith("image/") ? (
                    <>
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <FileText size={16} className="mr-2" />
                      <span className="truncate">{preview.name}</span>
                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="ml-2"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Save Repair
            </button>
          </div>
        </div>

        {showPatternModal && (
          <PatternModal
            isOpen={showPatternModal}
            onClose={() => setShowPatternModal(false)}
            onPatternSelect={(pattern) => {
              setNewRepair((prev) => ({ ...prev, pattern }));
              setShowPatternModal(false);
            }}
          />
        )}

        {showCustomerModal && (
          <CustomerManagerModal
            onSelect={handleSelectCustomer}
            onClose={() => setShowCustomerModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AddRepairForm;