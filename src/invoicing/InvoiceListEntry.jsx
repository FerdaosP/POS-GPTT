// src/invoicing/InvoiceListEntry.jsx
import React, { useState, useEffect } from "react";
import { AlertCircle, Download, FileText, File } from "lucide-react";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

import Alert, { AlertDescription } from "../reparatiekaart/Alert";
import Loading from "../reparatiekaart/Loading"; // Corrected import for Loading component
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import InvoiceModal from "./InvoiceModal";
import DeleteConfirmationModal from "../reparatiekaart/DeleteConfirmationModal"; //Reusing the DeleteConfirmationModal
import InvoiceHistoryModal from "./InvoiceHistoryModal";

const InvoiceListEntry = ({companyInfo}) => {
    const [invoices, setInvoices] = useState([]);
    const [showAddInvoiceForm, setShowAddInvoiceForm] = useState(false);
    const [isLoadingAddInvoice, setIsLoadingAddInvoice] = useState(false);
    const [isLoadingStatusUpdate, setIsLoadingStatusUpdate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState("dateOfIssue");
    const [sortDirection, setSortDirection] = useState("desc");
    const [invoiceHistory, setInvoiceHistory] = useState({});
    const [currentUser, setCurrentUser] = useState("Admin");
    const [editInvoice, setEditInvoice] = useState(null);
    const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [printPreviewInvoice, setPrintPreviewInvoice] = useState(null);
    const [selectedInvoices, setSelectedInvoices] = useState([]); // Added selectedInvoices state

    const apiUrl = 'http://localhost:8000/api/invoices/';

    const invoiceStatusOptions = [
        "Draft",
        "Sent",
        "Paid",
         "Overdue",
        "Cancelled"
    ];

    useEffect(() => {
        fetchInvoices();
    }, []);

     const fetchInvoices = async () => {
          setInvoices([
            {
             invoiceNumber: 1,
                dateOfIssue: "2024-08-08",
                billTo: "Test Customer 1",
              billToEmail: "test1@test.com",
              billToAddress: "123 Test Street, Testville, Testland",
               billFrom: "Test Company",
               billFromEmail: "test@test.com",
              billFromAddress: "456 Test Street, Testtown, Testland",
               notes: "Thanks for your business!",
               total: "15.30",
               subTotal: "15.00",
              taxRate: "2.00",
               taxAmmount: "0.30",
              discountRate: "0.00",
                discountAmmount: "0.00",
              status: "Paid" ,
             items: [
                    {
                        id: 0,
                        name: "Test Item",
                      description: "Test Item Description",
                      price: "15.00",
                        quantity: 1
                     }
                   ]
             },
        {
            invoiceNumber: 2,
             dateOfIssue: "2024-09-08",
              billTo: "Test Customer 2",
             billToEmail: "test2@test.com",
             billToAddress: "789 Fake Street, Fakesville, Fakeland",
             billFrom: "Test Company",
              billFromEmail: "test@test.com",
              billFromAddress: "456 Test Street, Testtown, Testland",
             notes: "Thanks for your business!",
             total: "32.20",
               subTotal: "32.00",
               taxRate: "0.00",
             taxAmmount: "0.00",
              discountRate: "0.00",
              discountAmmount: "0.00",
             status: "Sent" ,
              items: [
                    {
                       id: 0,
                      name: "Test Item 2",
                        description: "Test Item Description 2",
                       price: "32.00",
                       quantity: 1
                     }
                   ]
             },
          ]);
    };

     const handleStatusUpdate = async (id, newStatus) => {
        setIsLoadingStatusUpdate(true);
         setInvoices(prev => {
             return prev.map(invoice => {
                 if(invoice.invoiceNumber === id){
                    addToHistory(id, "status_update", `Status updated to ${newStatus}`);
                    return {...invoice, status: newStatus};
                  }
               return invoice
             })
         })
           showNotification("Status updated successfully!");
           setIsLoadingStatusUpdate(false);
    };

    const addToHistory = (invoiceId, action, details) => {
        const timestamp = new Date().toISOString();
        setInvoiceHistory((prev) => ({
            ...prev,
            [invoiceId]: [
                ...(prev[invoiceId] || []),
                { timestamp, action, details, user: currentUser },
            ],
        }));
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

   const handleAddInvoice = async (newInvoiceData) => {
        setIsLoadingAddInvoice(true);
            setInvoices(prev => ([...prev, newInvoiceData]));
            addToHistory(newInvoiceData.invoiceNumber, "created", "Invoice created");
            showNotification("Invoice added successfully!");
            setShowAddInvoiceForm(false);
            setIsLoadingAddInvoice(false);
      };


    const handleEdit = (invoice) => {
        setEditInvoice({ ...invoice });
    };

    const handleUpdateInvoice = async (updatedInvoice) => {
        setIsLoadingUpdate(true);
            setInvoices(prev => {
                return prev.map(invoice => {
                    if(invoice.invoiceNumber === updatedInvoice.invoiceNumber){
                       addToHistory(updatedInvoice.invoiceNumber, "updated", "Invoice updated");
                         return updatedInvoice
                    }
                     return invoice;
                })
           })
            showNotification("Invoice updated successfully!");
            setEditInvoice(null);
            setIsLoadingUpdate(false);
    };


    const confirmDeleteInvoice = (invoiceId) => {
        setDeleteInvoiceId(invoiceId);
    };

    const handleDeleteInvoice = async (invoiceId) => {
        setIsLoadingDelete(true);
           setInvoices(prev => prev.filter(invoice => invoice.invoiceNumber !== invoiceId))
             addToHistory(invoiceId, "deleted", "Invoice deleted");
             showNotification("Invoice deleted successfully!");
              setDeleteInvoiceId(null);
        setIsLoadingDelete(false);
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
                const invoicesToExport = invoices.filter(invoice => selectedInvoices.includes(invoice.invoiceNumber));

            if(invoicesToExport.length === 0){
                 showNotification("No invoices selected for export!", "error");
                 return;
                }
                switch (format) {
                   case 'csv':
                        exportToCSV(invoicesToExport);
                      break;
                  case 'pdf':
                        exportToPDF(invoicesToExport);
                         break;
                }
            showNotification(`Export to ${format.toUpperCase()} completed!`);

        } catch (error) {
            showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
        } finally {
             setIsLoadingExport(false);
         }
    };

    const exportToCSV = (invoicesToExport) => {
        const csvContent = [
            [
                "Invoice Number",
                "Bill To",
                "Date Of Issue",
                "Total",
                "Status",
                "Notes"
            ].join(","),
            ...invoicesToExport.map((invoice) =>
                [
                   invoice.invoiceNumber,
                    invoice.billTo,
                   invoice.dateOfIssue,
                   invoice.total,
                    invoice.status,
                    invoice.notes,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "invoices.csv";
        link.click();
        showNotification('CSV export completed')
    };


   const exportToPDF = (invoicesToExport) => {
        const doc = new jsPDF();
        const tableColumn = [
            "Invoice Number",
            "Bill To",
            "Date Of Issue",
             "Total",
              "Status",
             "Notes"
        ];

       const tableRows = invoicesToExport.map(invoice => [
           invoice.invoiceNumber,
           invoice.billTo,
            invoice.dateOfIssue,
           invoice.total,
           invoice.status,
          invoice.notes,
       ]);

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 20,
        });

        doc.save('invoices.pdf');
        showNotification('PDF export completed')
    };



    const handleViewHistory = (invoiceId) => {
        setSelectedInvoice(invoiceId);
    };

     const handlePrintPreview = (invoice) => {
        setPrintPreviewInvoice(invoice);
    };


   const handleSelectInvoice = (invoiceId, isSelected) => {
      if (isSelected) {
        setSelectedInvoices(prev => [...prev, invoiceId]);
      } else {
         setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
      }
  };

     const handleOpenInvoiceForm = () => {
        setShowAddInvoiceForm(true);
   };

   const handleCloseInvoiceForm = () => {
        setShowAddInvoiceForm(false);
    };
    const filteredInvoices = invoices.filter((invoice) => {
        return (
            (invoice.billTo
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                invoice.invoiceNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            ) &&
            (filterStatus === "" || invoice.status === filterStatus)
        );
    });

    const sortedInvoices = [...filteredInvoices].sort((a, b) => {
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

    const paginatedInvoices = sortedInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 relative">
            {(isLoadingAddInvoice || isLoadingStatusUpdate || isLoadingDelete || isLoadingUpdate || isLoadingExport) && (
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

            <h1 className="text-2xl font-bold mb-4">Invoices</h1>

            {/* Search and Filter */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by Customer or Invoice Number"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border p-2 mr-2 rounded w-full"
                    aria-label="Search invoices"
                />
                <select
                    value={filterStatus}
                    onChange={handleFilterStatus}
                    className="border p-2 rounded"
                    aria-label="Filter by Status"
                >
                    <option value="">All Statuses</option>
                    {invoiceStatusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination Info */}
            <div className="mb-4">
                <span className="text-sm text-gray-600">
                    Showing page {currentPage} of {Math.ceil(sortedInvoices.length / itemsPerPage)}
                    ({sortedInvoices.length} total records)
                 </span>
            </div>

            {/* Invoice List */}
            <InvoiceList
                invoices={paginatedInvoices}
                onPageChange={setCurrentPage}
                 onStatusUpdate={handleStatusUpdate}
                onDelete={confirmDeleteInvoice}
                onEdit={handleEdit}
                onViewHistory={handleViewHistory}
                 onSort={handleSort}
                 invoiceStatusOptions={invoiceStatusOptions}
                 onPrint={handlePrintPreview}
                 selectedInvoices={selectedInvoices} // Pass selected invoices to InvoiceList
                 onSelectInvoice={handleSelectInvoice}
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
                                    Math.ceil(sortedInvoices.length / itemsPerPage)
                                )
                            )
                        }
                        disabled={currentPage >= Math.ceil(sortedInvoices.length / itemsPerPage)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        aria-label="Next Page"
                    >
                        Next
                    </button>
                </div>
            </div>


            {/* Add Invoice Button */}
            <button
                onClick={handleOpenInvoiceForm}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                aria-label="Add New Invoice"
            >
                Add Invoice
            </button>


            {/* Modals */}
               {showAddInvoiceForm && (
                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg  w-[calc(100%-64px)] max-h-[90vh] overflow-y-auto">
                           <h2 className="text-xl font-semibold mb-4">New Invoice</h2>
                             <InvoiceForm
                                  onSaveInvoice={handleAddInvoice}
                                  onClose={handleCloseInvoiceForm}
                                  companyInfo={companyInfo}
                              />
                            <button onClick={handleCloseInvoiceForm} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
                        </div>
                    </div>
                 )}
            {editInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[calc(100%-64px)] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Edit Invoice</h2>
                         <InvoiceForm
                            onSaveInvoice={handleUpdateInvoice}
                             onClose={() => setEditInvoice(null)}
                              companyInfo={companyInfo}
                             initialInvoice={editInvoice}
                           />
                         <button onClick={() => setEditInvoice(null)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
                   </div>
                 </div>
                 )}
           
            <DeleteConfirmationModal
                isOpen={!!deleteInvoiceId}
                onClose={() => setDeleteInvoiceId(null)}
                onConfirm={() => handleDeleteInvoice(deleteInvoiceId)}
                repairId={deleteInvoiceId}
            />
             <InvoiceModal
                  showModal={!!printPreviewInvoice}
                  closeModal={() => setPrintPreviewInvoice(null)}
                  info={printPreviewInvoice}
                  companyInfo={companyInfo}
               />
             <InvoiceHistoryModal
                    isOpen={!!selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                   history={invoiceHistory[selectedInvoice] || []}
                    invoiceId={selectedInvoice}
                />
        </div>
    );
};
export default InvoiceListEntry;