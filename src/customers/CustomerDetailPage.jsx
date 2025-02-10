// File: /src/customers/CustomerDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById, updateCustomer } from '../utils/customerUtils';
import { getRepairsByCustomerId } from '../utils/repairManager';
import { ArrowLeft, Edit, Printer, Download } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import InvoiceModal from '../pos/InvoiceModal'; // import your invoice modal component

const CustomerTicket = ({ customer, currencySymbol }) => {
    const containerStyle = {
        width: '300px',
        fontFamily: 'monospace',
        fontSize: '12px',
        padding: '5px',
        color: '#000'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', margin: '5px 0' }}>Customer Profile</h2>
            <hr style={{ border: 'none', borderBottom: '1px dashed #000', margin: '5px 0' }} />
            <p><strong>Name:</strong> {customer.type === 'company' ? customer.companyName : `${customer.firstName} ${customer.lastName}`}</p>
            <p><strong>Type:</strong> {customer.type}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            {customer.vatNumber && <p><strong>VAT:</strong> {customer.vatNumber}</p>}
            <hr style={{ border: 'none', borderBottom: '1px dashed #000', margin: '5px 0' }} />
            <p><strong>Total Spending:</strong> {currencySymbol}{customer.totalSpending?.toFixed(2) || '0.00'}</p>
            <p><strong>Last Activity:</strong> {customer.lastActivityDate ? new Date(customer.lastActivityDate).toLocaleDateString() : 'No activity'}</p>
        </div>
    );
};


const CustomerDetailPage = ({ currencySymbol, template }) => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [repairs, setRepairs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null); // NEW: state for the selected invoice
    const [customerInvoices, setCustomerInvoices] = useState([]); // State for customer invoices


    useEffect(() => {
      const fetchData = () => {
        const foundCustomer = getCustomerById(customerId);
        setCustomer(foundCustomer);
        setEditedCustomer({ ...foundCustomer });
        setRepairs(getRepairsByCustomerId(customerId));
        setIsLoading(false);
    
        // Fetch invoices directly using the customer's id as key.
        const allInvoices = JSON.parse(localStorage.getItem('customer_invoices') || '{}');
        const invoicesForCustomer = allInvoices[foundCustomer.id] || [];
        setCustomerInvoices(invoicesForCustomer);
        console.log("Invoices fetched for customer:", invoicesForCustomer);
      };
    
      fetchData();
    }, [customerId]);
    
    const handleSaveEdit = (e) => {
        e.preventDefault();
        // Use the updateCustomer function from customerUtils
        try {
            const updatedCustomerData = {
                ...editedCustomer,
                updatedAt: new Date().toISOString(),
            };
            updateCustomer(customerId, updatedCustomerData);
            setCustomer(updatedCustomerData); // Update local state after successful update
            setIsEditing(false);
        } catch (error) {
            alert("Error updating customer: " + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer(prev => ({ ...prev, [name]: value }));
    };

    const getCustomerTicketHTML = () => {
        const ticketMarkup = renderToStaticMarkup(<CustomerTicket customer={customer} currencySymbol={currencySymbol} />);
        return `<html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Customer Profile</title>
                        <style>
                            @media print {
                                @page { margin: 0; }
                                body { margin: 0; padding: 0; }
                            }
                            body { font-family: monospace; }
                        </style>
                    </head>
                    <body>
                        ${ticketMarkup}
                    </body>
                </html>`;
    };

    const handleDownload = () => {
        const fullHtml = getCustomerTicketHTML();
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${customer.type === 'company' ? customer.companyName : customer.lastName}_profile.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handlePrint = () => {
        const fullHtml = getCustomerTicketHTML();
        const printWindow = window.open('', '_blank', 'width=320,height=600');
        printWindow.document.open();
        printWindow.document.write(fullHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    if (isLoading) return <div>Loading customer details...</div>;
    if (!customer) return <div>Customer not found</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-teal-600 hover:text-teal-700"
                    >
                        <ArrowLeft className="mr-2" size={18} />
                        Back to Customers
                    </button>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                                >
                                    <Printer size={18} />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                                >
                                    <Download size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>


                {/* Main Content */}
                {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-6">
                            Editing {customer.type === 'company' ? customer.companyName : `${customer.firstName} ${customer.lastName}`}
                        </h1>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {customer.type === 'company' ? (
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={editedCustomer.companyName || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editedCustomer.firstName || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editedCustomer.lastName || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editedCustomer.email || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editedCustomer.phone || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Type</label>
                                <select
                                    name="type"
                                    value={editedCustomer.type || 'person'}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    disabled // Disable the type field
                                >
                                    <option value="person">Individual</option>
                                    <option value="company">Company</option>
                                </select>
                            </div>
                            {editedCustomer.type === 'company' && (
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">VAT Number</label>
                                    <input
                                        type="text"
                                        name="vatNumber"
                                        value={editedCustomer.vatNumber || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                            <h1 className="text-2xl font-bold mb-6">
                                {customer.type === 'company' ? customer.companyName : `${customer.firstName} ${customer.lastName}`}
                            </h1>

                            {/* Customer Info */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Name</div>
                                        <div>{customer.type === 'company' ? customer.companyName : `${customer.firstName} ${customer.lastName}`}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        <div>{customer.email}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Phone</div>
                                        <div>{customer.phone}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Type</div>
                                        <div className="capitalize">{customer.type}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Total Spending</div>
                                        <div>{currencySymbol}{customer.totalSpending?.toFixed(2) || '0.00'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Last Activity</div>
                                        <div>
                                            {customer.lastActivityDate
                                                ? new Date(customer.lastActivityDate).toLocaleDateString()
                                                : 'No activity'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Repair History */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">Repair History</h2>
                                <div className="space-y-3">
                                    {repairs.length === 0 ? (
                                        <div className="text-gray-500">No repair history found</div>
                                    ) : (
                                        repairs.map(repair => (
                                            <Link
                                                key={repair.id}
                                                to={`/repairs/${repair.id}`}
                                                className="block hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="font-medium">Repair #{repair.ticketNumber}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {repair.deviceType} - {new Date(repair.dateReceived).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm">
                                                        Status: <span className="capitalize">{repair.status}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Invoices Section */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-4">Invoices</h2>
                                {/* Invoice History Section */}
                                {customerInvoices && customerInvoices.length > 0 ? (  // Use customerInvoices state
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3">Invoice History</h3>
                                        {customerInvoices.map((invoice) => (  // Map over customerInvoices
                                            <div
                                                key={invoice.invoiceNumber}
                                                className="p-3 border-b cursor-pointer hover:bg-gray-50"
                                                onClick={() => setSelectedInvoice(invoice)}
                                            >
                                                <div className="flex justify-between">
                                                    <span>{invoice.invoiceNumber}</span>
                                                    <span>{currencySymbol}{invoice.total.toFixed(2)}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-600">
                                        No invoices available for this customer.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
             {/* Render the InvoiceModal when an invoice is selected */}
             {selectedInvoice && (
                <InvoiceModal
                    currency={{ symbol: currencySymbol }}   // pass your currency object
                    invoice={selectedInvoice}                 // the invoice to view
                    template={template}                       // pass the invoice/receipt template
                    onNewTransaction={() => setSelectedInvoice(null)} // or simply close the modal
                />
            )}
        </div>
    );
};

export default CustomerDetailPage;