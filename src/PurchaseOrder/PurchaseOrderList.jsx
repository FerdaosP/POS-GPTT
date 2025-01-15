// File: /src/purchaseOrder/PurchaseOrderList.jsx

import React from "react";
import PurchaseOrderItem from "./PurchaseOrderItem";


const PurchaseOrderList = ({
  purchaseOrders,
  onPageChange,
  onDelete,
  onEdit,
    onSort,
    purchaseOrderStatusOptions,
    selectedPurchaseOrders,
    onSelectPurchaseOrder,
     onView, // Added onView prop
     onStatusUpdate // Added onStatusUpdate prop
}) => {
  return (
    <div className="mb-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">Current Purchase Orders</h2>
      {purchaseOrders.length === 0 ? (
        <p className="text-gray-500">No purchase orders at the moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 min-w-[1000px]">
            <thead className="bg-gray-100">
              <tr className="text-left">
                  <th className="px-4 py-2">Select</th>
                <th
                  onClick={() => onSort("poNumber")}
                  className="cursor-pointer py-2 px-4"
                >
                  PO #
                </th>
                <th
                  onClick={() => onSort("supplierName")}
                  className="cursor-pointer py-2 px-4"
                >
                  Supplier
                </th>
                <th
                  onClick={() => onSort("poDate")}
                  className="cursor-pointer py-2 px-4"
                >
                  PO Date
                </th>
                <th
                  onClick={() => onSort("totalAmount")}
                  className="cursor-pointer py-2 px-4"
                >
                  Total Amount
                </th>
                <th
                    onClick={() => onSort("status")}
                    className="cursor-pointer py-2 px-4"
                    >
                     Status
                  </th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((purchaseOrder) => (
                <PurchaseOrderItem
                  key={purchaseOrder.poNumber}
                  purchaseOrder={purchaseOrder}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onView={onView}
                  onStatusUpdate={onStatusUpdate}  // Pass the onStatusUpdate prop
                  purchaseOrderStatusOptions={purchaseOrderStatusOptions}
                    selectedPurchaseOrders={selectedPurchaseOrders}
                    onSelectPurchaseOrder={onSelectPurchaseOrder}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderList;