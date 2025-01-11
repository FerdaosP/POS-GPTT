import React from 'react';

const RepairTicketPrint = ({ repair, isOpen = false, onClose, companyInfo }) => {
    const handlePrint = () => {
        if (!repair || !companyInfo) return;
        const printWindow = window.open('', '_blank');
        const printContent = companyInfo.print_layout
            .replace(/\{\{\s*companyName\s*\}\}/g, companyInfo.companyName || "Repair Point BV")
            .replace(/\{\{\s*repairTicketNumber\s*\}\}/g, repair.repairTicketNumber)
            .replace(/\{\{\s*customerName\s*\}\}/g, repair.customerName)
            .replace(/\{\{\s*phoneNumber\s*\}\}/g, repair.phoneNumber)
            .replace(/\{\{\s*deviceType\s*\}\}/g, repair.deviceType)
            .replace(/\{\{\s*imei\s*\}\}/g, repair.imei || "N/A")
            .replace(/\{\{\s*issueDescription\s*\}\}/g, repair.issueDescription)
            .replace(/\{\{\s*repairTechnician\s*\}\}/g, repair.repairTechnician || "N/A")
            .replace(/\{\{\s*priceEstimate\s*\}\}/g, repair.priceEstimate || "N/A")
            .replace(/\{\{\s*dateReceived\s*\}\}/g, repair.dateReceived ? new Date(repair.dateReceived).toLocaleDateString() : "N/A")
            .replace(/\{\{\s*termsAndConditions\s*\}\}/g, companyInfo.termsAndConditions || "");

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        onClose();
    };

    if (!isOpen || !repair) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Print Preview</h2>
                <div className="p-4 border rounded">
                    <div className="print-ticket" dangerouslySetInnerHTML={{
                        __html: companyInfo?.print_layout
                            .replace(/\{\{\s*companyName\s*\}\}/g, companyInfo?.companyName || "Repair Point BV")
                            .replace(/\{\{\s*repairTicketNumber\s*\}\}/g, repair?.repairTicketNumber)
                            .replace(/\{\{\s*customerName\s*\}\}/g, repair?.customerName)
                            .replace(/\{\{\s*phoneNumber\s*\}\}/g, repair?.phoneNumber)
                            .replace(/\{\{\s*deviceType\s*\}\}/g, repair?.deviceType)
                            .replace(/\{\{\s*imei\s*\}\}/g, repair?.imei || "N/A")
                            .replace(/\{\{\s*issueDescription\s*\}\}/g, repair?.issueDescription)
                            .replace(/\{\{\s*repairTechnician\s*\}\}/g, repair?.repairTechnician || "N/A")
                            .replace(/\{\{\s*priceEstimate\s*\}\}/g, repair?.priceEstimate || "N/A")
                            .replace(/\{\{\s*dateReceived\s*\}\}/g, repair?.dateReceived ? new Date(repair?.dateReceived).toLocaleDateString() : "N/A")
                            .replace(/\{\{\s*termsAndConditions\s*\}\}/g, companyInfo?.termsAndConditions || "")
                    }} />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Print
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RepairTicketPrint;