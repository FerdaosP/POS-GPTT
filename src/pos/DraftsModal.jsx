// DraftsModal.jsx
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const DraftsModal = ({ drafts, onClose, onLoadDraft, onDeleteDraft }) => { // Added onDeleteDraft prop

    const [draftNameToDelete, setDraftNameToDelete] = useState(null);

    const handleDeleteConfirmation = (draft) => {
        setDraftNameToDelete(draft.id);
    };

    const confirmDelete = () => {
        if (draftNameToDelete) {
            onDeleteDraft(draftNameToDelete);
            setDraftNameToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDraftNameToDelete(null);
    };


    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Saved Drafts</h2>
                {drafts.length === 0 ? (
                    <p>No drafts saved yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {drafts.map((draft) => (
                            <li key={draft.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                <div>
                                    <div className="font-medium">{draft.name || `Draft ${drafts.indexOf(draft) + 1}`}</div> {/* Display draft name or default */}
                                    <div className="text-sm text-gray-600">
                                        Saved on {new Date(draft.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onLoadDraft(draft)}
                                        className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                    >
                                        Load
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConfirmation(draft)} // Call delete confirmation
                                        className="p-2 text-red-600 hover:text-red-700"
                                        title="Delete Draft"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={onClose}
                    className="w-full mt-4 bg-gray-200 py-2 rounded hover:bg-gray-300"
                >
                    Close
                </button>
            </div>
             {/* Confirmation Modal for Delete */}
             {draftNameToDelete && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <p className="mb-4">Are you sure you want to delete this draft?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DraftsModal;