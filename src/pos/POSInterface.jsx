import React, { useState, useEffect } from 'react';
import { Smartphone, Watch, Diamond, Plus, ArrowLeft, PieChart, Package, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InventoryManager } from '../utils/inventoryManager';
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
import SettingsModal from './SettingsModal'; // Import SettingsModal
import NotesSystem from './NotesSystem'; // Import NotesSystem component
import CustomerProfileModal from '../components/CustomerProfileModal'; // Import CustomerProfileModal

const DashboardPanel = () => {
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
                    <div className="text-2xl font-bold">${todayStats.sales.toFixed(2)}</div>
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
  const [showTickets, setShowTickets] = useState(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showInventoryManager, setShowInventoryManager] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
      const [showNotesSystem, setShowNotesSystem] = useState(false); // State for Notes System Modal
      const [receiptTemplate, setReceiptTemplate] = useState(() => {
        try {
          const template = localStorage.getItem('receiptTemplate');
          return template ? JSON.parse(template) : null;
        } catch (error) {
          console.error("Failed to load receipt template from local storage", error);
          return null;
        }
      });
  const [activeRepairs, setActiveRepairs] = useState([
    {
      repairTicketNumber: "REP-2024-001",
      deviceType: "iPhone 13",
      imei: "123456789012345",
      basePrice: 99.99
    },
    {
      repairTicketNumber: "REP-2024-002",
      deviceType: "Samsung S21",
      imei: "987654321098765",
      basePrice: 89.99
    }
  ]);
  const [completedTransaction, setCompletedTransaction] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);
    const [selectedProfileCustomer, setSelectedProfileCustomer] = useState(null);
    const [showCustomerProfileModal, setShowCustomerProfileModal] = useState(false);


  const TAX_RATE = 0.10;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;


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
      setCart(existing ?
        cart.map(c => c.id === foundItem.id ? { ...c, qty: c.qty + 1 } : c) :
        [...cart, { ...foundItem, qty: 1 }]
      );

    } else {
      const existing = cart.find(c => c.id === item.id);
      setCart(existing ?
        cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) :
        [...cart, { ...item, qty: 1 }]
      );
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    const item = cart.find(i => i.id === id);

        if(item?.type === 'item' || item?.type === 'device') {
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
  };

  const handleNewTransaction = () => {
    setCompletedTransaction(null);
    setCart([]);
  };

   const handleCheckout = (paymentEntries, change) => { //Receive change here
    try {
      const isEditing = !!editingTransaction;

      if (isEditing) {
        editingTransaction.items.forEach(item => {
          const invItem = InventoryManager.getById(item.id);
          if (invItem) {
            InventoryManager.update(invItem.id, {...invItem, quantity_on_hand: invItem.quantity_on_hand + item.qty});
          }
        });
      }

      cart.forEach(item => {
        const invItem = InventoryManager.getById(item.id);
        if (invItem) {
          InventoryManager.update(invItem.id, {...invItem, quantity_on_hand: invItem.quantity_on_hand - item.qty});
        }
      });

      const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');

      if (isEditing) {
        const index = transactions.findIndex(t => t.id === editingTransaction.id);
        if (index !== -1) {
          const updatedTransaction = {
            ...editingTransaction,
            items: cart,
            subtotal,
            tax,
            total,
              change: Number(change.toFixed(2)), // Ensure proper formatting
            paymentMethods: paymentEntries.map(p => `${p.method}: $${Number(p.amount).toFixed(2)}`),
          };
          transactions[index] = updatedTransaction;
          setCompletedTransaction(updatedTransaction);
        }
      } else {
        let lastId = parseInt(localStorage.getItem('lastTransactionId') || '0');
        const newId = lastId + 1;

        const newTransaction = {
            customerId: selectedCustomer?.id || null,
            id: newId,
            receiptId: `REC-${newId.toString().padStart(4, '0')}`,
            date: new Date().toISOString(),
            items: cart.map(item => ({
              ...item,
              customerId: selectedCustomer?.id || null
            })),
            subtotal,
            tax,
            total,
              change: Number(change.toFixed(2)), // Ensure proper formatting
          paymentMethods: paymentEntries.map(p => `${p.method}: $${Number(p.amount).toFixed(2)}`),
        };

        transactions.push(newTransaction);
        localStorage.setItem('lastTransactionId', newId.toString());
        setCompletedTransaction(newTransaction);
      }

      localStorage.setItem('pos_transactions', JSON.stringify(transactions));
       setCart([]);
       setEditingTransaction(null);
       setSelectedCustomer(null);

    } catch (error) {
      console.error('Checkout failed:', error);
    }
      setShowCheckout(false);

  };

    const handleCheckoutModalConfirm = (paymentEntries, change) => { //Receieve change here
        handleCheckout(paymentEntries, change);
        // setShowCheckout(false);  Removed as we handle this inside of the checkout now
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

  const handleAddRepairToCart = (repair, warrantyMonths) => {
    const newItem = {
      id: repair.repairTicketNumber,
      name: `${repair.deviceType} Repair`,
      imei: repair.imei,
      warranty: `${warrantyMonths} months`,
      price: repair.basePrice,
      qty: 1,
    };
    addToCart(newItem);
    setShowWarrantyModal(false);
  };

  const handleSaveNewRepair = (newRepair) => {
    const newRepairTicket = {
      repairTicketNumber: newRepair.repairTicketNumber,
      deviceType: newRepair.deviceType,
      imei: newRepair.imei,
      basePrice: parseFloat(newRepair.priceEstimate) || 0
    };
    setActiveRepairs((prev) => [...prev, newRepairTicket]);
    setShowCreateTicket(false);
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


  const ActionButton = ({ children, className = "", ...props }) => (
    <button className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${className}`} {...props}>
      {children}
    </button>
  );

    const ServiceCard = ({ icon: Icon, title, price, isAdd, onAddToCart }) => (
        <div
            className={`p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isAdd ? 'bg-teal-600 text-white' : 'bg-white hover:bg-gray-50'
            }`}
            onClick={onAddToCart}
        >
            <Icon className="w-8 h-8 sm:w-12 sm:h-12 mb-2" />
            <span className="text-sm sm:text-base text-center">{title}</span>
            {!isAdd && <span className="text-sm text-gray-600">${price.toFixed(2)}</span>}
        </div>
    );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Modals */}
      {showCheckout && (
        <CheckoutModal
          total={total}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleCheckoutModalConfirm} // Updated prop name
          initialPayments={editingTransaction?.paymentMethods}
        />
      )}

      {completedTransaction && (
        <ReceiptModal
          transaction={completedTransaction}
          onNewTransaction={handleNewTransaction}
            template={receiptTemplate}
        />
      )}

      {showTransactions && (
        <TransactionListModal
          onClose={() => setShowTransactions(false)}
          onEditTransaction={handleEditTransaction}
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
          onClose={() => setShowWarrantyModal(false)}
          onConfirm={(months) => handleAddRepairToCart(selectedRepair, months)}
        />
      )}

      {showCreateTicket && (
        <AddRepairForm
          isOpen={showCreateTicket}
          onClose={() => setShowCreateTicket(false)}
          onSave={handleSaveNewRepair}
        />
      )}

        {/* Conditionally render the InventoryManagerModal */}
      {showInventoryManager && (
          <InventoryManagerModal onClose={() => setShowInventoryManager(false)} />
      )}
       {showItemSelector && (
            <ItemSelectorModal
                onClose={() => setShowItemSelector(false)}
                onSelectItem={handleSelectItem}
            />
        )}

          {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
            onClose={handleCloseSettings}
            onSave={handleSaveTemplate}
            initialTemplate={receiptTemplate}
        />
      )}
      {/* Notes System Modal */}
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

      {/* Top Bar */}
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
           {/* Settings Button */}
          <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-teal-700 rounded-full transition-colors"
            >
                <Settings size={20} className="text-white" />
            </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 grid md:grid-cols-2 gap-3 p-3 h-[calc(100vh-140px)]">
        {/* Left Panel - Cart */}
        <div className="bg-white rounded-lg shadow p-3 flex flex-col">
          <div className="flex items-start justify-between mb-3 gap-4">
            {selectedCustomer ? (
              <div className="flex-1">
                <CustomerProfileCard
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

          <div className="space-y-3 text-sm sm:text-base">
            {/* Cart Items */}
            <div className="mt-3 sm:mt-4 overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="pr-2">QTY</th>
                    <th className="min-w-[150px]">Item Name</th>
                    <th className="pr-2">SKU/IMEI</th>
                    <th className="pr-2">Warranty</th>
                    <th className="pr-2">Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 p-1 border rounded"
                          min="1"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.sku || item.imei || '-'}</td>
                      <td>{item.warranty || (item.type ? 'N/A' : '-')}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.qty).toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="mt-3 sm:mt-4 space-y-2">
              {[
                ['Sub Total', `$${subtotal.toFixed(2)}`],
                ['Tax', `$${tax.toFixed(2)}`],
                ['Total', `$${total.toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span>{label}</span>
                  <span className={label === 'Total' ? 'font-bold' : ''}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col h-full gap-3">
          <div className="flex-1 overflow-auto">
            <DashboardPanel />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mt-3">
               <ServiceCard
                  icon={Package}
                  title="Select Item"
                  isAdd
                  onAddToCart={() => setShowItemSelector(true)}
              />
              <ServiceCard
                icon={Smartphone}
                title="Mobile Repair"
                price={100}
                onAddToCart={() => addToCart({ id: 'mobile-repair', name: 'Mobile Repair', price: 100 })}
              />
              <ServiceCard
                icon={Watch}
                title="Watch Repair"
                price={75}
                onAddToCart={() => addToCart({ id: 'watch-repair', name: 'Watch Repair', price: 75 })}
              />
              <ServiceCard
                icon={Diamond}
                title="Jewelry Repair"
                price={50}
                onAddToCart={() => addToCart({ id: 'jewelry-repair', name: 'Jewelry Repair', price: 50 })}
              />
              <ServiceCard
                icon={Plus}
                title="Drone Repair"
                price={120}
                onAddToCart={() => addToCart({ id: 'drone-repair', name: 'Drone Repair', price: 120 })}
              />
            </div>
          </div>

          {/* Action Buttons at Bottom */}
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
                className="bg-red-100 text-red-600 hover:bg-red-200"
                onClick={handleReset}
              >
                Reset
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSInterface;