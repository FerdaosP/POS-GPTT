// In /src/utils/repairManager.jsx
import { v4 as uuidv4 } from 'uuid';
export const getRepairs = () => JSON.parse(localStorage.getItem('repairs') || '[]');

export const getRepairsByCustomerId = (customerId) => {
  const repairs = getRepairs();
  return repairs.filter(r => r.customerId === customerId);
};

export const saveRepair = (repair) => {
  const repairs = getRepairs();
  const newRepair = {
    id: uuidv4(), //added UUID for consistent IDs
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'received',
    customerId: repair.customerId,
    ticketNumber: repair.ticketNumber,
    deviceType: repair.deviceType,
    imei: repair.imei,
    issueDescription: repair.issueDescription,
    dateReceived: repair.dateReceived,
    customerName: repair.customerName,
    phone: repair.phone,
    ...repair
  };

  repairs.push(newRepair);
  localStorage.setItem('repairs', JSON.stringify(repairs));
  return newRepair;
};

export const deleteRepair = (repairId) => {
  const repairs = getRepairs();
  const updatedRepairs = repairs.filter(r => r.id !== repairId);
  localStorage.setItem('repairs', JSON.stringify(updatedRepairs));
  return updatedRepairs;
};

export const updateRepairStatus = (repairId, newStatus) => {
  const repairs = getRepairs();
  const repair = repairs.find(r => r.id === repairId);

  if (repair) {
    repair.status = newStatus;
    repair.updatedAt = new Date().toISOString();
    localStorage.setItem('repairs', JSON.stringify(repairs));
  }

  return repairs;
};

export const getRepairById = (repairId) => {
  const repairs = getRepairs();
  return repairs.find(r => r.id === repairId) || null;
};

export const getRepairsByStatus = (status) => {
  const repairs = getRepairs();
  return repairs.filter(r => r.status === status);
};