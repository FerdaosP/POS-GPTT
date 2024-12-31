import React, { useState, useEffect } from "react";
import { FileText, XCircle } from "lucide-react";

const ViewAttachmentsModal = ({ isOpen, onClose, attachments }) => {
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);


    useEffect(() => {
      if (attachments) {
        setAttachmentPreviews(
            attachments.map(file => ({
                    name: file.name,
                    type: file.type,
                    url: URL.createObjectURL(file)
                })
            )
        );
      } else {
        setAttachmentPreviews([]);
      }
  }, [attachments]);

 const handleClose = () => {
        setAttachmentPreviews([]);
         onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                     Attachments
                </h3>
                {attachmentPreviews.length === 0 ? (
                   <p>No attachments</p>
                   ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {attachmentPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                {preview.type.startsWith("image/") ? (
                                    <div className="relative">
                                        <img
                                            src={preview.url}
                                            alt={`Attachment ${index + 1}`}
                                            className="max-w-full max-h-48 border rounded"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-2 border rounded flex items-center justify-between">
                                        <FileText className="inline-block mr-2" />
                                        <span className="truncate">{preview.name}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                   )}
                <button
                    onClick={handleClose}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ViewAttachmentsModal;