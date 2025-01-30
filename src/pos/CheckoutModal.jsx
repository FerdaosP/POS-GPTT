import React, { useState, useEffect } from 'react';

const CheckoutModal = ({ total, onClose, onConfirm, initialPayments }) => {
  const [payments, setPayments] = useState(() => {
    if (initialPayments) {
      return initialPayments.map(p => {
        const [method, amount] = p.split(': $');
        return {
          method: method.trim(),
          amount: parseFloat(amount).toFixed(2),
          id: Date.now() + Math.random(),
        };
      });
    }
    return [{ method: 'cash', amount: '', id: Date.now() }];
  });

  const [remaining, setRemaining] = useState(total);
  const [change, setChange] = useState(0); // Add change state

  // Update the useEffect to calculate change
  useEffect(() => {
    const paid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const newRemaining = total - paid;
    setRemaining(Math.max(newRemaining, 0));
    setChange(Math.max(0, paid - total)); // Calculate change as overpayment
  }, [payments, total]);

  const addPaymentMethod = () => {
    setPayments([...payments, { method: 'cash', amount: '', id: Date.now() }]);
  };

  const updatePayment = (id, field, value) => {
    const updated = payments.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setPayments(updated);
  };

  const removePayment = (id) => {
    if (payments.length === 1) return;
    setPayments(payments.filter(p => p.id !== id));
  };

  // Update handleSubmit to pass change
    const handleSubmit = () => {
    if (remaining > 0.01) {
      alert(`Amount remaining: $${remaining.toFixed(2)}`);
      return;
    }
    onConfirm(payments.filter(p => p.amount !== ''), change); // Pass change here
    onClose();
  };

  // New handler for Full Amount button
  const handleFullAmount = () => {
    const paid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const remaining = total - paid;

    if (remaining <= 0) return;

    let updatedPayments = [...payments];
    let foundEmpty = false;

    // Update first empty payment
    updatedPayments = updatedPayments.map(payment => {
      if (!foundEmpty && (!payment.amount || parseFloat(payment.amount) === 0)) {
        foundEmpty = true;
        return { ...payment, amount: remaining.toFixed(2) };
      }
      return payment;
    });

    // If no empty found, adjust the last payment
    if (!foundEmpty) {
      const lastIndex = updatedPayments.length - 1;
      const lastPayment = updatedPayments[lastIndex];
      const newAmount = (parseFloat(lastPayment.amount) + remaining).toFixed(2);
      updatedPayments[lastIndex] = { ...lastPayment, amount: newAmount };
    }

    setPayments(updatedPayments);
  };

    // Add change display
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full pointer-events-auto">
        <h2 className="text-xl font-bold mb-4">Split Payment</h2>
        <div className="space-y-4">
          <div className="flex justify-between font-semibold">
            <span>Total Due:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex gap-2 items-center">
                <select
                  value={payment.method}
                  onChange={(e) => updatePayment(payment.id, 'method', e.target.value)}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>

                <input
                  type="number"
                  value={payment.amount}
                  onChange={(e) => updatePayment(payment.id, 'amount', e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Amount"
                  min="0"
                  step="0.01"
                />

                {payments.length > 1 && (
                  <button
                    onClick={() => removePayment(payment.id)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={addPaymentMethod}
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              + Add Payment Method
            </button>

            <div className={`text-sm ${remaining > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
              {remaining > 0.01
                ? `Remaining: $${remaining.toFixed(2)}`
                : 'Payment Complete'}
            </div>
          </div>
           {change > 0 && (
            <div className="text-sm text-blue-600 mt-2">
              Change Due: ${change.toFixed(2)}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
              <button
                onClick={handleFullAmount}
                disabled={remaining <= 0.01}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                Full Amount
              </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
              disabled={remaining > 0.01}
            >
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;