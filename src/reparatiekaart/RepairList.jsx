import React from "react";
import RepairItem from "./RepairItem";

const RepairList = ({
  repairs,
  onPageChange,
  onStatusUpdate,
  onDelete,
  onEdit,
  onViewAttachments,
  onViewHistory,
  onSort,
  repairStatusOptions,
  onPrint,
    selectedRepairs,
    onSelectRepair,
}) => {
  return (
    <div className="mb-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">Current Repairs</h2>
      {repairs.length === 0 ? (
        <p className="text-gray-500">No repairs at the moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 min-w-[1000px]">
            <thead className="bg-gray-100">
              <tr className="text-left">
                  <th className="px-4 py-2">Select</th>
                <th
                  onClick={() => onSort("repairTicketNumber")}
                  className="cursor-pointer py-2 px-4"
                >
                  Ticket #
                </th>
                <th
                  onClick={() => onSort("customerName")}
                  className="cursor-pointer py-2 px-4"
                >
                  Customer
                </th>
                <th
                  onClick={() => onSort("deviceType")}
                  className="cursor-pointer py-2 px-4"
                >
                  Device
                </th>
                <th
                  onClick={() => onSort("repairStatus")}
                  className="cursor-pointer py-2 px-4"
                >
                  Status
                </th>
                <th
                    onClick={() => onSort("dateReceived")}
                    className="cursor-pointer py-2 px-4"
                    >
                     Date Received
                   </th>
                <th className="py-2 px-4">Actions</th>
                <th className="py-2 px-4" >Buttons</th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair) => (
                <RepairItem
                  key={repair.repairTicketNumber}
                  repair={repair}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onViewAttachments={onViewAttachments}
                  onViewHistory={onViewHistory}
                  repairStatusOptions={repairStatusOptions}
                  onPrint={onPrint}
                    selectedRepairs={selectedRepairs}
                    onSelectRepair={onSelectRepair}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RepairList;