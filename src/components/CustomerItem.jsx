import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerItem = ({
    customer,
    onDelete,
    onEdit,
    selectedCustomers,
    onSelectCustomer
}) => {
    const handleCheckboxChange = (e) => {
         onSelectCustomer(customer.id, e.target.checked);
    };

    return (
         <tr
            key={customer.id}
           className={`hover:bg-gray-100 ${
                selectedCustomers?.includes(customer.id) ? "bg-blue-100" : ""
            }`}
        >
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                   checked={selectedCustomers?.includes(customer.id) || false}
                    onChange={handleCheckboxChange}
                />
            </td>
           <td className="border px-4 py-2">{customer.companyName}</td>
            <td className="border px-4 py-2">{customer.firstName} {customer.lastName}</td>
              <td className="border px-4 py-2">{customer.firstName}</td>
           <td className="border px-4 py-2">{customer.email}</td>
          <td className="border px-4 py-2">{customer.phone}</td>
            <td className="border px-4 py-2 text-center">
                  <div className="flex justify-center space-x-2">
                      <Link to={`/customers/edit/${customer.id}`} className="text-blue-500 hover:text-blue-700" aria-label="Edit customer">
                        <Edit size={16} />
                   </Link>
                    <button
                        onClick={() => onDelete(customer.id)}
                       className="text-red-500 hover:text-red-700"
                        aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
              </td>
        </tr>
    );
};

export default CustomerItem;