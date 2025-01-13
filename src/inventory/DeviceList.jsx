import React from "react";

const DeviceList = ({ devices = [], onEditItem, onDelete }) => {
    return (
        <div className="mb-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Current Devices</h2>
            {devices.length === 0 ? (
                <p className="text-gray-500">No devices at the moment.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-premium min-w-[1000px]">
                        <thead className="bg-gray-100">
                           <tr className="text-left">
                                <th className="cursor-pointer py-2 px-4">Device Name</th>
                                <th className="cursor-pointer py-2 px-4">Description</th>
                                <th className="cursor-pointer py-2 px-4">Price</th>
                                <th className="cursor-pointer py-2 px-4">Quantity</th>
                                 <th className="cursor-pointer py-2 px-4">IMEI</th>
                                <th className="cursor-pointer py-2 px-4">Storage</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device) => (
                                <tr key={device.imei} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{device.name}</td>
                                    <td className="border px-4 py-2">{device.description}</td>
                                    <td className="border px-4 py-2">€{device.price}</td>
                                    <td className="border px-4 py-2">{device.quantity_on_hand}</td>
                                      <td className="border px-4 py-2">{device.imei}</td>
                                       <td className="border px-4 py-2">{device.storage}</td>
                                    <td className="border px-4 py-2">
                                       <button
                                            onClick={() => onEditItem(device)}
                                            className="text-blue-500 hover:text-blue-700"
                                            aria-label="Edit"
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(device.sku)}
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

export default DeviceList;