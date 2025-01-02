import React, { useState } from "react";
import { Edit, Trash2, Eye, Printer, ChevronDown, ChevronUp, Mail } from "lucide-react";
import axios from "axios";
import SendInvoiceModal from "./SendInvoiceModal";

const InvoiceListItem = ({
    invoice,
    onStatusUpdate,
    onDelete,
    onEdit,
    onViewHistory,
    invoiceStatusOptions,
    onPrint,
    selectedInvoices,
    onSelectInvoice,
    companyInfo
}) => {
     const [isExpanded, setIsExpanded] = useState(false);
     const [showSendModal, setShowSendModal] = useState(false);

    const handleCheckboxChange = (e) => {
        onSelectInvoice(invoice.invoiceNumber, e.target.checked);
    };

    const handleSendEmail = () => {
        setShowSendModal(true)
    };
    const handleCloseSendModal = () => {
        setShowSendModal(false);
    };
    return (
         <tr
            key={invoice.invoiceNumber}
            className={`hover:bg-gray-100 ${
                selectedInvoices?.includes(invoice.invoiceNumber) ? "bg-blue-100" : ""
            }`}
        >
             <td className="border px-4 py-2">
                <input
                  type="checkbox"
                    checked={selectedInvoices?.includes(invoice.invoiceNumber) || false}
                     onChange={handleCheckboxChange}
                   />
            </td>
             <td className="border px-4 py-2">{invoice.invoiceNumber}</td>
            <td className="border px-4 py-2">{invoice.billTo}</td>
             <td className="border px-4 py-2">{new Date(invoice.dateOfIssue).toLocaleDateString()}</td>
             <td className="border px-4 py-2">{invoice.total}</td>
             <td className="border px-4 py-2">
                <select
                    value={invoice.status}
                     onChange={(e) =>
                        onStatusUpdate(invoice.invoiceNumber, e.target.value)
                    }
                    className="border p-1 rounded"
                >
                    {invoiceStatusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </td>
           <td className="border px-4 py-2 relative">
               <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center  hover:bg-gray-200 p-1 rounded"
                 >
                    Actions
                       {isExpanded ? <ChevronUp size={16}/> :  <ChevronDown size={16}/> }
                 </button>
                 {isExpanded && (
                    <div className=" mt-2 bg-gray-50 border border-gray-300 p-4 rounded z-10">
                        <div className="space-y-1">
                           <p>
                                <span className="font-semibold">Bill To:</span> {invoice.billTo}
                            </p>
                             <p>
                                <span className="font-semibold">Email:</span> {invoice.billToEmail || "N/A"}
                           </p>
                            <p>
                                <span className="font-semibold">Address:</span> {invoice.billToAddress || "N/A"}
                            </p>
                           <p>
                                <span className="font-semibold">Notes:</span> {invoice.notes || "N/A"}
                            </p>
                       </div>
                    </div>
                  )}
           </td>
             <td className="border px-4 py-2">
                <button
                    onClick={() => onEdit(invoice)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit"
                    style={{ marginRight: '0.5rem' }}
                >
                    <Edit size={16} />
                </button>
                 <button
                    onClick={() => onViewHistory(invoice.invoiceNumber)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="View History"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none', marginRight: '0.5rem' }}
                >
                    <Eye size={16} />
                </button>
                   <button
                     onClick={() => onPrint(invoice)}
                     className="text-purple-500 hover:text-purple-700"
                     aria-label="Print Invoice"
                     style={{ marginRight: '0.5rem' }}
                 >
                     <Printer size={16} />
                 </button>
                <button
                     onClick={handleSendEmail}
                     className="text-green-500 hover:text-green-700"
                    aria-label="Send Email"
                   style={{ marginRight: '0.5rem' }}
                    >
                     <Mail size={16} />
                </button>
                <button
                    onClick={() => onDelete(invoice.invoiceNumber)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete"
                    style={{ marginRight: '0.5rem' }}
                >
                    <Trash2 size={16} />
                </button>
            </td>
             {showSendModal && (
                  <SendInvoiceModal
                      isOpen={showSendModal}
                      onClose={handleCloseSendModal}
                      invoice={invoice}
                     companyInfo={companyInfo}
                    />
              )}
        </tr>
    );
};

export default InvoiceListItem;