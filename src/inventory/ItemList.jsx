import React from "react";

const ItemList = ({ inventory = [], onEditItem, onDelete }) => {
    return (
        <div className="mb-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Current Inventory Items</h2>
            {inventory.length === 0 ? (
                <p className="text-gray-500">No inventory items at the moment.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-premium min-w-[1000px]">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="cursor-pointer py-2 px-4">SKU</th>
                                <th className="cursor-pointer py-2 px-4">Name</th>
                                <th className="cursor-pointer py-2 px-4">Description</th>
                                <th className="cursor-pointer py-2 px-4">Price</th>
                                 <th className="cursor-pointer py-2 px-4">Quantity</th>
                                 <th className="cursor-pointer py-2 px-4">Category</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.sku} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{item.sku}</td>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">{item.description}</td>
                                    <td className="border px-4 py-2">€{item.price}</td>
                                    <td className="border px-4 py-2">{item.quantity_on_hand}</td>
                                    <td className="border px-4 py-2">{item.category}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => onEditItem(item)}
                                            className="text-blue-500 hover:text-blue-700"
                                            aria-label="Edit"
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.sku)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ItemList;