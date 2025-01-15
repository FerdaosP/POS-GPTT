import React, { useState, useEffect } from "react";
import { AlertCircle, Download, FileText, File, Eye, Wrench } from "lucide-react";
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import Alert, { AlertDescription } from "../reparatiekaart/Alert";
import Loading from "../reparatiekaart/Loading";
import DeleteConfirmationModal from "../reparatiekaart/DeleteConfirmationModal";
import CustomerItem from "./CustomerItem";
import CustomerForm from "./CustomerForm";
import EditCustomerModal from "./EditCustomerModal";
import AddRepairForm from "../reparatiekaart/AddRepairForm";

const CustomerList = ({useMockData}) => {
    const [customers, setCustomers] = useState([]);
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
    const [isLoadingAddCustomer, setIsLoadingAddCustomer] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSegment, setFilterSegment] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState("companyName");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentUser, setCurrentUser] = useState("Admin");
    const [editCustomer, setEditCustomer] = useState(null);
    const [deleteCustomerId, setDeleteCustomerId] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [customerSegments, setCustomerSegments] = useState([]);
    const [showRepairHistory, setShowRepairHistory] = useState(false);
    const [selectedCustomerRepairs, setSelectedCustomerRepairs] = useState([]);
    const [loadingRepairs, setLoadingRepairs] = useState(false);
    const [errorRepairs, setErrorRepairs] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddRepairForm, setShowAddRepairForm] = useState(false);


    const apiUrl = 'http://localhost:8000/api/customers/';
    const segmentApiUrl = 'http://localhost:8000/api/customer-segments/';


    useEffect(() => {
        fetchCustomers();
        fetchCustomerSegments();
    }, []);

    const fetchCustomerSegments = async () => {
       if(useMockData){
         setCustomerSegments([
            {
                id: 1,
                name: "Retail"
             },
            {
                id: 2,
               name: "Wholesale",
            },
             {
                id: 3,
              name: "Repair"
            }
           ]);
       }else{
        try {
            const response = await axios.get(segmentApiUrl);
            setCustomerSegments(JSON.parse(JSON.stringify(response.data)));
        } catch(err){
            console.error("Error fetching customer segments", err)
            showNotification("Error fetching segments! Check the console", "error");
        }
       }
    }
    const fetchCustomers = async () => {
        if(useMockData){
          setCustomers([
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
                segments: [1,2],
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
                 segments: [2,3],
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
                 segments: [1],
              },
          ]);
       } else{
        try {
            const response = await axios.get(apiUrl);
            setCustomers(JSON.parse(JSON.stringify(response.data)));
        } catch (error) {
            console.error("Error fetching customers:", error);
            showNotification("Error fetching customers! Check the console.", "error");
        }
      }
    };


    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };
    const handleAddCustomer = async (newCustomerData) => {
        setIsLoadingAddCustomer(true);
        if(useMockData){
             setCustomers(prev => ([...prev, newCustomerData]));
              showNotification("Customer added successfully!");
              setShowAddCustomerForm(false);
        } else {
           try {
            await axios.post(apiUrl, newCustomerData);
            fetchCustomers();
             showNotification("Customer added successfully!");
             setShowAddCustomerForm(false);
          } catch (error) {
             console.error("Error adding customer:", error);
             showNotification("Error adding customer!", "error");
            } finally {
             setIsLoadingAddCustomer(false);
          }
       }

          setIsLoadingAddCustomer(false);
    };

    const handleEdit = (customer) => {
        setEditCustomer({ ...customer });
    };


    const handleUpdateCustomer = async (updatedCustomer) => {
        setIsLoadingUpdate(true);
          if(useMockData){
              const newCustomers = customers.map(item => item.id === updatedCustomer.id ? updatedCustomer : item);
                setCustomers(newCustomers)
              showNotification("Customer updated successfully!");
              setEditCustomer(null);
            } else {
                try {
                await axios.put(`${apiUrl}${updatedCustomer.id}/`, updatedCustomer);
                fetchCustomers();
               showNotification("Customer updated successfully!");
               setEditCustomer(null);
             } catch (error) {
              console.error("Error updating customer:", error);
                showNotification("Error updating customer!", "error");
           } finally {
              setIsLoadingUpdate(false);
            }
        }
        setIsLoadingUpdate(false);
    };
    const confirmDeleteCustomer = (customerId) =>
        setDeleteCustomerId(customerId);

    const handleDeleteCustomer = async (customerId) => {
        setIsLoadingDelete(true);
        if(useMockData){
             setCustomers(prev => prev.filter(item => item.id !== customerId))
             showNotification("Customer deleted successfully!");
             setDeleteCustomerId(null);
       }else {
            try {
                await axios.delete(`${apiUrl}${customerId}/`);
                fetchCustomers();
               showNotification("Customer deleted successfully!");
               setDeleteCustomerId(null);
           } catch (error) {
                 console.error("Error deleting customer:", error);
                 showNotification("Error deleting customer!", "error");
           } finally {
                 setIsLoadingDelete(false);
            }
        }
        setIsLoadingDelete(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterSegment = (e) => {
        setFilterSegment(e.target.value);
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
            const customersToExport = customers.filter(customer => selectedCustomers.includes(customer.id));
            if(customersToExport.length === 0){
                showNotification("No customers selected for export!", "error");
                return;
            }
            switch (format) {
                case 'csv':
                    exportToCSV(customersToExport);
                    break;
                case 'pdf':
                    exportToPDF(customersToExport);
                    break;
                default:
                    showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
            }

        } catch (error) {
            showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
        } finally {
            setIsLoadingExport(false);
        }
    };


    const exportToCSV = (customersToExport) => {
        const csvContent = [
            [
                "Company Number",
                "Company Name",
                "First Name",
                "Last Name",
                "Email",
                "Phone",
                "Street",
                "Postal Code",
                "City",
                "Country",
            ].join(","),
            ...customersToExport.map((customer) =>
                [
                    customer.companyNumber,
                    customer.companyName,
                    customer.firstName,
                    customer.lastName,
                    customer.email,
                    customer.phone,
                    customer.street,
                    customer.postalCode,
                    customer.city,
                    customer.country,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "customers.csv";
        link.click();
        showNotification('CSV export completed')
    };


    const exportToPDF = (customersToExport) => {
        const doc = new jsPDF();
        const tableColumn = [
            "Company Number",
            "Company Name",
            "First Name",
            "Last Name",
            "Email",
            "Phone",
            "Street",
            "Postal Code",
            "City",
            "Country",
        ];

        const tableRows = customersToExport.map(customer => [
            customer.companyNumber,
            customer.companyName,
            customer.firstName,
            customer.lastName,
            customer.email,
            customer.phone,
            customer.street,
            customer.postalCode,
            customer.city,
            customer.country,
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('customers.pdf');
        showNotification('PDF export completed')
    };

    const handleSelectCustomer = (customerId, isSelected) => {
        if (isSelected) {
            setSelectedCustomers(prev => [...prev, customerId]);
        } else {
            setSelectedCustomers(prev => prev.filter(id => id !== customerId));
        }
    };

    const handleOpenCustomerForm = () => {
        setShowAddCustomerForm(true);
    };

    const handleCloseCustomerForm = () => {
        setShowAddCustomerForm(false);
    };


    const filteredCustomers = customers.filter((customer) => {
        return (
            (customer.firstName.toLowerCase().includes(searchTerm.toLowerCase())
                || customer.lastName.toLowerCase().includes(searchTerm.toLowerCase())
                || customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
            && (filterSegment === "" || customer.segments.includes(parseInt(filterSegment)))
        );
    });


    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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

    const paginatedCustomers = sortedCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handleCancelCustomer = () => {
        setShowAddCustomerForm(false);
    };


     const handleCreateRepair = (customer) => {
        setSelectedCustomer(customer);
        setShowAddRepairForm(true)
    };

        const handleCloseRepairForm = () => {
        setShowAddRepairForm(false);
          setSelectedCustomer(null);
     };
        const handleSaveNewRepair = async (newRepair) => {
       setShowAddRepairForm(false);
        showNotification("Repair added succesfully!")
    }


    const handleViewRepairs = async (customer) => {
        setLoadingRepairs(true);
        setErrorRepairs(null);
          if(useMockData){
                setSelectedCustomerRepairs([
                 {
                  repairTicketNumber: "REP-2024-001",
                  deviceType: "iPhone 13",
                   imei: "123456789012345",
                   issueDescription: "Cracked screen",
                    repairStatus: "In Progress",
                    dateReceived: "2024-07-03",
                 },
                {
                    repairTicketNumber: "REP-2024-002",
                     deviceType: "Samsung S21",
                    imei: "987654321098765",
                   issueDescription: "Battery replacement",
                   repairStatus: "Completed",
                  dateReceived: "2024-07-05",
                 },
             ]);
               setSelectedCustomer(customer);
                setShowRepairHistory(true);
                 setLoadingRepairs(false);
              } else{
                  try {
                    const response = await axios.get(`http://localhost:8000/api/repairs/?customer=${customer.id}`);
                     setSelectedCustomerRepairs(response.data);
                       setSelectedCustomer(customer);
                     setShowRepairHistory(true);
               } catch (err) {
                   console.error('There was an error loading repairs', err);
                    setErrorRepairs(`There was an error loading repairs: ${err.message}`);
                    showNotification(`There was an error loading repairs: ${err.message}`, "error")
                } finally {
                   setLoadingRepairs(false);
                 }
            }
    };
    const handleCloseRepairs = () => {
        setShowRepairHistory(false);
        setSelectedCustomer(null);
        setSelectedCustomerRepairs([]);
    };
    const renderLoadingState = () => {
        return <Loading isLoading={loadingRepairs} />;
    };
    const renderErrorState = () => {
        if (errorRepairs) {
            return (
                <Alert className={`mb-4 bg-red-50`}>
                    <AlertDescription>{errorRepairs}</AlertDescription>
                </Alert>
            );
        }
        return null;
    };
     return (
        <div className="p-4 relative">
            {(isLoadingAddCustomer || isLoadingDelete || isLoadingUpdate || isLoadingExport) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
                        <Loading className="animate-spin" isLoading={true}/>
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
              {renderLoadingState()}
             {renderErrorState()}
            <h1 className="text-2xl font-bold mb-4">Customers</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by Name or Company"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border p-2 mr-2 rounded w-full"
                    aria-label="Search customers"
                />
                <select
                    value={filterSegment}
                    onChange={handleFilterSegment}
                    className="border p-2 rounded"
                    aria-label="Filter by segment"
                >
                    <option value="">All Segments</option>
                    {customerSegments.map((segment) => (
                        <option key={segment.id} value={segment.id}>
                            {segment.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <span className="text-sm text-gray-600">
                    Showing page {currentPage} of {Math.ceil(sortedCustomers.length / itemsPerPage)}
                    ({sortedCustomers.length} total records)
                </span>
            </div>
            {/* Customer List */}
            <div className="mb-6 overflow-x-auto">
                {paginatedCustomers.length === 0 ? (
                    <p className="text-gray-500">No customers at the moment.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse border border-gray-300 min-w-[1000px]">
                            <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="px-4 py-2">Select</th>
                                <th
                                    onClick={() => handleSort("companyName")}
                                    className="cursor-pointer py-2 px-4"
                                >
                                    Company Name
                                </th>
                                <th
                                    onClick={() => handleSort("firstName")}
                                    className="cursor-pointer py-2 px-4"
                                >
                                    First Name
                                </th>
                                <th
                                    onClick={() => handleSort("lastName")}
                                    className="cursor-pointer py-2 px-4"
                                >
                                    Last Name
                                </th>
                                <th
                                    onClick={() => handleSort("email")}
                                    className="cursor-pointer py-2 px-4"
                                >
                                    Email
                                </th>
                                <th
                                    onClick={() => handleSort("phone")}
                                    className="cursor-pointer py-2 px-4"
                                >
                                    Phone
                                </th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedCustomers.map((customer) => (
                                <CustomerItem
                                    key={customer.id}
                                    customer={customer}
                                    onDelete={confirmDeleteCustomer}
                                    onEdit={handleEdit}
                                    selectedCustomers={selectedCustomers}
                                    onSelectCustomer={handleSelectCustomer}
                                    onViewRepairs={handleViewRepairs}
                                    onCreateRepair={handleCreateRepair}
                                />
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
                                    Math.ceil(sortedCustomers.length / itemsPerPage)
                                )
                            )
                        }
                        disabled={currentPage >= Math.ceil(sortedCustomers.length / itemsPerPage)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        aria-label="Next Page"
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* Add Customer Button */}
            <button
                onClick={handleOpenCustomerForm}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                aria-label="Add New Customer"
            >
                Add Customer
            </button>
            {showAddCustomerForm && (
                <CustomerForm
                    onSave={handleAddCustomer}
                    onCancel={handleCancelCustomer}
                />
            )}
            <EditCustomerModal
                customer={editCustomer}
                isOpen={!!editCustomer}
                onClose={() => setEditCustomer(null)}
                onSave={handleUpdateCustomer}
            />
            <DeleteConfirmationModal
                isOpen={!!deleteCustomerId}
                onClose={() => setDeleteCustomerId(null)}
                onConfirm={() => handleDeleteCustomer(deleteCustomerId)}
                repairId={deleteCustomerId}
            />
            {showRepairHistory && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/2">
                        <h2 className="text-lg font-bold mb-4">
                            Repairs for {selectedCustomer?.companyName}
                        </h2>
                        {selectedCustomerRepairs.length === 0 ? (
                            <p>No Repairs Found For This Customer</p>
                        ) : (
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Ticket #</th>
                                    <th className="border border-gray-300 px-4 py-2">Device</th>
                                    <th className="border border-gray-300 px-4 py-2">IMEI</th>
                                    <th className="border border-gray-300 px-4 py-2">Issue</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedCustomerRepairs.map(repair => (
                                    <tr key={repair.repairTicketNumber} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{repair.repairTicketNumber}</td>
                                        <td className="border border-gray-300 px-4 py-2">{repair.deviceType}</td>
                                        <td className="border border-gray-300 px-4 py-2">{repair.imei}</td>
                                        <td className="border border-gray-300 px-4 py-2">{repair.issueDescription}</td>
                                        <td className="border border-gray-300 px-4 py-2">{repair.repairStatus}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(repair.dateReceived).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                        <button
                            onClick={handleCloseRepairs}
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
             {showAddRepairForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                       <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                       <h2 className="text-xl font-semibold mb-4">New Repair</h2>
                         <AddRepairForm
                                 isOpen={showAddRepairForm}
                                  onClose={handleCloseRepairForm}
                                   onSave={handleSaveNewRepair}
                                   defaultCustomer={selectedCustomer}
                                />
                           <button onClick={handleCloseRepairForm} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
                       </div>
                  </div>
               )}
        </div>
    );
};

export default CustomerList;