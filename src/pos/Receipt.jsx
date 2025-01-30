import React from 'react';

const Receipt = ({ receipt, template }) => {
    return (
        <div className="receipt-container p-4 bg-white rounded-lg shadow" style={{ width: '300px' }}>
            {template?.logoUrl && (
                <img src={template.logoUrl} alt="Logo" className="w-20 mx-auto mb-2" />
            )}
            <h2 className="text-xl font-bold text-center mb-2">{template?.header || "Your Receipt"}</h2>
            <div className="text-sm">
                <div className="text-center mb-2 text-gray-600">
                    {new Date(receipt.date).toLocaleString()}
                </div>
                <div className="mb-2 text-center text-xs text-gray-500">
                    Receipt ID: {receipt.receiptId}
                </div>

                <table className="w-full mb-4">
                    <tbody>
                        {receipt.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-1">
                                    {item.qty}x {item.name}
                                    {item.warranty && (
                                        <span className="ml-2 text-xs text-gray-500">
                                            (Warranty: {item.warranty})
                                        </span>
                                    )}
                                </td>
                                <td className="text-right py-1">
                                    ${(item.price * item.qty).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="border-t pt-2 space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${receipt.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (10%):</span>
                        <span>${receipt.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${receipt.total.toFixed(2)}</span>
                    </div>
                    {receipt.change > 0 && (
                        <div className="flex justify-between text-blue-600">
                            <span>Change Given:</span>
                            <span>${receipt.change.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="pt-2 text-xs text-gray-500">
                        Payment Methods: {receipt.paymentMethods.join(', ')}
                    </div>
                </div>

                 {receipt.refunds && receipt.refunds.length > 0 && (
                    <div className="border-t pt-2">
                        <h3 className="font-bold mb-2">Refunds</h3>
                        {receipt.refunds.map((refund, index) => (
                            <div key={index} className="text-sm">
                                <p>Refund #{index + 1}: ${refund.refundTotal.toFixed(2)}</p>
                                <ul className="text-xs text-gray-600">
                                    {refund.items.map(item => (
                                        <li key={item.id}>
                                            {item.refundQty}x {item.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 text-xs text-center text-gray-500">
                    Thank you for your business!
                </div>
                {template?.footer && (
                    <div className="mt-4 text-xs text-center text-gray-500">
                        {template.footer}
                    </div>
                )}
                 {template?.terms && (
                    <div className="mt-2 text-xs text-center text-gray-500">
                       {template.terms}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Receipt;