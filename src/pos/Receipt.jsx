// Receipt.jsx
import React from 'react';

const Receipt = ({ receipt, template, currency, taxByRate }) => {
    const date = new Date(receipt.date);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <div className="receipt-container p-2 bg-white" style={{ width: '300px', fontFamily: 'monospace' }}>
            {template?.showLogo && template?.logoUrl && (
                <img src={template.logoUrl} alt="Logo" className="w-20 mx-auto mb-1" />
            )}

            {/* Business Information */}
            <div className="text-center">
                {template?.businessName && (
                    <div className="text-base font-bold">
                        {template.businessName}
                    </div>
                )}
                {template?.businessAddress && (
                    <div className="text-xs">
                        {template.businessAddress}
                    </div>
                )}
                {template?.businessPhone && (
                    <div className="text-xs">
                        {template.businessPhone}
                    </div>
                )}
                {template?.businessEmail && (
                    <div className="text-xs mb-2">
                        {template.businessEmail}
                    </div>
                )}
            </div>

            <h2 className="text-xl font-bold text-center mb-1">
                {template?.header || "Your Receipt"}
            </h2>

            <div className="text-xs">
                <div className="text-center mb-1">
                    {formattedDate}
                </div>
                <div className="mb-1 text-center">
                    Receipt ID: {receipt.receiptId}
                </div>

                <table className="w-full mb-1">
                    <tbody>
                        {receipt.items.map((item) => {
                            const isCustom = item.isCustom;
                            const customNote = isCustom ? '(Custom Item)' : '';

                            return (
                                <tr key={item.id}>
                                    <td className="py-0">
                                        {item.qty}x {item.name} {customNote}
                                        {item.warranty && (
                                            <span className="ml-1">
                                                (Warranty: {item.warranty})
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-right py-0">
                                        {currency?.symbol}{(item.price * item.qty).toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="border-t pt-1 space-y-0.5">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{currency?.symbol}{receipt.subtotal.toFixed(2)}</span>
                    </div>
                    {Object.entries(taxByRate || {}).map(([rate, taxAmount]) => {
  // Look up VAT details using the tax rate value.
  const vatRates = JSON.parse(localStorage.getItem('vatRates')) || [];
  const vatRate = vatRates.find(r => r.rate.toString() === rate) || { description: rate, rate: rate };
  return (
    <div className="flex justify-between" key={rate}>
      <span>Tax ({vatRate.description} - {vatRate.rate}%):</span>
      <span>{currency?.symbol}{taxAmount.toFixed(2)}</span>
    </div>
  );
})}

                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{currency?.symbol}{receipt.total.toFixed(2)}</span>
                    </div>
                    {receipt.change > 0 && (
                        <div className="flex justify-between text-blue-600">
                            <span>Change:</span>
                            <span>{currency?.symbol}{receipt.change.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="pt-1 text-xs">
                        Payment: {receipt.paymentMethods.join(', ')}
                    </div>
                </div>

                {receipt.refunds && receipt.refunds.length > 0 && (
                    <div className="border-t pt-1">
                        <h3 className="font-bold mb-1">Refunds</h3>
                        {receipt.refunds.map((refund, index) => (
                            <div key={index} className="text-xs mb-2">
                                <div className="flex justify-between">
                                    <span>Refund #{index + 1} ({new Date(refund.date).toLocaleDateString()}):</span>
                                    <span className="text-red-600">
                                        -{currency?.symbol}{refund.refundTotal.toFixed(2)}
                                    </span>
                                </div>
                                <ul className="pl-4 mt-1">
                                    {refund.items && refund.items.map(item => ( // Safe navigation here
                                        <li key={item.id} className="flex justify-between">
                                            <span>
                                                {item.refundQty}x {item.name}
                                                {item.isCustom && ' (Custom)'}
                                                {!item.restock && ' (No Restock)'}
                                            </span>
                                            <span>-{currency?.symbol}{(item.price * item.refundQty).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-1 text-center">
                    Thank you for your business!
                </div>
                {template?.footer && (
                    <div className="mt-1 text-center text-xs">
                        {template.footer}
                    </div>
                )}
                {template?.terms && (
                    <div className="mt-1 text-center text-xs">
                        {template.terms}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Receipt;