import React, { useState, useEffect } from "react";
import { AlertCircle, Download, FileText, File } from "lucide-react";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

import Alert, { AlertDescription } from "@/reparatiekaart/alert";
import RepairList from "./RepairList";
import AddRepairForm from "./AddRepairForm";
import EditRepairModal from "./EditRepairModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ViewAttachmentsModal from "./ViewAttachmentsModal";
import RepairHistoryModal from "./RepairHistoryModal";
import { generateRepairID } from "./utils";
import RepairTicketPrint from "./RepairTicketPrint";
import Loading from "./Loading"; // Corrected import for Loading component

const NewRepairEntry = () => {
    const [repairs, setRepairs] = useState([]);
    const [showAddRepairForm, setShowAddRepairForm] = useState(false);
    const [isLoadingAddRepair, setIsLoadingAddRepair] = useState(false);
    const [isLoadingStatusUpdate, setIsLoadingStatusUpdate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState("dateReceived");
    const [sortDirection, setSortDirection] = useState("desc");
    const [repairHistory, setRepairHistory] = useState({});
    const [currentUser, setCurrentUser] = useState("Admin");
    const [editRepair, setEditRepair] = useState(null);
    const [deleteRepairId, setDeleteRepairId] = useState(null);
    const [selectedRepair, setSelectedRepair] = useState(null);
      const [selectedAttachmentRepair, setSelectedAttachmentRepair] = useState(null);
    const [printPreviewRepair, setPrintPreviewRepair] = useState(null);
    const [selectedPatternRepair, setSelectedPatternRepair] = useState(null);
    const [selectedRepairs, setSelectedRepairs] = useState([]); // Added selectedRepairs state

   const apiUrl = 'http://localhost:8000/api/repairs/';

    const repairStatusOptions = [
        "Received",
        "In Progress",
        "Awaiting Parts",
        "Quoted",
        "On Hold",
        "Completed",
        "Delivered",
    ];

    useEffect(() => {
        fetchRepairs();
    }, []);

     const fetchRepairs = async () => {
        try {
            const response = await axios.get(apiUrl);
            setRepairs(JSON.parse(JSON.stringify(response.data)));
        } catch (error) {
            console.error("Error fetching repairs:", error);
            showNotification("Error fetching repairs! Check the console.", "error");
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setIsLoadingStatusUpdate(true);
        try {
            await axios.patch(`${apiUrl}${id}/`, { repairStatus: newStatus });
             fetchRepairs();
            addToHistory(id, "status_update", `Status updated to ${newStatus}`);
            if (newStatus === "Completed") {
                console.log(`Email sent to customer for ticket ${id}`);
            }
            showNotification("Status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
            showNotification("Error updating status!", "error");
        } finally {
            setIsLoadingStatusUpdate(false);
        }
    };

    const addToHistory = (repairId, action, details) => {
        const timestamp = new Date().toISOString();
        setRepairHistory((prev) => ({
            ...prev,
            [repairId]: [
                ...(prev[repairId] || []),
                { timestamp, action, details, user: currentUser },
            ],
        }));
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

   const handleAddRepair = async (newRepairData) => {
        setIsLoadingAddRepair(true);
          try {
            await axios.post(apiUrl, newRepairData);
            fetchRepairs();
            addToHistory(newRepairData.repairTicketNumber, "created", "Repair ticket created");
            showNotification("Repair added successfully!");
            setShowAddRepairForm(false);
         } catch (error) {
             console.error("Error adding repair:", error);
             showNotification("Error adding repair!", "error");
         } finally {
             setIsLoadingAddRepair(false);
          }
      };


    const handleEdit = (repair) => {
        setEditRepair({ ...repair });
    };

    const handleUpdateRepair = async (updatedRepair) => {
        setIsLoadingUpdate(true);
        try {
            await axios.put(`${apiUrl}${updatedRepair.repairTicketNumber}/`, updatedRepair);
           fetchRepairs();
            addToHistory(
                updatedRepair.repairTicketNumber,
                "updated",
                "Repair ticket updated"
            );
            showNotification("Repair updated successfully!");
            setEditRepair(null);
        } catch (error) {
              console.error("Error updating repair:", error);
            showNotification("Error updating repair!", "error");
        } finally {
            setIsLoadingUpdate(false);
        }
    };


    const confirmDeleteRepair = (repairId) => {
        setDeleteRepairId(repairId);
    };

    const handleDeleteRepair = async (repairId) => {
        setIsLoadingDelete(true);
        try {
           await axios.delete(`${apiUrl}${repairId}/`);
            fetchRepairs();
            addToHistory(repairId, "deleted", "Repair ticket deleted");
            showNotification("Repair deleted successfully!");
            setDeleteRepairId(null);
        } catch (error) {
            console.error("Error deleting repair:", error);
            showNotification("Error deleting repair!", "error");
        } finally {
            setIsLoadingDelete(false);
        }
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
                const repairsToExport = repairs.filter(repair => selectedRepairs.includes(repair.repairTicketNumber));

            if(repairsToExport.length === 0){
                 showNotification("No repairs selected for export!", "error");
                 return;
                }
                switch (format) {
                   case 'csv':
                        exportToCSV(repairsToExport);
                      break;
                  case 'pdf':
                        exportToPDF(repairsToExport);
                         break;
                }
            showNotification(`Export to ${format.toUpperCase()} completed!`);

        } catch (error) {
            showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
        } finally {
             setIsLoadingExport(false);
         }
    };

    const exportToCSV = (repairsToExport) => {
        const csvContent = [
            [
                "Ticket Number",
                "Customer Name",
                "Phone Number",
                "Device Type",
                "Repair Status",
                "Date Received",
                "Notes"
            ].join(","),
            ...repairsToExport.map((repair) =>
                [
                    repair.repairTicketNumber,
                    repair.customerName,
                    repair.phoneNumber,
                    repair.deviceType,
                    repair.repairStatus,
                    repair.dateReceived,
                    repair.notes,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "repairs.csv";
        link.click();
        showNotification('CSV export completed')
    };


   const exportToPDF = (repairsToExport) => {
        const doc = new jsPDF();
        const tableColumn = [
            "Ticket Number",
            "Customer Name",
            "Phone Number",
            "Device Type",
            "Repair Status",
            "Date Received",
            "Notes"
        ];

        const tableRows = repairsToExport.map(repair => [
            repair.repairTicketNumber,
            repair.customerName,
            repair.phoneNumber,
            repair.deviceType,
            repair.repairStatus,
            repair.dateReceived,
            repair.notes,
        ]);

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 20,
        });

        doc.save('repairs.pdf');
        showNotification('PDF export completed')
    };



    const handleViewAttachments = (repair) => {
        setSelectedAttachmentRepair(repair);
    };

    const handleViewHistory = (repairId) => {
        setSelectedRepair(repairId);
    };


    const handlePrintPreview = (repair) => {
        setPrintPreviewRepair(repair);
    };
    const handleViewPattern = () => {

    };
   const handleSelectRepair = (repairId, isSelected) => {
      if (isSelected) {
        setSelectedRepairs(prev => [...prev, repairId]);
      } else {
         setSelectedRepairs(prev => prev.filter(id => id !== repairId));
      }
  };

    const filteredRepairs = repairs.filter((repair) => {
        return (
            (repair.customerName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                repair.repairTicketNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                repair.deviceType.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterStatus === "" || repair.repairStatus === filterStatus)
        );
    });

    const sortedRepairs = [...filteredRepairs].sort((a, b) => {
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

    const paginatedRepairs = sortedRepairs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 relative">
            {(isLoadingAddRepair || isLoadingStatusUpdate || isLoadingDelete || isLoadingUpdate || isLoadingExport) && (
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

            <h1 className="text-2xl font-bold mb-4">Repairs</h1>

            {/* Search and Filter */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by Customer, Ticket, or Device"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border p-2 mr-2 rounded w-full"
                    aria-label="Search repairs"
                />
                <select
                    value={filterStatus}
                    onChange={handleFilterStatus}
                    className="border p-2 rounded"
                    aria-label="Filter by Status"
                >
                    <option value="">All Statuses</option>
                    {repairStatusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination Info */}
            <div className="mb-4">
                <span className="text-sm text-gray-600">
                    Showing page {currentPage} of {Math.ceil(sortedRepairs.length / itemsPerPage)}
                    ({sortedRepairs.length} total records)
                 </span>
            </div>

            {/* Repair List */}
            <RepairList
                repairs={paginatedRepairs}
                onPageChange={setCurrentPage}
                onStatusUpdate={handleStatusUpdate}
                onDelete={confirmDeleteRepair}
                onEdit={handleEdit}
                onViewAttachments={handleViewAttachments}
                onViewHistory={handleViewHistory}
                onSort={handleSort}
                repairStatusOptions={repairStatusOptions}
                onPrint={handlePrintPreview}
                selectedRepairs={selectedRepairs} // Pass selected repairs to RepairList
                onSelectRepair={handleSelectRepair}
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
                                    Math.ceil(sortedRepairs.length / itemsPerPage)
                                )
                            )
                        }
                        disabled={currentPage >= Math.ceil(sortedRepairs.length / itemsPerPage)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        aria-label="Next Page"
                    >
                        Next
                    </button>
                </div>
            </div>


            {/* Add Repair Button */}
            <button
                onClick={() => setShowAddRepairForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                aria-label="Add New Repair"
            >
                Add Repair
            </button>


            {/* Modals */}
            <AddRepairForm
                isOpen={showAddRepairForm}
                onClose={() => setShowAddRepairForm(false)}
                onSave={handleAddRepair}
            />
            <EditRepairModal
                repair={editRepair}
                isOpen={!!editRepair}
                onClose={() => setEditRepair(null)}
                onSave={handleUpdateRepair}
            />
            <DeleteConfirmationModal
                isOpen={!!deleteRepairId}
                onClose={() => setDeleteRepairId(null)}
                onConfirm={() => handleDeleteRepair(deleteRepairId)}
                repairId={deleteRepairId}
            />
            <ViewAttachmentsModal
                isOpen={!!selectedAttachmentRepair}
                onClose={() => setSelectedAttachmentRepair(null)}
                attachments={
                    selectedAttachmentRepair?.attachments || []
                }
            />
            <RepairHistoryModal
                isOpen={!!selectedRepair}
                onClose={() => setSelectedRepair(null)}
                history={repairHistory[selectedRepair] || []}
                repairId={selectedRepair}
            />
            {/* Print Preview Modal */}
            <RepairTicketPrint
                isOpen={!!printPreviewRepair}
                onClose={() => setPrintPreviewRepair(null)}
                repair={printPreviewRepair}
            />
        </div>
    );
};
export default NewRepairEntry;