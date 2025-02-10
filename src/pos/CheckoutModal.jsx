// File: /src/pos/CheckoutModal.jsx
import React, { useState, useEffect } from 'react';

const CheckoutModal = ({ currencySymbol, total, onClose, onConfirm, initialPayments }) => {
  // Load custom payment methods from localStorage; expect an array of strings.
  const customMethods = JSON.parse(localStorage.getItem('customPaymentMethods')) || [];
  // Use the first custom method if available; otherwise, default to an empty string.
  const defaultMethod = customMethods.length > 0 ? customMethods[0] : '';

  // Initialize payment rows. If initialPayments exist, parse them;
  // otherwise, start with one payment row using the custom default method.
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
    return [{ method: defaultMethod, amount: '', id: Date.now() }];
  });

  const [remaining, setRemaining] = useState(total);
  const [change, setChange] = useState(0);

  // Recalculate remaining amount and change whenever payments update.
  useEffect(() => {
    const paid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const newRemaining = total - paid;
    setRemaining(Math.max(newRemaining, 0));
    setChange(Math.max(0, paid - total));
  }, [payments, total]);

  // When adding a new payment row, use the same default method.
  const addPaymentMethod = () => {
    setPayments([...payments, { method: defaultMethod, amount: '', id: Date.now() }]);
  };

  const updatePayment = (id, field, value) => {
    const updated = payments.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setPayments(updated);
  };

  const removePayment = (id) => {
    if (payments.length === 1) return; // Prevent removal if it's the only payment row.
    setPayments(payments.filter(p => p.id !== id));
  };

  // When the user submits, ensure that the total has been met.
  const handleSubmit = () => {
    if (remaining > 0.01) {
      alert(`Amount remaining: ${currencySymbol}${remaining.toFixed(2)}`);
      return;
    }
    onConfirm(payments.filter(p => p.amount !== ''), change);
    onClose();
  };

  // Full Amount button: allocate the remaining balance to the first empty payment row,
  // or add it to the last payment row if no empty rows exist.
  const handleFullAmount = () => {
    const paid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const rem = total - paid;

    if (rem <= 0) return;

    let updatedPayments = [...payments];
    let foundEmpty = false;

    updatedPayments = updatedPayments.map(payment => {
      if (!foundEmpty && (!payment.amount || parseFloat(payment.amount) === 0)) {
        foundEmpty = true;
        return { ...payment, amount: rem.toFixed(2) };
      }
      return payment;
    });

    if (!foundEmpty) {
      const lastIndex = updatedPayments.length - 1;
      const lastPayment = updatedPayments[lastIndex];
      const newAmount = (parseFloat(lastPayment.amount) + rem).toFixed(2);
      updatedPayments[lastIndex] = { ...lastPayment, amount: newAmount };
    }

    setPayments(updatedPayments);
  };

  // Build dropdown options from customMethods only.
  const paymentMethods = customMethods.map(method => ({
    value: method,
    label: method,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full pointer-events-auto">
        <h2 className="text-xl font-bold mb-4">Split Payment</h2>
        <div className="space-y-4">
          <div className="flex justify-between font-semibold">
            <span>Total Due:</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>

          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex gap-2 items-center">
                <select
                  value={payment.method}
                  onChange={(e) => updatePayment(payment.id, 'method', e.target.value)}
                  className="flex-1 p-2 border rounded"
                >
                  {paymentMethods.map((pm, index) => (
                    <option key={index} value={pm.value}>
                      {pm.label}
                    </option>
                  ))}
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
                ? `Remaining: ${currencySymbol}${remaining.toFixed(2)}`
                : 'Payment Complete'}
            </div>
          </div>

          {change > 0 && (
            <div className="text-sm text-blue-600 mt-2">
              Change Due: {currencySymbol}{change.toFixed(2)}
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
