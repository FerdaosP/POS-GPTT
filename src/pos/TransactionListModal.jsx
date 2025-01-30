import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReceiptModal from './ReceiptModal';
import RefundModal from './RefundModal'; // Import the RefundModal

const TransactionListModal = ({ onClose, onEditTransaction }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [filterType, setFilterType] = useState('today');
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedTransactionForRefund, setSelectedTransactionForRefund] = useState(null);
    const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');

  useEffect(() => {
    // Set default to today's transactions with proper time range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date(today);
    endToday.setHours(23, 59, 59, 999);
    setDateRange([today, endToday]);
  }, []);

  const handleFilter = (type) => {
    const now = new Date();
    let start, end;
    
    switch(type) {
      case 'today':
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = null;
        end = null;
    }

    setFilterType(type);
    setDateRange([start, end]);
  };


    const handleRefund = (refundData) => {
        const updatedTransactions = transactions.map(t => {
          if (t.id === refundData.transactionId) {
            const updatedItems = t.items.map(item => {
              const refundedItem = refundData.items.find(i => i.id === item.id);
              if (refundedItem) {
                return { ...item, qty: item.qty - refundedItem.refundQty };
              }
              return item;
            });
    
            return {
              ...t,
              items: updatedItems,
              refunds: [...(t.refunds || []), refundData],
            };
          }
          return t;
        });
    
        localStorage.setItem('pos_transactions', JSON.stringify(updatedTransactions));
        setTransactions(updatedTransactions);
      };

      
  const filteredTransactions = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return (!startDate || transactionDate >= startDate) && 
             (!endDate || transactionDate <= endDate);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

  const handleDelete = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    localStorage.setItem('pos_transactions', JSON.stringify(updated));
    onClose();
  };

  const handleEdit = (transaction) => {
    onEditTransaction(transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto pointer-events-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transactions</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFilter('today')}
              className={`px-3 py-1 rounded text-sm ${
                filterType === 'today' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleFilter('week')}
              className={`px-3 py-1 rounded text-sm ${
                filterType === 'week' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleFilter('month')}
              className={`px-3 py-1 rounded text-sm ${
                filterType === 'month' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              This Month
            </button>
            <ReactDatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
                setFilterType('custom');
              }}
              className="border p-2 rounded text-sm ml-2"
              dateFormat="yyyy-MM-dd"
              placeholderText="Custom range"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="p-2 font-mono">#{transaction.id.toString().padStart(4, '0')}</td>
                <td className="p-2">{transaction.paymentMethods?.[0]?.split(':')[0] || 'Cash'}</td>
                <td className="p-2 text-right">€{transaction.total.toFixed(2)}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Edit
                  </button>
                   <button
                    onClick={() => {
                    setSelectedTransactionForRefund(transaction);
                    setShowRefundModal(true);
                  }}
                    className="text-orange-600 hover:text-orange-800 text-xs"
                  >
                    Refund
                  </button>
                   <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center text-sm">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <div className="text-gray-600">
            Total: €{totalAmount.toFixed(2)} ({filteredTransactions.length} transactions)
            {filterType === 'custom' && startDate && endDate && (
              <span className="ml-2 text-xs">
                ({startDate.toLocaleDateString()} - {endDate.toLocaleDateString()})
              </span>
            )}
          </div>
        </div>

        {selectedTransaction && (
          <ReceiptModal
            transaction={selectedTransaction}
            onNewTransaction={() => setSelectedTransaction(null)}
          />
        )}
         {showRefundModal && (
          <RefundModal
            transaction={selectedTransactionForRefund}
            onClose={() => setShowRefundModal(false)}
            onRefund={handleRefund}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionListModal;