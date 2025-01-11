import React from "react";
import { Edit, Trash2, Eye, Wrench } from "lucide-react";

const CustomerItem = ({
    customer,
    onDelete,
    onEdit,
    selectedCustomers,
    onSelectCustomer,
    onViewRepairs,
    onCreateRepair
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
            <td className="border px-4 py-2">{customer.firstName}</td>
             <td className="border px-4 py-2">{customer.lastName}</td>
            <td className="border px-4 py-2">{customer.email}</td>
            <td className="border px-4 py-2">{customer.phone}</td>
        <td className="border px-4 py-2">
            <button
                    onClick={() => onEdit(customer)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    aria-label="Edit"
                >
                    <Edit size={16} />
                </button>
                 <button
                        onClick={() => onViewRepairs(customer)}
                       className="text-gray-500 hover:text-gray-700 mr-2"
                        aria-label="View Repairs"
                     >
                       <Eye size={16} />
                   </button>
                  <button
                     onClick={() => onCreateRepair(customer)}
                      className="text-green-500 hover:text-green-700 mr-2"
                       aria-label="Create Repair Ticket"
                    >
                        <Wrench size={16}/>
                     </button>
                <button
                    onClick={() => onDelete(customer.id)}
                    className="text-red-500 hover:text-red-700"
                     aria-label="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </td>
    </tr>
  );
};
export default CustomerItem