import React, { useState, useEffect, useRef } from 'react';
import './POS.css';
import { UserPlus, Clock } from "lucide-react";
import CustomerForm from "../components/CustomerForm";
import axios from "axios";
import PaymentModal from "./PaymentModal";
import ItemSelectionModal from "./ItemSelectionModal";
import ManualItemModal from "./ManualItemModal";
import WarrantyModal from "./WarrantyModal";


const POS = () => {
    const [items, setItem] = useState([
        { id: 1, name: 'Test Item 1', price: 10.00, stock: 20, category: "Products" },
        { id: 2, name: 'Test Item 2', price: 20.00, stock: 10, category: "Services" },
        { id: 3, name: 'Test Item 3', price: 30.00, stock: 5 , category: "Repairs" },
        { id: 4, name: 'Test Item 4', price: 40.00, stock: 15, category: "Products" },
    ]);
    const [transactionItems, setTransactionItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerForm, setShowCustomerForm] = useState(false);
     const [searchTerm, setSearchTerm] = useState("");
      const [showDropdown, setShowDropdown] = useState(false);
      const inputRef = useRef(null);
      const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   const [totalAmount, setTotalAmount] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [showItemSelectionModal, setShowItemSelectionModal] = useState(false);
    const [showManualItemModal, setShowManualItemModal] = useState(false);
     const [activeTab, setActiveTab] = useState("Products");
     const [repairs, setRepairs] = useState([]);
     const [selectedRepair, setSelectedRepair] = useState(null);
     const [showWarrantyModal, setShowWarrantyModal] = useState(null);


    useEffect(() => {
           setLoading(true);
          setError(null);
           // Mock customer data
            const mockCustomers =  [
              {
                 id: 1,
                  companyNumber: "123456",
                 companyName: "Test Company",
                firstName: "John",
               lastName: "Doe",
                 email: "john.doe@example.com",
                 phone: "555-1234",
                 street: "123 Main St",
                postalCode: "12345",
                city: "Anytown",
                country: "USA",
             },
            {
                id: 2,
                 companyNumber: "987654",
                  companyName: "Another Company",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@example.com",
                 phone: "555-5678",
               street: "456 Oak Ave",
                 postalCode: "67890",
                city: "Otherville",
                country: "Canada",
             },
             {
               id: 3,
                 companyNumber: "555555",
                  companyName: "Some Company",
                firstName: "Peter",
               lastName: "Pan",
                email: "peter.pan@example.com",
                phone: "555-4444",
                street: "789 Neverland",
                 postalCode: "33333",
                city: "Neverland",
                country: "Fantasy",
              },
          ];
             const mockRepairs =  [
                {
                    repairTicketNumber: "REP-2024-001",
                    deviceType: "iPhone 13",
                   imei: "123456789012345",
                    issueDescription: "Cracked screen",
                     priceEstimate: 200,
                   dateReceived: "2024-07-03",
                 },
              {
                  repairTicketNumber: "REP-2024-002",
                     deviceType: "Samsung S21",
                    imei: "987654321098765",
                   issueDescription: "Battery replacement",
                   priceEstimate: 50,
                    dateReceived: "2024-07-05",
                 },
             ]
       setTimeout(() => {
            setCustomers(mockCustomers);
              setRepairs(mockRepairs);
              setLoading(false);
       }, 200);
      const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          setShowDropdown(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
       return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

   const handleSelectCustomer = (event) => {
        const selectedCustomerId = event.target.value;
      const selectedCustomer = customers.find(customer => customer.id === parseInt(selectedCustomerId));
        if (selectedCustomer) {
           setSelectedCustomer(selectedCustomer);
           setSearchTerm(`${selectedCustomer.companyName} - ${selectedCustomer.firstName} ${selectedCustomer.lastName}`)
            setShowDropdown(false);
     } else {
         setSelectedCustomer(null);
      }
    };

   const handleOpenCustomerForm = () => {
        setShowCustomerForm(true);
    };

   const handleCloseCustomerForm = () => {
        setShowCustomerForm(false);
   };
    const handleSaveNewCustomer = (customer) => {
        setCustomers(prev => [...prev, customer]);
         setSelectedCustomer(customer);
         setSearchTerm(`${customer.companyName} - {customer.firstName} {customer.lastName}`)
       setShowDropdown(false);
        setShowCustomerForm(false);
    };
     const handleInputChange = (e) => {
       const { name, value } = e.target;
       if(name === 'customerSearch') {
            setSearchTerm(value)
           setShowDropdown(true)
            if(!value) {
              setSelectedCustomer(null);
            }
          }
     };

  const handleAddItem = (item) => {
    setTransactionItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
            if(existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity = (updatedItems[existingItemIndex].quantity || 1) + 1
                  return updatedItems;
            }
           return [...prevItems, {...item, quantity: 1}];
        });
          setTotalAmount(prevTotal => prevTotal + item.price);
    };
     const calculateTotal = () => {
        let subtotal = 0;
        transactionItems.forEach((item) => {
            subtotal += item.price * item.quantity
        });
       return subtotal;
    };
   const handleContinuePayment = () => {
         setShowPaymentModal(true);
   };
 const handleClosePayment = () => {
     setShowPaymentModal(false);
     setPaymentCompleted(true)
 };
  const handleNewTransaction = () => {
     if(paymentCompleted){
         setTransactionItems([]);
         setTotalAmount(0);
         setPaymentCompleted(false);
        setSelectedCustomer(null)
     }
 };
 const handleSaveAsDraft = () => {
     console.log("Saving as draft")
 };
  const handleOpenDraft = () => {
    console.log("Opening Draft");
  };
   const handleOpenItemSelectionModal = () => {
       setShowItemSelectionModal(true);
   };
  const handleCloseItemSelectionModal = () => {
    setShowItemSelectionModal(false);
   };

     const handleOpenManualItemModal = () => {
          setShowManualItemModal(true);
    };
      const handleCloseManualItemModal = () => {
        setShowManualItemModal(false);
    }
  const handleSelectRepair = (repair) => {
         setSelectedRepair(repair);
         setShowWarrantyModal(true);
    };
    const handleAddRepairItem = (warrantyText) => {
      if(selectedRepair){
            const newItem =  {...selectedRepair,
                   name: `${selectedRepair.deviceType} - ${selectedRepair.issueDescription} - ${selectedRepair.imei || "N/A"}`,
                    price: selectedRepair.priceEstimate,
                     description: `Warranty: ${warrantyText}`,
                     id: selectedRepair.repairTicketNumber,
                 };
             handleAddItem(newItem);
             setSelectedRepair(null);
             setShowWarrantyModal(false);
         }
  };
    const handleCloseWarrantyModal = () => {
        setShowWarrantyModal(false)
        setSelectedRepair(null)
    };
     const  filteredCustomers = customers.filter(customer => {
        return (customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    })

     const renderCustomerOptions = () => {
       return filteredCustomers.map(customer =>
           <option value={customer.id} key={customer.id}>{customer.companyName} - {customer.firstName} {customer.lastName}  </option>
        )
     }
    const renderRepairItems = () => {
          return repairs.map((repair) => (
              <li key={repair.repairTicketNumber} className="pos-item">
                 <div className="item-details">
                      <div className="item-name">  {repair.deviceType}</div>
                       <span className="text-gray-500">IMEI: {repair.imei || "N/A"}</span>
                     <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Ticket #: {repair.repairTicketNumber}</p>
                    </div>
                    <div className="item-price flex items-center gap-2">
                         <button onClick={()=> handleSelectRepair(repair)} className="bg-gray-100 rounded border border-gray-300 px-2 py-1 text-sm">
                            +
                      </button>
                   </div>
              </li>
          ));
      };

    return (
        <div className="pos-container">
            <div className="pos-header">
                 <div className="pos-tabs">
                   <button
                        onClick={() => handleTabClick("Products")}
                       className={`pos-tab ${activeTab === "Products" ? "active" : ""}`}
                       >Products
                    </button>
                     <button
                       onClick={() => handleTabClick("Repairs")}
                       className={`pos-tab ${activeTab === "Repairs" ? "active" : ""}`}
                       >Repairs
                   </button>
                    <button
                       onClick={() => handleTabClick("Orders")}
                       className={`pos-tab ${activeTab === "Orders" ? "active" : ""}`}
                     >Orders
                   </button>
                     <button
                      onClick={() => handleTabClick("Unlock")}
                        className={`pos-tab ${activeTab === "Unlock" ? "active" : ""}`}
                     >Unlock
                    </button>
                     <button
                        onClick={() => handleTabClick("Devices")}
                         className={`pos-tab ${activeTab === "Devices" ? "active" : ""}`}
                      >Devices
                     </button>
                       <button
                         onClick={() => handleTabClick("Prepaid")}
                         className={`pos-tab ${activeTab === "Prepaid" ? "active" : ""}`}
                      >Prepaid
                    </button>
                      <button
                        onClick={() => handleTabClick("Queued")}
                        className={`pos-tab ${activeTab === "Queued" ? "active" : ""}`}
                         >Queued
                     </button>
                </div>
                <div className="pos-search">
                    <input type="text" placeholder="Search items" className="search-bar"/>
                      <button className="filter-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><path d="M22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></path></svg>
                         </button>
                </div>
            </div>
            <div className="pos-content">
                <div className="pos-items-panel">

                    <ul className="space-y-2">
                       { activeTab === "Repairs" ? (
                           renderRepairItems()
                         ) :(
                             <>
                                  <h2 className="text-xl font-semibold mb-4">Categories</h2>
                                    {items.map((item) => (
                                        <li key={item.id} className="pos-item" onClick={()=> handleAddItem(item)}>
                                           <div className="item-details">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-stock">Item stock: {item.stock} </div>
                                         </div>
                                         <div className="item-price">€{item.price}</div>
                                     </li>
                                 ))}
                             </>
                         )}
                   </ul>
                </div>

                <div className="pos-transaction-panel">
                    <div className="transaction-actions flex-wrap gap-3">
                         <button onClick={handleOpenItemSelectionModal} className="pos-action-button">Select Item</button>
                         <button onClick={handleOpenManualItemModal} className="pos-action-button">Manual Item Entry</button>
                            <div className="flex items-center w-full relative" ref={inputRef}>
                                     <label className="block font-medium mr-1">Select Customer:</label>
                                       <div className="relative w-full">
                                       <input
                                           type="text"
                                            placeholder="Search by name"
                                             value={searchTerm}
                                            onChange={handleInputChange}
                                           name="customerSearch"
                                           onFocus={() => setShowDropdown(true)}
                                             className={`border rounded p-2 w-full max-w-[250px]`}
                                      />
                                        {showDropdown &&  (
                                            <select
                                              size={5}
                                               onClick={handleSelectCustomer}
                                              className={`border rounded p-2 w-full absolute mt-2 bg-white customer-dropdown`}
                                               style={{ top: '100%'}}
                                          >
                                              <option value="">Select Customer</option>
                                               {renderCustomerOptions()}
                                           </select>
                                         )}
                                 </div>
                                <button
                                    type="button"
                                      onClick={handleOpenCustomerForm}
                                   className="pos-action-button"
                                     aria-label="Add Customer"
                                 >
                                      <UserPlus size={16} />
                               </button>
                            </div>
                                {selectedCustomer && (
                                    <p className="mt-2 ml-2">
                                       Selected Customer: {selectedCustomer.companyName} - {selectedCustomer.firstName} {selectedCustomer.lastName}
                                  </p>
                                 )}
                    </div>
                   <div className="transaction-items">
                        <h3 className="text-xl font-semibold mb-4">
                                 Items in transaction:
                        </h3>
                       {transactionItems.length === 0 ? (
                           <p>No items added.</p>
                         ): (
                                   <ul className="space-y-2">
                                        {transactionItems.map((item) => (
                                          <li key={item.id} className="pos-item">
                                                <div className="item-details">
                                                 <div className="item-name"> {item.name}</div>
                                                 {item.description && <span>{item.description}</span> }
                                                    <span>Qty: {item.quantity}</span>
                                              </div>
                                              <div className="item-price">€{(item.price * item.quantity).toFixed(2)}</div>
                                            </li>
                                        ))}
                                    </ul>
                         )}

                    </div>
                   <div className="transaction-summary">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                           <span>€{calculateTotal().toFixed(2)}</span>
                        </div>
                      <div className="summary-row">
                            <span>Tax:</span>
                            <span>€0.00</span>
                       </div>
                      <div className="summary-row">
                           <span className="font-semibold">Amount Due:</span>
                            <span className="font-semibold">€{calculateTotal().toFixed(2)}</span>
                        </div>
                     </div>
                    <div className="pos-payment-button flex justify-between">
                       <button className="pos-payment-button" onClick={handleContinuePayment} disabled={transactionItems.length === 0}>Pay...</button>
                      <button onClick={handleNewTransaction} disabled={!paymentCompleted} className="pos-payment-button">New Transaction</button>
                       <button onClick={handleOpenDraft} className="pos-payment-button">Open Draft</button>
                     <button onClick={handleSaveAsDraft}  disabled={transactionItems.length === 0} className="pos-payment-button">Save As Draft</button>
                   </div>
                </div>
                  {showCustomerForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                       <div className="bg-white p-6 rounded-lg w-[calc(100%-64px)] max-h-[90vh] overflow-y-auto">
                           <CustomerForm
                                  onSave={handleSaveNewCustomer}
                                   onCancel={handleCloseCustomerForm}
                              />
                            <button onClick={handleCloseCustomerForm} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
                        </div>
                    </div>
                 )}
                  {showPaymentModal && (
                    <PaymentModal
                       isOpen={showPaymentModal}
                       onClose={handleClosePayment}
                         totalAmount={calculateTotal()}
                     />
                  )}
                   {showItemSelectionModal && (
                      <ItemSelectionModal
                        isOpen={showItemSelectionModal}
                         onClose={handleCloseItemSelectionModal}
                         onItemSelect={handleAddItem}
                        items={items}
                      />
                    )}
                    {showManualItemModal && (
                           <ManualItemModal
                               isOpen={showManualItemModal}
                               onClose={handleCloseManualItemModal}
                                 onItemAdd={handleAddItem}
                                  categories={categories}
                             />
                       )}
                     {showWarrantyModal && (
                         <WarrantyModal
                            isOpen={showWarrantyModal}
                            onClose={handleCloseWarrantyModal}
                            onItemAdd={handleAddRepairItem}
                          />
                     )}
            </div>
        </div>
    );
};

export default POS;