// File: /src/purchaseOrder/PurchaseOrderItem.jsx

import React from 'react';
import {  Edit, Trash2, Eye } from 'lucide-react';
const PurchaseOrderItem = ({
  purchaseOrder,
    onDelete,
  onEdit,
  onView,
  purchaseOrderStatusOptions,
  selectedPurchaseOrders,
    onSelectPurchaseOrder,
    onStatusUpdate // Added onStatusUpdate prop
}) => {
    const isSelected = selectedPurchaseOrders.includes(purchaseOrder.poNumber)

    const handleStatusChange = (e) => {
         onStatusUpdate(purchaseOrder.poNumber, e.target.value)
    }
  return (
    <tr key={purchaseOrder.poNumber} className="hover:bg-gray-100">
      <td className="border px-4 py-2">
        <input
          type="checkbox"
          checked={isSelected}
           onChange={() => onSelectPurchaseOrder(purchaseOrder.poNumber, !isSelected)}
        />
     </td>
      <td className="border px-4 py-2">{purchaseOrder.poNumber}</td>
      <td className="border px-4 py-2">{purchaseOrder.supplierName}</td>
      <td className="border px-4 py-2">{purchaseOrder.poDate}</td>
      <td className="border px-4 py-2">€{purchaseOrder.totalAmount}</td>
      <td className="border px-4 py-2">
           <select
                value={purchaseOrder.status}
                onChange={handleStatusChange}
                className="select-premium"
                aria-label={`Status for ${purchaseOrder.poNumber}`}
            >
                {purchaseOrderStatusOptions.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
           </select>
        </td>
      <td className="border px-4 py-2">
          <div className="flex space-x-2">
           <button
            onClick={() => onEdit(purchaseOrder)}
            className="text-blue-500 hover:text-blue-700"
             aria-label="Edit"
            >
              <Edit size={16} />
            </button>
            <button
             onClick={() => onDelete(purchaseOrder.poNumber)}
             className="text-red-500 hover:text-red-700"
              aria-label="Delete"
            >
             <Trash2 size={16} />
            </button>
             <button
                onClick={() => onView(purchaseOrder)}
                className="text-green-500 hover:text-green-700"
                aria-label="View"
            >
                <Eye size={16} />
           </button>
          </div>
        </td>
    </tr>
  );
};
export default PurchaseOrderItem;