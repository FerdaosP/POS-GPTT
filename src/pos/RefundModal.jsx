import React, { useState } from 'react';
import { toast } from 'react-toastify';

const RefundModal = ({ transaction, onClose, onRefund }) => {
  const [refundItems, setRefundItems] = useState(
    transaction.items.map(item => ({
      ...item,
      refundQty: 0,
      restock: true // Default to restocking
    }))
  );
  const [partialRefundAmount, setPartialRefundAmount] = useState(0);
  const [refundType, setRefundType] = useState('items'); // 'items' or 'amount'

  // Handler to update refund quantity for an item
  const handleRefundQtyChange = (id, qty) => {
    setRefundItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, refundQty: Math.min(qty, item.qty) } : item
      )
    );
  };

  // Toggle whether the item should be restocked
  const toggleRestock = (id) => {
    setRefundItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, restock: !item.restock } : item
      )
    );
  };

  // Calculate total refund amount based on refund type
  const calculateRefundTotal = () => {
    if (refundType === 'items') {
      return refundItems.reduce(
        (sum, item) => sum + item.price * item.refundQty,
        0
      );
    } else {
      return Math.min(partialRefundAmount, transaction.total);
    }
  };

  const refundTotal = calculateRefundTotal();
  const isValidRefund = refundTotal > 0 && refundTotal <= transaction.total;

  // Finalize and process the refund
  const handleSubmit = () => {
    if (!isValidRefund) {
      toast.error("Refund amount invalid.");
      return;
    }
    if (refundType === 'items') {
      const refundedItems = refundItems
        .filter(item => item.refundQty > 0)
        .map(item => ({
          id: item.id,
          name: item.name,
          refundQty: item.refundQty,
          price: item.price,
          restock: item.restock
        }));
      onRefund({
        transactionId: transaction.id,
        items: refundedItems,
        refundTotal,
        originalTotal: transaction.total,
        remainingBalance: transaction.total - refundTotal
      });
    } else {
      onRefund({
        transactionId: transaction.id,
        refundTotal,
        originalTotal: transaction.total,
        remainingBalance: transaction.total - refundTotal,
        isPartialRefund: true
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Process Refund</h2>
        <div className="space-y-4">
          {/* Refund Type Switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setRefundType('items')}
              className={`px-4 py-2 rounded text-sm ${refundType === 'items'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Refund Items
            </button>
            <button
              onClick={() => setRefundType('amount')}
              className={`px-4 py-2 rounded text-sm ${refundType === 'amount'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Refund Amount
            </button>
          </div>

          {/* Refund Content */}
          {refundType === 'items' ? (
            <>
              {refundItems.map(item => (
                <div key={item.id} className="flex flex-col gap-2 p-2 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Purchased: {item.qty}, Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <input
                      type="number"
                      value={item.refundQty}
                      onChange={e => handleRefundQtyChange(item.id, +e.target.value)}
                      className="w-20 p-2 border rounded"
                      min="0"
                      max={item.qty}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.restock}
                      onChange={() => toggleRestock(item.id)}
                      className="w-4 h-4"
                    />
                    <label>Restock this item</label>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>
              <label className="block mb-2">Refund Amount</label>
              <input
                type="number"
                value={partialRefundAmount}
                onChange={e => setPartialRefundAmount(Math.max(0, e.target.valueAsNumber))}
                className="w-full p-2 border rounded"
                min="0"
                max={transaction.total}
                step="0.01"
              />
              <p className="text-sm text-gray-600 mt-1">
                Maximum refundable: ${transaction.total.toFixed(2)}
              </p>
            </div>
          )}

          {/* Refund Summary */}
          <div className="border-t pt-4">
            <p className="text-lg font-bold">
              Refund Total: ${refundTotal.toFixed(2)}
            </p>
            {!isValidRefund && (
              <p className="text-red-600 text-sm">
                Please check refund amounts. Refund cannot exceed the original total.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={!isValidRefund}
            >
              Process Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
