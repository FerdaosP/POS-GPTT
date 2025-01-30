import React, { useState, useEffect, useRef } from "react";
import { XCircle, FileText, UserPlus } from "lucide-react";
import { generateRepairID } from "../utils/repairUtils.jsx";
import PatternModal from "./PatternModal";
import axios from "axios";

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

  useEffect(() => {
    if (defaultCustomer) {
      setNewRepair(prev => ({
        ...prev,
        customerName: defaultCustomer.companyName,
        phoneNumber: defaultCustomer.phone,
      }));
    }
  }, [defaultCustomer]);

  const [modalError, setModalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/api/customers/');
        setCustomers(response.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Error loading customer. Please check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCustomer = (event) => {
    const selectedCustomerId = event.target.value;
    const selectedCustomer = customers.find(customer => customer.id === parseInt(selectedCustomerId));
    if (selectedCustomer) {
      setNewRepair(prev => ({
        ...prev,
        customer: selectedCustomerId,
        customerName: selectedCustomer.companyName,
        phoneNumber: selectedCustomer.phone,
      }));
      setSearchTerm(`${selectedCustomer.companyName} - ${selectedCustomer.firstName} ${selectedCustomer.lastName}`);
      setShowDropdown(false);
    } else {
      setNewRepair(prev => ({
        ...prev,
        customer: null,
        customerName: "",
        phoneNumber: "",
      }));
    }
  };

  const handleAddCustomer = () => {
    setShowCustomerForm(true);
  };

  const handleSaveNewCustomer = (customer) => {
    setCustomers(prev => [...prev, customer]);
    setNewRepair(prev => ({
      ...prev,
      customer: customer.id,
      customerName: customer.companyName,
      phoneNumber: customer.phone,
    }));
    setSearchTerm(`${customer.companyName} - ${customer.firstName} ${customer.lastName}`);
    setShowDropdown(false);
    setShowCustomerForm(false);
  };

  const handleCancelCustomer = () => {
    setShowCustomerForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === "checkbox" ? checked : value;

    if (name === "completionDate") {
      try {
        const dateObject = value ? new Date(value) : null;
        updatedValue = dateObject ? dateObject.toISOString().split("T")[0] : null;
      } catch (error) {
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

    if (name === "paymentStatus" && value === "Deposit") {
      setNewRepair(prev => ({ ...prev, [name]: value }));
    } else if (name === "paymentStatus") {
      setNewRepair(prev => ({ ...prev, [name]: value }));
    } else {
      setNewRepair(prev => ({
        ...prev,
        [name]: updatedValue,
      }));
    }

    if (name === 'customerName') {
      setSearchTerm(value);
      setShowDropdown(true);
      if (!value) {
        setNewRepair(prev => ({ ...prev, customer: null }));
      }
    }

    if (name === "usePattern" && checked) {
      setShowPatternModal(true);
    } else if (name === "usePattern") {
      setNewRepair(prev => ({ ...prev, pattern: "" }));
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
            setAttachmentPreviews(prev => [...prev, ...newPreviews]);
            setNewRepair(prev => ({
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
    setAttachmentPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setNewRepair(prevRepair => {
      const updatedAttachments = prevRepair.attachments.filter((_, i) => i !== index);
      return { ...prevRepair, attachments: updatedAttachments };
    });
  };

  const handleSubmit = async () => {
    const requiredFields = ["deviceType", "issueDescription", "customer"];
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

    try {
      const formData = new FormData();
      for (const key in newRepair) {
        if (key !== "attachments") {
          if (key === "paymentStatus" && newRepair[key] === "Deposit") {
            formData.append(key, `${newRepair[key]} ${depositAmount}` || "");
          } else {
            formData.append(key, newRepair[key] || "");
          }
        }
      }

      if (newRepair.attachments && newRepair.attachments.length > 0) {
        newRepair.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      await axios.post('http://localhost:8000/api/repairs/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave();
    } catch (error) {
      console.error("Error saving repair", error);
      setModalError(`Error creating repair, check console: ${error.message}`);
    } finally {
      setNewRepair({
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
      setAttachmentPreviews([]);
      onClose();
    }
  };

  const handlePatternSelect = (pattern) => {
    setNewRepair(prev => ({ ...prev, pattern: pattern }));
    setShowPatternModal(false);
  };

  const filteredCustomers = customers.filter(customer => {
    return (
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderCustomerOptions = () => {
    return filteredCustomers.map(customer => (
      <option value={customer.id} key={customer.id}>
        {customer.companyName} - {customer.firstName} {customer.lastName}
      </option>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">New Repair Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle size={24} />
          </button>
        </div>

        {modalError && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{modalError}</div>
        )}

        <div className="space-y-4">
          {/* Customer Selection Section */}
          <div className="mb-4" ref={inputRef}>
            <label className="block font-medium mb-2">Select Customer:</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={handleInputChange}
                  name="customerName"
                  onFocus={() => setShowDropdown(true)}
                  className="border rounded p-2 w-full"
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg">
                    <select
                      size={5}
                      onClick={handleSelectCustomer}
                      className="w-full p-2"
                    >
                      <option value="">Select Customer</option>
                      {renderCustomerOptions()}
                    </select>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddCustomer}
                className="bg-teal-600 text-white p-2 rounded hover:bg-teal-700"
              >
                <UserPlus size={20} />
              </button>
            </div>
          </div>

          {/* Customer Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Customer Name:</label>
              <input
                type="text"
                value={newRepair.customerName}
                className="border rounded p-2 w-full bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone Number:</label>
              <input
                type="tel"
                value={newRepair.phoneNumber}
                className="border rounded p-2 w-full bg-gray-50"
                disabled
              />
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
                <span className="text-red-500 text-sm">{fieldErrors.deviceType}</span>
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
            <div>
              <label className="block font-medium mb-1">Technician:</label>
              <input
                type="text"
                name="repairTechnician"
                value={newRepair.repairTechnician}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              />
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
            <label className="block font-medium mb-1">Issue Description *</label>
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
              <span className="text-red-500 text-sm">{fieldErrors.issueDescription}</span>
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
            onPatternSelect={handlePatternSelect}
          />
        )}

        {showCustomerForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              <CustomerForm
                onSave={handleSaveNewCustomer}
                onCancel={handleCancelCustomer}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRepairForm;