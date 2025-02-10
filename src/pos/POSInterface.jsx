// File: /src/pos/POSInterface.jsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Plus, ArrowLeft, PieChart, Package, Settings, Scan, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InventoryManager } from '../utils/inventoryManager';
import { updateRepairStatus, getRepairsByStatus, saveRepair } from '../utils/repairManager';
import InventoryManagerModal from './InventoryManagerModal';
import CheckoutModal from './CheckoutModal';
import TicketModal from './TicketModal';
import WarrantyInputModal from './WarrantyInputModal';
import AddRepairForm from '../repairtickets/AddRepairForm';
import ReceiptModal from './ReceiptModal';
import TransactionListModal from './TransactionListModal';
import CustomerProfileCard from '../components/CustomerProfileCard';
import CustomerManagerModal from '../components/CustomerManagerModal';
import ItemSelectorModal from './ItemSelectorModal';
import SettingsModal from './SettingsModal';
import NotesSystem from './NotesSystem';
import CustomItemModal from './CustomItemModal'; // Import CustomItemModal
import CustomerProfileModal from '../components/CustomerProfileModal';
import DraftsModal from './DraftsModal'; // Import DraftsModal
import ConfirmationModal from '../components/ConfirmationModal'; // Import ConfirmationModal
import InvoiceModal from './InvoiceModal'; // our new modal that renders <Invoice />
import { saveInvoiceForCustomer } from '../utils/invoiceManager';

// Utility function to calculate price with tax
const calculatePriceWithTax = (price, vatRateId) => {
    const vatRates = JSON.parse(localStorage.getItem('vatRates')) || [];
    const vatRate = vatRates.find(r => r.id === vatRateId) || { rate: 0 };
    const taxRatePercentage = vatRate.rate / 100;
    return price * (1 + taxRatePercentage);
};


const DashboardPanel = ({ currency }) => {
    const [todayStats, setTodayStats] = useState({
        sales: 0,
        topServices: []
    });

    useEffect(() => {
        const loadData = () => {
            const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
            const today = new Date().toLocaleDateString();

            const todaySales = transactions
                .filter(t => new Date(t.date).toLocaleDateString() === today)
                .reduce((sum, t) => sum + t.total, 0);

            const serviceCounts = transactions
                .filter(t => new Date(t.date).toLocaleDateString() === today)
                .flatMap(t => t.items)
                .reduce((acc, item) => {
                    acc[item.name] = (acc[item.name] || 0) + item.qty;
                    return acc;
                }, {});

            const topServices = Object.entries(serviceCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

            setTodayStats({
                sales: todaySales,
                topServices
            });
        };

        loadData();
    }, []);

    return (
        <div className="bg-white p-3 rounded-lg shadow mb-3">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Today's Overview</h3>
                <Link to="/reports" className="text-teal-600 hover:text-teal-700">
                    <PieChart size={18} />
                </Link>
            </div>

            <div className="flex items-center justify-around">
                <div className="text-center">
                    <div className="text-2xl font-bold">{currency.symbol}{todayStats.sales.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Sales</div>
                </div>

                <div className="border-l h-12 mx-2" />

                <div className="space-y-1">
                    {todayStats.topServices.map(([service, count]) => (
                        <div key={service} className="text-sm flex items-center">
                            <span className="w-24 truncate">{service}</span>
                            <span className="ml-2 font-medium">{count}x</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const POSInterface = () => {
    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showTickets, setShowTickets] = useState(showTickets => false);
    const [showWarrantyModal, setShowWarrantyModal] = useState(false);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    const [showInventoryManager, setShowInventoryManager] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showNotesSystem, setShowNotesSystem] = useState(false);
    const [receiptTemplate, setReceiptTemplate] = useState(() => {
        try {
            const template = localStorage.getItem('receiptTemplate');
            return template ? JSON.parse(template) : {};
        } catch (error) {
            console.error("Failed to load receipt template from local storage", error);
            return {};
        }
    });
    const [activeRepairs, setActiveRepairs] = useState(() => getRepairsByStatus('in-progress'));
    const [completedTransaction, setCompletedTransaction] = useState(null);
    const [showTransactions, setShowTransactions] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showItemSelector, setShowItemSelector] = useState(false);
    const [selectedProfileCustomer, setSelectedProfileCustomer] = useState(null);
    const [showCustomerProfileModal, setShowCustomerProfileModal] = useState(false);
    const [barcode, setBarcode] = useState('');
    const barcodeInputRef = useRef(null);
    const [showCustomItemModal, setShowCustomItemModal] = useState(false);
    const [showDraftsModal, setShowDraftsModal] = useState(false);
    const [drafts, setDrafts] = useState(() => {
        const saved = localStorage.getItem('pos_drafts');
        return saved ? JSON.parse(saved) : [];
    });
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('posCurrency');
        return saved ? JSON.parse(saved) : { code: 'USD', symbol: '$' };
    });
    const [draftName, setDraftName] = useState(''); // State for draft name input
    const [showDraftNamePrompt, setShowDraftNamePrompt] = useState(false); // State to control draft name prompt modal

    // Add new state variables for handling invoice completion and modal visibility.
    const [completedInvoice, setCompletedInvoice] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);


    useEffect(() => {
        localStorage.setItem('posCurrency', JSON.stringify(currency));
    }, [currency]);

    const calculateTax = (cart) => {
        if (selectedCustomer?.taxExempt) {
            // No tax for tax-exempt customers
            return { totalTax: 0, taxByRate: {} };
        }

        const vatRates = JSON.parse(localStorage.getItem('vatRates')) || [];
        const taxByRate = {};

        cart.forEach(item => {
            const rate = vatRates.find(r => r.id === item.vatRateId) || { rate: 0 };
            const tax = (item.price * item.qty * rate.rate) / 100;
            if (!taxByRate[rate.rate]) {
                taxByRate[rate.rate] = 0;
            }
            taxByRate[rate.rate] += tax;
        });

        return {
            totalTax: Object.values(taxByRate).reduce((sum, tax) => sum + tax, 0),
            taxByRate
        };
    };

    const { totalTax, taxByRate } = calculateTax(cart);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + totalTax;


    const addToCart = (item) => {
        let foundItem = null;

        if (item.id) {
            foundItem = InventoryManager.getById(item.id);
        }

        if (foundItem) {
            if (foundItem.quantity_on_hand <= 0) {
                alert('Item out of stock');
                return;
            }

            const existing = cart.find(c => c.id === foundItem.id);
            const priceWithTax = calculatePriceWithTax(foundItem.price, foundItem.vatRateId);


            setCart(existing ?
                cart.map(c => c.id === foundItem.id ? { ...c, qty: c.qty + 1, priceWithTax: priceWithTax } : c) :
                [...cart, { ...foundItem, qty: 1, priceWithTax: priceWithTax, vatRateId: foundItem.vatRateId }]
            );
        }
        else {
            const existing = cart.find((c) => c.id === item.id);
            setCart(
                existing
                    ? cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
                    : [...cart, { ...item, qty: 1 }]
            );
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, qty) => {
        const item = cart.find(i => i.id === id);

        if (item?.type === 'item' || item?.type === 'device') {
            const inventoryItem = InventoryManager.getById(id);

            if (qty > (inventoryItem?.quantity_on_hand || 0)) {
                alert(`Only ${inventoryItem?.quantity_on_hand} available`);
                return;
            }
        }

        setCart(cart.map(i =>
            i.id === id ? { ...i, qty: Math.max(0, qty) } : i
        ).filter(i => i.qty > 0));
    };

    const handleReset = () => {
        setCart([]);
        setBarcode('');
        if (barcodeInputRef.current) barcodeInputRef.current.focus();
    };

    const handleNewTransaction = () => {
        setCompletedTransaction(null);
        setCompletedInvoice(null); // Reset invoice state too
        setShowInvoiceModal(false);  // Ensure invoice modal is closed
        setCart([]);
        setBarcode('');
        if (barcodeInputRef.current) barcodeInputRef.current.focus();
    };

    const handleCheckout = (paymentEntries, change) => {
        try {
          const isEditing = !!editingTransaction;

          if (isEditing) {
            editingTransaction.items.forEach((item) => {
              const invItem = InventoryManager.getById(item.id);
              if (invItem) {
                InventoryManager.updateItem({
                  ...invItem,
                  quantity_on_hand: invItem.quantity_on_hand + item.qty,
                });
              }
            });
          }

          cart.forEach((item) => {
            const invItem = InventoryManager.getById(item.id);
            if (invItem) {
              InventoryManager.updateItem({
                ...invItem,
                quantity_on_hand: invItem.quantity_on_hand - item.qty,
              });
            }
          });

          const transactions = JSON.parse(localStorage.getItem("pos_transactions") || "[]");
          let lastId = parseInt(localStorage.getItem("lastTransactionId") || "0");
          const newId = lastId + 1;

          // Build the basic transaction object (existing logic)
          const newTransaction = {
            customerId: selectedCustomer?.id || null,
            id: newId,
            receiptId: `REC-${newId.toString().padStart(4, "0")}`,
            date: new Date().toISOString(),
            items: cart.map((item) => ({
              ...item,
              customerId: selectedCustomer?.id || null,
            })),
            subtotal,
            tax: totalTax,
            taxByRate: taxByRate || {}, // Ensure a valid object is passed
            total,
            change: Number(change.toFixed(2)),
            paymentMethods: paymentEntries.map((p) => `${p.method}: $${Number(p.amount).toFixed(2)}`),
          };

          if (isEditing) {
            const index = transactions.findIndex((t) => t.id === editingTransaction.id);
            if (index !== -1) {
              transactions[index] = {
                ...editingTransaction,
                items: cart,
                subtotal,
                tax: totalTax,
                taxByRate: taxByRate || {}, // *** ADD THIS LINE in the editing branch ***
                total,
                change: Number(change.toFixed(2)),
                paymentMethods: paymentEntries.map((p) => `${p.method}: $${Number(p.amount).toFixed(2)}`),
              };
              setCompletedTransaction(transactions[index]);
            }
          } else {
            transactions.push(newTransaction);
            localStorage.setItem("lastTransactionId", newId.toString());


            // --- Invoice generation for business customers ---
            const isBusinessCustomer = selectedCustomer && selectedCustomer.vatNumber;
            if (isBusinessCustomer) {
              // Build the invoice object
              const invoiceData = {
                invoiceNumber: `INV-${Date.now()}`, // Generate a unique invoice number
                invoiceDate: new Date().toISOString(),  // Factuurdatum
                // Leveringsdatum / datum van prestaties: we use the current date
                // (Delivery date can be computed here as needed.)
                customerName: selectedCustomer.companyName ||
                  `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
                customerAddress: selectedCustomer.address || "",
                items: cart.map(item => ({
                  description: item.name, // or a more detailed description
                  quantity: item.qty,
                  price: item.price,      // assume this is the net (excl. VAT) price
                  taxPercentage: item.taxPercentage || 0, // if stored; otherwise, default to 0
                })),
                subtotal,      // already computed
                totalTax,      // already computed
                total,         // grand total (subtotal + tax)
                paymentTerms: "Betaling binnen 30 dagen", // or pull from your checkout if available
                // If the customer is tax‑exempt, we later show “btw verlegd”
                taxExempt: selectedCustomer.taxExempt || false,
              };

              // Save the invoice to the customer's record
              // --- Call the saveInvoiceForCustomer function here ---
              saveInvoiceForCustomer(selectedCustomer.id, invoiceData);

              setCompletedInvoice(invoiceData);
              setShowInvoiceModal(true);
            } else {
              // For non-business customers, continue with your normal receipt flow.
              setCompletedTransaction(newTransaction);
            }


            if (selectedCustomer) {
              const customers = JSON.parse(localStorage.getItem("customers") || "[]");
              const customerIndex = customers.findIndex((c) => c.id === selectedCustomer.id);

              if (customerIndex > -1) {
                if (!customers[customerIndex].purchaseHistory) {
                  customers[customerIndex].purchaseHistory = [];
                }
                customers[customerIndex].purchaseHistory.push(newTransaction.id);
                localStorage.setItem("customers", JSON.stringify(customers));
              }
            }
          }

          localStorage.setItem("pos_transactions", JSON.stringify(transactions));
          setCart([]);
          setEditingTransaction(null);
          setSelectedCustomer(null);
        } catch (error) {
          console.error("Checkout failed:", error);
        }
        setShowCheckout(false);
      };

    const handleCheckoutModalConfirm = (paymentEntries, change) => {
        handleCheckout(paymentEntries, change);
    };

    const handleSaveTemplate = (template) => {
        localStorage.setItem('receiptTemplate', JSON.stringify(template));
        setReceiptTemplate(template);
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setCart(transaction.items);
        setShowTransactions(false);
    };

    const handleAddRepairToCart = (repair, warrantyMonths, newPrice) => {
        // Update repair status
        updateRepairStatus(repair.id, 'completed');

        // Add to cart with the updated price and determine VAT rate
        const vatRates = JSON.parse(localStorage.getItem('vatRates')) || [];
        const defaultVatRate = vatRates.find(r => r.description === 'Standard Rate') || vatRates[0] || { id: null }; // Fallback strategy

        const newItem = {
            id: repair.repairTicketNumber,
            name: `${repair.deviceType} Repair`,
            imei: repair.imei,
            warranty: `${warrantyMonths} months`,
            price: parseFloat(newPrice), // Ensure newPrice is a number
            qty: 1,
            vatRateId: defaultVatRate.id, // Add the default VAT rate ID here
        };
        addToCart(newItem);
        setActiveRepairs(getRepairsByStatus('in-progress'));
        setShowWarrantyModal(false);
        setShowTickets(false);
    };

    const handleSaveNewRepair = (newRepair) => {
        // Add to localStorage using repair manager
        // Find the default VAT rate (e.g., "Standard Rate") or fallback to the first
        const vatRates = JSON.parse(localStorage.getItem('vatRates')) || [];
        const defaultVatRate = vatRates.find(r => r.description === "Standard Rate") || vatRates[0] || { id: null };

        const createdRepair = saveRepair({
            ...newRepair,
            status: 'in-progress',
            dateReceived: new Date().toISOString(),
            vatRateId: defaultVatRate.id,
        });

        // Update active repairs list
        setActiveRepairs(prev => [...prev, createdRepair]);
        setShowCreateTicket(false);
    };

    const handleLoadDraft = (draft) => {
        setCart(draft.items);
        setSelectedCustomer(draft.customerId ? InventoryManager.getById(draft.customerId) : null);
        setShowDraftsModal(false);
    };

    // Updated handleSaveDraft to prompt for draft name
    const handleSaveDraft = () => {
        if (cart.length === 0) {
            alert('Cannot save an empty cart as a draft.');
            return;
        }
        setShowDraftNamePrompt(true); // Show the draft name prompt modal
    };

    const handleConfirmSaveDraft = () => {
        const newDraft = {
            id: `draft-${Date.now()}`,
            timestamp: new Date().toISOString(),
            customerId: selectedCustomer?.id || null,
            items: [...cart], // Important: Create a copy
            name: draftName // Save the draft name
        };

        const updatedDrafts = [...drafts, newDraft];
        setDrafts(updatedDrafts);
        localStorage.setItem('pos_drafts', JSON.stringify(updatedDrafts));
        setShowDraftNamePrompt(false); // Close the prompt modal
        setDraftName(''); // Clear the draft name input
        alert('Cart saved as draft: ' + (draftName || 'Unnamed Draft')); // Alert with draft name
    };

    const handleCancelSaveDraft = () => {
        setShowDraftNamePrompt(false); // Close the prompt modal without saving
        setDraftName(''); // Clear the draft name input
    };


    const handleDeleteDraft = (draftIdToDelete) => {
        const updatedDrafts = drafts.filter(draft => draft.id !== draftIdToDelete);
        setDrafts(updatedDrafts);
        localStorage.setItem('pos_drafts', JSON.stringify(updatedDrafts));
    };


    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleCustomerProfileView = (customer) => {
        setSelectedProfileCustomer(customer);
        setShowCustomerProfileModal(true);
    };

    const handleSelectItem = (item) => {
        addToCart(item);
        setShowItemSelector(false);
    };

    const handleCloseSettings = () => {
        setShowSettings(false);
    };

    const handleBarcodeChange = (e) => {
        setBarcode(e.target.value);
    };

    const onBarcodeScan = useCallback((event) => {
        setBarcode(event.data);
    }, []);

    useEffect(() => {
        if (barcode) {
            const item = InventoryManager.getByBarcode(barcode);
            if (item) {
                addToCart(item);
            } else {
                //alert('Item not found'); // Removed alert to prevent repetitive alerts on rapid scanning
            }
            setBarcode('');
            if (barcodeInputRef.current) barcodeInputRef.current.focus();
        }
    }, [barcode]);

    const handleAddCustomItem = (item) => {
        setCart([...cart, { ...item, qty: 1 }]);
    };

    const ActionButton = ({ children, className = "", ...props }) => (
        <button className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${className}`} {...props}>
            {children}
        </button>
    );

    const ServiceCard = ({ icon: Icon, title, price, isAdd, onAddToCart }) => (
        <div
            className={`p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${isAdd ? 'bg-teal-600 text-white' : 'bg-white hover:bg-gray-50'
                }`}
            onClick={onAddToCart}
        >
            <Icon className="w-8 h-8 sm:w-12 sm:h-12 mb-2" />
            <span className="text-sm sm:text-base text-center">{title}</span>
            {!isAdd && <span className="text-sm text-gray-600">{currency.symbol}{price.toFixed(2)}</span>}
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {showCheckout && (
                <CheckoutModal
                    currencySymbol={currency.symbol}
                    total={total}
                    onClose={() => setShowCheckout(false)}
                    onConfirm={handleCheckoutModalConfirm}
                    initialPayments={editingTransaction?.paymentMethods}
                />
            )}
            {showDraftsModal && (
                <DraftsModal
                    drafts={drafts}
                    onClose={() => setShowDraftsModal(false)}
                    onLoadDraft={handleLoadDraft}
                    onDeleteDraft={handleDeleteDraft} // Pass onDeleteDraft
                />
            )}
            {showDraftNamePrompt && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Save Draft As</h2>
                        <input
                            type="text"
                            placeholder="Draft Name (Optional)"
                            className="w-full p-2 border rounded mb-4"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancelSaveDraft}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSaveDraft}
                                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                            >
                                Save Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {completedTransaction && (
                <ReceiptModal
                    currencySymbol={currency.symbol}
                    transaction={completedTransaction}
                    onNewTransaction={handleNewTransaction}
                    template={receiptTemplate}
                />
            )}
            {showInvoiceModal && completedInvoice && (
                <InvoiceModal
                    currency={currency}             // Pass your currency object (e.g. { symbol: '$' })
                    invoice={completedInvoice}      // The invoice object we just built
                    template={receiptTemplate}      // You can use the extended template for invoices
                    onNewTransaction={() => {
                        // Reset invoice modal and start a new transaction
                        setCompletedInvoice(null);
                        setShowInvoiceModal(false);
                        handleNewTransaction();
                    }}
                />
            )}


            {showTransactions && (
                <TransactionListModal
                    currencySymbol={currency.symbol}
                    onClose={() => setShowTransactions(false)}
                    onEditTransaction={handleEditTransaction}
                    template={receiptTemplate} //Pass receiptTemplate here
                />
            )}

            {showTickets && (
                <TicketModal
                    repairs={activeRepairs}
                    onClose={() => setShowTickets(false)}
                    onAddToCart={(repair) => {
                        setSelectedRepair(repair);
                        setShowWarrantyModal(true);
                    }}
                />
            )}

            {showWarrantyModal && (
                <WarrantyInputModal
                    device={selectedRepair}
                    defaultPrice={selectedRepair.basePrice}  // or selectedRepair.priceEstimate if you prefer
                    onClose={() => setShowWarrantyModal(false)}
                    onConfirm={(months, newPrice) => handleAddRepairToCart(selectedRepair, months, newPrice)}

                />
            )}

            {showCreateTicket && (
                <AddRepairForm
                    isOpen={showCreateTicket}
                    onClose={() => setShowCreateTicket(false)}
                    onSave={handleSaveNewRepair}
                />
            )}

            {showInventoryManager && (
                <InventoryManagerModal currencySymbol={currency.symbol} onClose={() => setShowInventoryManager(false)} />
            )}

            {showItemSelector && (
                <ItemSelectorModal
                    currencySymbol={currency.symbol}
                    onClose={() => setShowItemSelector(false)}
                    onSelectItem={handleSelectItem}
                />
            )}

            {showSettings && (
                <SettingsModal
                    onClose={handleCloseSettings}
                    onSave={(newTemplate, newCurrency) => {
                        handleSaveTemplate(newTemplate);
                        setCurrency(newCurrency);
                    }}
                    initialTemplate={receiptTemplate}
                    initialCurrency={currency}
                />
            )}

            {showNotesSystem && (
                <NotesSystem onClose={() => setShowNotesSystem(false)} />
            )}

            {showCustomerProfileModal && (
                <CustomerProfileModal
                    customer={selectedProfileCustomer}
                    onClose={() => setShowCustomerProfileModal(false)}
                />
            )}

            {showCustomerModal && (
                <CustomerManagerModal
                    onSelect={(customer) => {
                        setSelectedCustomer(customer);
                        setShowCustomerModal(false);
                    }}
                    onViewProfile={handleCustomerProfileView}
                    onClose={() => setShowCustomerModal(false)}
                />
            )}

            <div className="bg-teal-600 text-white p-3 flex justify-between items-center">
                <Link to="/" className="flex items-center hover:text-blue-200 transition-colors">
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Repair Point
                </Link>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setShowCustomerModal(true)}
                        className="text-sm hover:text-teal-200 transition-colors"
                    >
                        Customers
                    </button>
                    <button
                        onClick={() => setShowTransactions(true)}
                        className="text-sm hover:text-teal-200 transition-colors"
                    >
                        Transactions
                    </button>
                    <Link
                        to="/reports"
                        className="text-sm hover:text-teal-200 transition-colors"
                    >
                        Reports
                    </Link>
                    <button
                        onClick={() => setShowInventoryManager(true)}
                        className="text-sm hover:text-teal-200 transition-colors"
                    >
                        Manage Inventory
                    </button>
                    <button
                        onClick={() => setShowNotesSystem(true)}
                        className="text-sm hover:text-teal-200 transition-colors"
                    >
                        Notes
                    </button>
                </div>
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-teal-700 rounded-full transition-colors"
                >
                    <Settings size={20} className="text-white" />
                </button>
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-3 p-3 h-[calc(100vh-140px)]">
                <div className="bg-white rounded-lg shadow p-3 flex flex-col">
                    <div className="flex items-start justify-between mb-3 gap-4">
                        {selectedCustomer ? (
                            <div className="flex-1">
                                <CustomerProfileCard
                                    currencySymbol={currency.symbol}
                                    customer={selectedCustomer}
                                    onClear={() => setSelectedCustomer(null)}
                                />
                            </div>
                        ) : (
                            <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="text-gray-600 text-sm">
                                    <div className="font-medium mb-1">Guest Customer</div>
                                    <p>No customer selected</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowCustomerModal(true)}
                            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 self-start"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <input
                            type="text"
                            ref={barcodeInputRef}
                            placeholder="Scan Barcode"
                            value={barcode}
                            onChange={handleBarcodeChange}
                            className="flex-1 p-2 border rounded"
                        />
                        <Scan className="w-6 h-6" />
                    </div>

                    <div className="space-y-3 text-sm sm:text-base">
                        <div className="mt-3 sm:mt-4 overflow-x-auto">
                            <table className="w-full min-w-[400px]">
                                <thead>
                                    <tr className="text-left text-gray-600">
                                        <th className="pr-2">QTY</th>
                                        <th className="min-w-[150px]">Item Name</th>
                                        <th className="pr-2">SKU/IMEI</th>
                                        <th className="pr-2">Warranty</th>
                                        <th className="pr-2">Price</th>
                                        <th className="pr-2">VAT Rate</th> {/* Add VAT Rate column */}
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => {
                                        const inventoryItem = InventoryManager.getById(item.id);
                                        const priceWithTax = calculatePriceWithTax(item.price, item.vatRateId);


                                        const vatRates = JSON.parse(localStorage.getItem('vatRates')) || [];
                                        const vatRate = vatRates.find(r => r.id === item.vatRateId);


                                        return (
                                            <tr key={item.id} className={inventoryItem && inventoryItem.quantity_on_hand < inventoryItem.low_stock_threshold ? 'bg-yellow-100' : ''}>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                        className="w-16 p-1 border rounded"
                                                        min="1"
                                                    />
                                                </td>
                                                <td>
                                                    {item.name}
                                                    {inventoryItem && inventoryItem.quantity_on_hand < inventoryItem.low_stock_threshold && (
                                                        <span className="ml-1 text-xs text-red-600">Low Stock</span>
                                                    )}
                                                </td>
                                                <td>{item.sku || item.imei || '-'}</td>
                                                <td>{item.warranty || (item.type ? 'N/A' : '-')}</td>
                                                <td>{currency.symbol}{priceWithTax.toFixed(2)}</td>
                                                <td>{vatRate ? `${vatRate.description} (${vatRate.rate}%)` : 'N/A'}</td> {/* Display VAT rate */}
                                                <td>{currency.symbol}{(priceWithTax * item.qty).toFixed(2)}</td>
                                                <td>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-3 sm:mt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Sub Total</span>
                                <span>{currency.symbol}{subtotal.toFixed(2)}</span>
                            </div>

                            {/* Display individual tax amounts for each rate */}
                            {Object.entries(taxByRate).map(([rate, amount]) => {
                                const vatRate = (JSON.parse(localStorage.getItem('vatRates')) || []).find(r => r.rate === parseFloat(rate));
                                return (
                                    <div key={rate} className="flex justify-between">
                                        <span>Tax ({vatRate ? vatRate.description : rate}%)</span>
                                        <span>{currency.symbol}{amount.toFixed(2)}</span>
                                    </div>
                                )
                            })}

                            <div className="flex justify-between">
                                <span>Total Tax</span>
                                <span>{currency.symbol}{totalTax.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-bold">Total</span>
                                <span>{currency.symbol}{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-full gap-3">
                    <div className="flex-1 overflow-auto">
                        <DashboardPanel currency={currency} />

                        <div className="mt-3">
                            <div className="flex gap-2">
                                <ServiceCard
                                    icon={Package}
                                    title="Select Item"
                                    isAdd
                                    onAddToCart={() => setShowItemSelector(true)}
                                />
                                <ServiceCard
                                    icon={Plus}
                                    title="Custom Item"
                                    isAdd
                                    onAddToCart={() => setShowCustomItemModal(true)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-gray-100 pt-4 pb-2 z-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <ActionButton
                                className="bg-teal-600 text-white hover:bg-teal-700"
                                onClick={() => setShowTickets(true)}
                            >
                                View Tickets
                            </ActionButton>
                            <ActionButton
                                className="bg-teal-600 text-white hover:bg-teal-700"
                                onClick={() => alert('View Invoices functionality')}
                            >
                                View Invoices
                            </ActionButton>
                            <ActionButton
                                className="bg-teal-600 text-white hover:bg-teal-700"
                                onClick={() => alert('Create Estimate functionality')}
                            >
                                Create Estimate
                            </ActionButton>
                            <ActionButton
                                className="bg-teal-600 text-white hover:bg-teal-700"
                                onClick={() => setShowCreateTicket(true)}
                            >
                                Create Ticket
                            </ActionButton>
                            <ActionButton
                                className="bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed"
                                onClick={() => setShowCheckout(true)}
                                disabled={cart.length === 0}
                            >
                                Checkout
                            </ActionButton>
                            <ActionButton
                                className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                                onClick={handleSaveDraft}
                            >
                                <Save size={16} className="mr-2 inline-block"/>
                                Save Draft
                            </ActionButton>
                            <ActionButton
                                className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                                onClick={() => setShowDraftsModal(true)}
                            >
                                Load Draft
                            </ActionButton>
                            <ActionButton
                                className="bg-red-100 text-red-600 hover:bg-red-200"
                                onClick={handleReset}
                            >
                                Reset
                            </ActionButton>
                        </div>
                    </div>
                </div>
            </div>
            {showCustomItemModal && (
                <CustomItemModal
                    isOpen={showCustomItemModal}
                    onClose={() => setShowCustomItemModal(false)}
                    onAddItem={handleAddCustomItem}
                    currencySymbol={currency.symbol}
                />
            )}
        </div>
    );
};

export default POSInterface;