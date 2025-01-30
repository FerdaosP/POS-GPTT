// src/utils/repairUtils.jsx
export const PHONE_REGEX = /^\d{10}$/;

export const generateRepairID = () => {
  const datePart = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `REP-${datePart}-${randomPart}`;
};

export const validateRepairForm = (newRepair) => {
  const requiredFields = ["deviceType", "issueDescription", "customer"];
  const errors = {};

  requiredFields.forEach((field) => {
    if (!newRepair[field]) {
      errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
    }
  });

  if (newRepair.phoneNumber && !PHONE_REGEX.test(newRepair.phoneNumber)) {
    errors.phoneNumber = "Phone number must be 10 digits.";
  }

  return errors;
};

export const createRepairFormData = (newRepair, depositAmount) => {
  const formData = new FormData();
  
  // Append all fields except attachments
  Object.keys(newRepair).forEach((key) => {
    if (key !== "attachments") {
      let value = newRepair[key];
      
      if (key === "paymentStatus" && value === "Deposit") {
        value = `${value} ${depositAmount}`;
      }
      
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }
  });

  // Append attachments if any
  if (newRepair.attachments && newRepair.attachments.length > 0) {
    newRepair.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  return formData;
};