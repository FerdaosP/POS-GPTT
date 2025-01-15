// File: /src/purchaseOrder/PurchaseOrderEntry.jsx

import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, Download, FileText, File, Trash2 } from "lucide-react";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

import Alert, { AlertDescription } from "../reparatiekaart/Alert"; // Reusing alert component
import Loading from "../reparatiekaart/Loading"; // Reusing loading component

import PurchaseOrderList from "./PurchaseOrderList";
import AddPurchaseOrderForm from "./AddPurchaseOrderForm";
import EditPurchaseOrderModal from "./EditPurchaseOrderModal";
import DeletePurchaseOrderModal from "./DeletePurchaseOrderModal";
import ViewSuppliersModal from "./ViewSuppliersModal"; // Import ViewSuppliersModal
import ViewPurchaseOrderModal from "./ViewPurchaseOrderModal";


const PurchaseOrderEntry = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
     const [showAddSupplierModal, setShowAddSupplierModal] = useState(false); // Add state for AddSupplierModal
     const [showViewSupplierModal, setShowViewSupplierModal] = useState(false); // Add state for ViewSuppliersModal
     const [showViewPurchaseOrderModal, setShowViewPurchaseOrderModal] = useState(false);
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
    const [showAddPurchaseOrderForm, setShowAddPurchaseOrderForm] = useState(false);
    const [isLoadingAddPurchaseOrder, setIsLoadingAddPurchaseOrder] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
      const [isLoadingBulkDelete, setIsLoadingBulkDelete] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
     const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState("poDate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [editPurchaseOrder, setEditPurchaseOrder] = useState(null);
    const [deletePurchaseOrderId, setDeletePurchaseOrderId] = useState(null);
    const [selectedPurchaseOrders, setSelectedPurchaseOrders] = useState([]); // Added selectedRepairs state

       const purchaseOrderStatusOptions = [
        "Draft",
        "Sent",
        "Received",
           "Cancelled"
    ];
    const apiUrl = 'http://localhost:8000/api/purchase-orders/'; // Placeholder API URL
    const supplierApiUrl = 'http://localhost:8000/api/suppliers/';
    const [suppliers, setSuppliers] = useState([]);
    const [isLoadingStatusUpdate, setIsLoadingStatusUpdate] = useState(false);

    useEffect(() => {
        fetchPurchaseOrders();
         fetchSuppliers();
    }, []);


    const fetchPurchaseOrders = async () => {
         setPurchaseOrders([
                {
                  poNumber: "PO-2024-001",
                  supplierName: "Supplier A",
                  poDate: "2024-07-01",
                   totalAmount: 1200,
                 status: "Draft"
               },
               {
                    poNumber: "PO-2024-002",
                    supplierName: "Supplier B",
                     poDate: "2024-07-03",
                   totalAmount: 2000,
                  status: "Sent"
                 },
                   {
                      poNumber: "PO-2024-003",
                      supplierName: "Supplier A",
                    poDate: "2024-07-08",
                     totalAmount: 2500,
                     status: "Received"
                 },
            ]);
    };
      const fetchSuppliers = useCallback(async () => {
            setSuppliers([
                {
                   id: 1,
                    name: "Supplier A",
                     address: "123 Main St",
                    contactPerson: "John Doe",
                    phone: "555-1234",
                    email: "john.doe@example.com",
                  vatNumber: "123456789",
                },
                {
                    id: 2,
                    name: "Supplier B",
                      address: "456 Oak Ave",
                    contactPerson: "Jane Smith",
                      phone: "555-5678",
                     email: "jane.smith@example.com",
                      vatNumber: "987654321",
                 },
            ])
        }, []);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

       const handleAddPurchaseOrder = async (newPurchaseOrderData) => {
           setIsLoadingAddPurchaseOrder(true);
             setPurchaseOrders(prev => ([...prev, newPurchaseOrderData]));
              showNotification("Purchase order added successfully!");
               setShowAddPurchaseOrderForm(false);
             setIsLoadingAddPurchaseOrder(false);
       };
       
    const handleAddSupplier = async (newSupplier) => {
              setSuppliers(prev => ([...prev, newSupplier]));
                showNotification("Supplier added successfully!");
                 setShowAddSupplierModal(false);
      };

      const handleEditSupplier = async (updatedSupplier) => {
          setSuppliers(prev => prev.map(supplier => supplier.id === updatedSupplier.id ? updatedSupplier : supplier));
            showNotification("Supplier updated successfully!");
      };

    const handleDeleteSupplier = async (supplierId) => {
           setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId))
            showNotification("Supplier deleted successfully!");
    };
    
    const handleEdit = (purchaseOrder) => {
        setEditPurchaseOrder({ ...purchaseOrder });
    };

    const handleUpdatePurchaseOrder = async (updatedPurchaseOrder) => {
           setIsLoadingUpdate(true);
            setPurchaseOrders(prev => {
              return prev.map(purchaseOrder => {
                 if(purchaseOrder.poNumber === updatedPurchaseOrder.poNumber) {
                        return updatedPurchaseOrder
                     }
                   return purchaseOrder;
              })
          })
               showNotification("Purchase order updated successfully!");
             setEditPurchaseOrder(null);
             setIsLoadingUpdate(false);
    };

    const confirmDeletePurchaseOrder = (purchaseOrderId) => {
        setDeletePurchaseOrderId(purchaseOrderId);
    };

      const handleBulkDelete = async () => {
        setIsLoadingBulkDelete(true);
          setPurchaseOrders(prev => prev.filter(po => !selectedPurchaseOrders.includes(po.poNumber)));
              setSelectedPurchaseOrders([]);
              showNotification("Purchase orders deleted successfully!");
             setIsLoadingBulkDelete(false);
    };

    const handleDeletePurchaseOrder = async (purchaseOrderId) => {
       setIsLoadingDelete(true);
          setPurchaseOrders(prev => prev.filter(po => po.poNumber !== purchaseOrderId));
          showNotification("Purchase order deleted successfully!");
            setDeletePurchaseOrderId(null);
           setIsLoadingDelete(false);
    };
    
    const handleStatusUpdate = async (purchaseOrderId, newStatus) => {
       setIsLoadingStatusUpdate(true);
           setPurchaseOrders(prev => {
                return prev.map(po => {
                   if(po.poNumber === purchaseOrderId){
                        return {...po, status: newStatus}
                    }
                      return po
              })
            })
            showNotification("Status updated successfully!");
            setIsLoadingStatusUpdate(false);
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterStatus = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleExport = async (format) => {
        setIsLoadingExport(true);
        try {
             await new Promise((resolve) => setTimeout(resolve, 1000));
              const purchaseOrdersToExport = purchaseOrders.filter(po => selectedPurchaseOrders.includes(po.poNumber));
            if(purchaseOrdersToExport.length === 0){
                  showNotification("No purchase orders selected for export!", "error");
                return;
                }
                switch (format) {
                    case 'csv':
                        exportToCSV(purchaseOrdersToExport);
                     break;
                   case 'pdf':
                        exportToPDF(purchaseOrdersToExport);
                    break;
                }
             showNotification(`Export to ${format.toUpperCase()} completed!`);

        } catch (error) {
             showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
        } finally {
            setIsLoadingExport(false);
        }
    };

   const exportToCSV = (purchaseOrdersToExport) => {
        const csvContent = [
            [
                "PO Number",
                "Supplier Name",
                "PO Date",
                "Total Amount",
                "Status"
            ].join(","),
            ...purchaseOrdersToExport.map((po) =>
                [
                    po.poNumber,
                    po.supplierName,
                    po.poDate,
                     po.totalAmount,
                    po.status,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "purchase_orders.csv";
        link.click();
        showNotification('CSV export completed')
    };


   const exportToPDF = (purchaseOrdersToExport) => {
        const doc = new jsPDF();
        const tableColumn = [
           "PO Number",
            "Supplier Name",
            "PO Date",
            "Total Amount",
            "Status"
        ];

        const tableRows = purchaseOrdersToExport.map(po => [
             po.poNumber,
              po.supplierName,
               po.poDate,
               po.totalAmount,
              po.status,
        ]);

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 20,
        });

        doc.save('purchase_orders.pdf');
        showNotification('PDF export completed')
    };
   const handleSelectPurchaseOrder = (purchaseOrderId, isSelected) => {
      if (isSelected) {
        setSelectedPurchaseOrders(prev => [...prev, purchaseOrderId]);
      } else {
         setSelectedPurchaseOrders(prev => prev.filter(id => id !== purchaseOrderId));
      }
  };
    const handleOpenSupplierList = () => {
         setShowViewSupplierModal(true);
         setShowAddSupplierModal(false);
     };
    const handleCancelSupplierList = () => {
        setShowViewSupplierModal(false);
          setShowAddSupplierModal(false);
    };

     const handleToggleAddSupplierForm = () => {
       setShowAddSupplierModal((prev) => !prev);
    };
    const handleViewPurchaseOrder = (purchaseOrder) => {
         setSelectedPurchaseOrder(purchaseOrder);
       setShowViewPurchaseOrderModal(true);
   };
      const handleCloseViewPurchaseOrderModal = () => {
        setSelectedPurchaseOrder(null);
        setShowViewPurchaseOrderModal(false);
    };


    const filteredPurchaseOrders = purchaseOrders.filter((po) => {
        return (
            (po.poNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                po.supplierName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            ) &&
             (filterStatus === "" || po.status === filterStatus)
        );
    });


    const sortedPurchaseOrders = [...filteredPurchaseOrders].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
          if (aValue < bValue) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });

    const paginatedPurchaseOrders = sortedPurchaseOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

      const filteredPaginatedPurchaseOrders = paginatedPurchaseOrders;


    return (
        <div className="p-4 relative">
            {(isLoadingAddPurchaseOrder || isLoadingDelete || isLoadingUpdate || isLoadingExport || isLoadingBulkDelete || isLoadingStatusUpdate) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
                        <Loading className="animate-spin" isLoading={true} />
                        <span>Processing...</span>
                    </div>
                </div>
            )}
            {notification && (
                <Alert className={`mb-4 ${notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
                    <AlertCircle className={notification.type === 'error' ? 'text-red-500' : 'text-green-500'} />
                    <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
            )}
            <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>
             {/* Search and Filter */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by PO Number or Supplier Name"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border p-2 mr-2 rounded w-full"
                      aria-label="Search purchase orders"
                />
                 <select
                        value={filterStatus}
                        onChange={handleFilterStatus}
                        className="border p-2 rounded"
                         aria-label="Filter by Status"
                    >
                        <option value="">All Statuses</option>
                        {purchaseOrderStatusOptions.map((status) => (
                           <option key={status} value={status}>
                              {status}
                            </option>
                        ))}
                    </select>
            </div>
            {/* Pagination Info */}
            <div className="mb-4">
                <span className="text-sm text-gray-600">
                    Showing page {currentPage} of {Math.ceil(sortedPurchaseOrders.length / itemsPerPage)}
                    ({sortedPurchaseOrders.length} total records)
                </span>
            </div>
              {/* Purchase Order List */}
                <PurchaseOrderList
                    purchaseOrders={filteredPaginatedPurchaseOrders}
                    onPageChange={setCurrentPage}
                   onDelete={confirmDeletePurchaseOrder}
                   onEdit={handleEdit}
                    onView={handleViewPurchaseOrder}
                    onStatusUpdate={handleStatusUpdate}
                   onSort={handleSort}
                   purchaseOrderStatusOptions={purchaseOrderStatusOptions}
                   selectedPurchaseOrders={selectedPurchaseOrders}
                     onSelectPurchaseOrder={handleSelectPurchaseOrder}
                />

            {/* Export Buttons */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleExport("csv")}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                        aria-label="Export to CSV"
                    >
                        <Download size={16} />
                        <span>CSV</span>
                    </button>
                     <button
                        onClick={() => handleExport("pdf")}
                        className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                        aria-label="Export to PDF"
                    >
                        <File size={16} />
                        <span>PDF</span>
                    </button>
                     <button
                        onClick={handleBulkDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                        aria-label="Delete Selected"
                    >
                         <Trash2 size={16} />
                         <span>Delete Selected</span>
                     </button>
                </div>
                {/* Pagination Controls */}
                 <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                         aria-label="Previous Page"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(
                                    prev + 1,
                                    Math.ceil(filteredPurchaseOrders.length / itemsPerPage)
                                )
                            )
                        }
                        disabled={currentPage >= Math.ceil(filteredPurchaseOrders.length / itemsPerPage)}
                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                         aria-label="Next Page"
                    >
                        Next
                    </button>
                </div>
            </div>
                {/* Add Purchase Order Button */}
              <div className="flex items-center mb-4 space-x-2">
                 <button
                    onClick={() => setShowAddPurchaseOrderForm(true)}
                     className="bg-green-500 text-white px-4 py-2 rounded"
                   aria-label="Add New Purchase Order"
                 >
                    Add Purchase Order
                 </button>
                     <button
                    onClick={() => handleOpenSupplierList()}
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                    aria-label="View Suppliers"
                     >
                        View Suppliers
                    </button>
              </div>

            {/* Modals */}
              <AddPurchaseOrderForm
                isOpen={showAddPurchaseOrderForm}
                onClose={() => setShowAddPurchaseOrderForm(false)}
                onSave={handleAddPurchaseOrder}
             />
             <EditPurchaseOrderModal
                purchaseOrder={editPurchaseOrder}
                isOpen={!!editPurchaseOrder}
                onClose={() => setEditPurchaseOrder(null)}
                onSave={handleUpdatePurchaseOrder}
             />
            <DeletePurchaseOrderModal
                isOpen={!!deletePurchaseOrderId}
                onClose={() => setDeletePurchaseOrderId(null)}
                onConfirm={() => handleDeletePurchaseOrder(deletePurchaseOrderId)}
                purchaseOrderId={deletePurchaseOrderId}
            />
               <ViewSuppliersModal
                isOpen={showViewSupplierModal}
                onClose={handleCancelSupplierList}
                showAddSupplierForm={showAddSupplierModal}
                onToggleAddSupplierForm={handleToggleAddSupplierForm}
                  onSaveSupplier={handleAddSupplier}
                    onEditSupplier={handleEditSupplier}
                onDeleteSupplier={handleDeleteSupplier}
             />
                <ViewPurchaseOrderModal
                 isOpen={!!selectedPurchaseOrder}
                  onClose={handleCloseViewPurchaseOrderModal}
                  purchaseOrder={selectedPurchaseOrder}
                  />
        </div>
    );
};

export default PurchaseOrderEntry;