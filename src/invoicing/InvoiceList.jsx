// src/invoicing/InvoiceList.jsx
import React from "react";
import InvoiceListItem from "./InvoiceListItem";
import { Edit, Trash2, Eye, Printer, ChevronDown, ChevronUp } from "lucide-react";

const InvoiceList = ({
    invoices,
    onPageChange,
     onStatusUpdate,
    onDelete,
    onEdit,
    onViewHistory,
     onSort,
     invoiceStatusOptions,
     onPrint,
    selectedInvoices,
    onSelectInvoice,
}) => {

    return (
         <div className="mb-6 overflow-x-auto">
             <h2 className="text-xl font-semibold mb-2">Current Invoices</h2>
              {invoices.length === 0 ? (
                 <p className="text-gray-500">No invoices at the moment.</p>
              ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full table-auto border-collapse border border-gray-300 min-w-[1000px]">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="px-4 py-2">Select</th>
                                <th
                                    onClick={() => onSort("invoiceNumber")}
                                    className="cursor-pointer py-2 px-4"
                                >
                                    Invoice #
                                </th>
                                <th
                                    onClick={() => onSort("billTo")}
                                    className="cursor-pointer py-2 px-4"
                                >
                                    Bill To
                                </th>
                                 <th
                                    onClick={() => onSort("dateOfIssue")}
                                     className="cursor-pointer py-2 px-4"
                                >
                                    Date Of Issue
                                 </th>
                                <th
                                     onClick={() => onSort("total")}
                                   className="cursor-pointer py-2 px-4"
                                 >
                                      Total
                                 </th>
                                <th
                                     onClick={() => onSort("status")}
                                     className="cursor-pointer py-2 px-4"
                                 >
                                    Status
                                </th>
                                <th className="py-2 px-4">Actions</th>
                                 <th className="py-2 px-4">Buttons</th>
                            </tr>
                         </thead>
                        <tbody>
                         {invoices.map((invoice) => (
                             <InvoiceListItem
                                 key={invoice.invoiceNumber}
                                 invoice={invoice}
                                 onStatusUpdate={onStatusUpdate}
                                  onDelete={onDelete}
                                  onEdit={onEdit}
                                  onViewHistory={onViewHistory}
                                  invoiceStatusOptions={invoiceStatusOptions}
                                  onPrint={onPrint}
                                  selectedInvoices={selectedInvoices}
                                  onSelectInvoice={onSelectInvoice}
                               />
                            ))}
                      </tbody>
                    </table>
                 </div>
             )}
         </div>
    );
};

export default InvoiceList;