import React, { useState } from 'react';

const RefundModal = ({ transaction, onClose, onRefund }) => {
  const [refundItems, setRefundItems] = useState(
    transaction.items.map(item => ({ ...item, refundQty: 0 }))
  );

  const handleRefundQtyChange = (id, qty) => {
    setRefundItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, refundQty: Math.min(qty, item.qty) } : item
      )
    );
  };

  const calculateRefundTotal = () => {
    return refundItems.reduce(
      (sum, item) => sum + item.price * item.refundQty,
      0
    );
  };

  const handleSubmit = () => {
    const refundedItems = refundItems.filter(item => item.refundQty > 0);
    onRefund({
      transactionId: transaction.id,
      items: refundedItems,
      refundTotal: calculateRefundTotal(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Process Refund</h2>
        <div className="space-y-4">
          {refundItems.map(item => (
            <div key={item.id} className="flex items-center justify-between">
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
          ))}
          <div className="border-t pt-4">
            <p className="text-lg font-bold">
              Refund Total: ${calculateRefundTotal().toFixed(2)}
            </p>
          </div>
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