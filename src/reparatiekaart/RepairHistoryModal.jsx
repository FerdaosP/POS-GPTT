import React from "react";

const RepairHistoryModal = ({ isOpen, onClose, history, repairId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                    Repair History {repairId && `(Ticket #${repairId})`}
                </h3>
                {history.length === 0 ? (
                  <p>No history for this repair.</p>
                   ) : (
                    <ul className="space-y-2">
                      {history?.map((entry, index) => (
                         <li key={index} className="border-b pb-2">
                             <div className="text-sm text-gray-600">
                                {new Date(entry.timestamp).toLocaleString()}
                            </div>
                             <div className="font-medium">{entry.action}</div>
                              <div>
                                {entry.details} {entry.user && `- by ${entry.user}`}
                            </div>
                         </li>
                       ))}
                   </ul>
                   )}
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default RepairHistoryModal;