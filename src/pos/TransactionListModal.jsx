// TransactionListModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReceiptModal from './ReceiptModal';
import RefundModal from './RefundModal';
import { InventoryManager } from '../utils/inventoryManager';
import ConfirmationModal from '../components/ConfirmationModal'; // Import ConfirmationModal

const TransactionListModal = ({ currencySymbol, onClose, onEditTransaction, template }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [filterType, setFilterType] = useState('today');
    const [itemTypeFilter, setItemTypeFilter] = useState('all'); // 'all', 'custom', 'inventory'
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedTransactionForRefund, setSelectedTransactionForRefund] = useState(null);
    const [transactions, setTransactions] = useState([]); // Use state for transactions
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [showTransactionHistory, setShowTransactionHistory] = useState(false); // New state for showing history
    const [selectedTransactionHistory, setSelectedTransactionHistory] = useState(null); // New state for selected transaction history

    // Load transactions from localStorage on component mount
    useEffect(() => {
        const loadedTransactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
        setTransactions(loadedTransactions);
    }, []);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endToday = new Date(today);
        endToday.setHours(23, 59, 59, 999);
        setDateRange([today, endToday]);
    }, []);

    const handleFilter = (type) => {
        const now = new Date();
        let start, end;

        switch (type) {
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
                // Update transaction record
                const updatedItems = t.items.map(item => {
                    const refundedItem = refundData.items
                        ? refundData.items.find(i => i.id === item.id)
                        : null;
                    if (refundedItem) {
                        return {
                            ...item,
                            qty: item.qty - refundedItem.refundQty,
                            refundedQty: (item.refundedQty || 0) + refundedItem.refundQty
                        };
                    }
                    return item;
                });

                return {
                    ...t,
                    items: updatedItems,
                    refunds: [...(t.refunds || []), {
                        ...refundData,
                        date: new Date().toISOString(),
                        processedBy: "Current User"
                    }],
                };
            }
            return t;
        });

        localStorage.setItem('pos_transactions', JSON.stringify(updatedTransactions));
        setTransactions(updatedTransactions); // Update state
    };

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                // Existing date range filter
                const transactionDate = new Date(t.date);
                const dateFilter = (!startDate || transactionDate >= startDate) &&
                    (!endDate || transactionDate <= endDate);

                // New item type filter
                const itemTypeMatch = itemTypeFilter === 'all' ||
                    t.items.some(item =>
                        itemTypeFilter === 'custom' ? item.isCustom : !item.isCustom
                    );

                return dateFilter && itemTypeMatch;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions, startDate, endDate, itemTypeFilter]);

    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

    const confirmDeleteTransaction = (transaction) => {
        setTransactionToDelete(transaction);
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = () => {
        handleDelete(transactionToDelete.id);
        setShowConfirmationModal(false);
        setTransactionToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
        setTransactionToDelete(null);
    };

    const handleDelete = (id) => {
        const updated = transactions.filter(t => t.id !== id);
        localStorage.setItem('pos_transactions', JSON.stringify(updated));
        setTransactions(updated); // Update state
        onClose();
    };

    const confirmEditTransaction = (transaction) => {
        setTransactionToEdit(transaction);
        setShowConfirmationModal(true);
    };

    const handleConfirmEdit = () => {
        handleEdit(transactionToEdit);
        setShowConfirmationModal(false);
        setTransactionToEdit(null);
    };

    const handleCancelEdit = () => {
        setShowConfirmationModal(false);
        setTransactionToEdit(null);
    };

    const handleEdit = (transaction) => {
        onEditTransaction(transaction);
        onClose();
    };

    const handleViewTransactionHistory = (transaction) => {
        setSelectedTransactionHistory(transaction);
        setShowTransactionHistory(true);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto pointer-events-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Transactions</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleFilter('today')}
                            className={`px-3 py-1 rounded text-sm ${filterType === 'today' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => handleFilter('week')}
                            className={`px-3 py-1 rounded text-sm ${filterType === 'week' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            This Week
                        </button>
                        <button
                            onClick={() => handleFilter('month')}
                            className={`px-3 py-1 rounded text-sm ${filterType === 'month' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            This Month
                        </button>
                        <ReactDatePicker
                            selectsRange={true}
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
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setItemTypeFilter('all')}
                        className={`px-3 py-1 rounded text-sm ${itemTypeFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        All Items
                    </button>
                    <button
                        onClick={() => setItemTypeFilter('custom')}
                        className={`px-3 py-1 rounded text-sm ${itemTypeFilter === 'custom' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        Custom Items
                    </button>
                    <button
                        onClick={() => setItemTypeFilter('inventory')}
                        className={`px-3 py-1 rounded text-sm ${itemTypeFilter === 'inventory' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        Inventory Items
                    </button>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Payment</th>
                            <th className="p-2 text-right">Amount</th>
                            <th className="p-2 text-left">Items</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(transaction => (
                            <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="p-2 font-mono">#{transaction.id.toString().padStart(4, '0')}</td>
                                <td className="p-2">{transaction.paymentMethods?.[0]?.split(':')[0] || 'Cash'}</td>
                                <td className="p-2 text-right">{currencySymbol}{transaction.total.toFixed(2)}</td>
                                <td className="p-2">
                                    <div className="text-sm">
                                        {transaction.items.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span>
                                                    {item.qty}x {item.name}
                                                    {item.isCustom && (
                                                        <span className="ml-1 text-xs text-blue-600">(Custom)</span>
                                                    )}
                                                </span>
                                                <span>{currencySymbol}{(item.price * item.qty).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-2 flex gap-2">
                                    <button
                                        onClick={() => confirmDeleteTransaction(transaction)}
                                        className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => confirmEditTransaction(transaction)}
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
                                    <button
                                        onClick={() => handleViewTransactionHistory(transaction)}
                                        className="text-gray-600 hover:text-gray-800 text-xs"
                                    >
                                        History
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
                        Total: {currencySymbol}{totalAmount.toFixed(2)} ({filteredTransactions.length} transactions)
                        {filterType === 'custom' && startDate && endDate && (
                            <span className="ml-2 text-xs">
                                ({startDate.toLocaleDateString()} - {endDate.toLocaleDateString()})
                            </span>
                        )}
                    </div>
                </div>

                {selectedTransaction && (
                    <ReceiptModal
                        currencySymbol={currencySymbol}
                        transaction={selectedTransaction}
                        onNewTransaction={() => setSelectedTransaction(null)}
                        template={template}
                    />
                )}
                {showRefundModal && (
                    <RefundModal
                        transaction={selectedTransactionForRefund}
                        onClose={() => setShowRefundModal(false)}
                        onRefund={handleRefund}
                    />
                )}
                {/* Confirmation Modal */}
                {showConfirmationModal && (
                    <ConfirmationModal
                        message={transactionToDelete
                            ? `Are you sure you want to delete transaction ${transactionToDelete.id}?`
                            : transactionToEdit
                                ? `Are you sure you want to edit transaction ${transactionToEdit.id}?`
                                : ""}
                        confirmText={transactionToDelete ? "Delete" : transactionToEdit ? "Edit" : "Confirm"}
                        cancelText="Cancel"
                        onConfirm={transactionToDelete
                            ? handleConfirmDelete
                            : transactionToEdit
                                ? handleConfirmEdit
                                : null}
                        onCancel={transactionToDelete || transactionToEdit
                            ? handleCancelDelete
                            : onClose}
                        isOpen={showConfirmationModal}
                    />
                )}
            </div>
            {showTransactionHistory && selectedTransactionHistory && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
                        <p className="text-sm text-gray-600 mb-2">Transaction ID: {selectedTransactionHistory.id}</p>

                        {selectedTransactionHistory.refunds && selectedTransactionHistory.refunds.length > 0 ? (
                            <div>
                                <h3 className="font-semibold mb-2">Refund History:</h3>
                                {selectedTransactionHistory.refunds.map((refund, index) => (
                                    <div key={index} className="border rounded p-2 mb-2">
                                        <p className="text-sm">Refund Date: {new Date(refund.date).toLocaleDateString()}</p>
                                        <p className="text-sm">Refund Amount: {currencySymbol}{refund.refundTotal.toFixed(2)}</p>
                                        {refund.items && (
                                            <div>
                                                <h4 className="font-semibold mt-2">Refunded Items:</h4>
                                                <ul className="list-disc pl-5">
                                                    {refund.items.map(item => (
                                                        <li key={item.id} className="text-sm">
                                                            {item.refundQty} x {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No refunds for this transaction.</p>
                        )}

                        <button
                            onClick={() => setShowTransactionHistory(false)}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionListModal;