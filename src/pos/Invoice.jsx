// /src/pos/Invoice.jsx
import React from 'react';
import { format } from 'date-fns';

const Invoice = ({ invoice, template, currency, taxByRate }) => {
  // Dates: if not provided, use the current date.
  const invoiceDate = invoice.invoiceDate
    ? format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')
    : format(new Date(), 'dd/MM/yyyy');
  // Leveringsdatum / datum van prestaties is set to today.
  const deliveryDate = format(new Date(), 'dd/MM/yyyy');

  // Use the provided unique invoice number or fallback.
  const invoiceNumber = invoice.invoiceNumber || `INV-${Date.now()}`;
  
  // Payment terms come from the checkout process.
  const paymentTerms = invoice.paymentTerms || "Betaling binnen 30 dagen";

  // If the customer is tax exempt then display “btw verlegd”.
  const taxNote = invoice.taxExempt ? "btw verlegd" : "";

  return (
    <div className="invoice-container p-4 bg-white" style={{ width: '800px', fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">FACTUUR</h1>
      </div>

      {/* Business and Invoice Details */}
      <div className="mb-4">
        <div className="flex justify-between">
          {/* Business Information */}
          <div>
            <h2 className="font-bold text-lg">{template.businessName}</h2>
            <p>{template.businessAddress}</p>
            <p>{template.businessPhone}</p>
            <p>{template.businessEmail}</p>
            <p>Bankrekeningnummer: {template.bankAccount}</p>
            <p>BTW-/ondernemingsnummer: {template.vatNumber}</p>
            <p>Plaats van opmaak: {template.placeOfIssuance}</p>
          </div>
          {/* Invoice Meta Data */}
          <div className="text-right">
            <p><strong>Factuurnummer:</strong> {invoiceNumber}</p>
            <p><strong>Factuurdatum:</strong> {invoiceDate}</p>
            <p><strong>Leveringsdatum / Datum van prestaties:</strong> {deliveryDate}</p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-4">
        <h3 className="font-bold">Klantgegevens</h3>
        <p>{invoice.customerName}</p>
        <p>{invoice.customerAddress}</p>
      </div>

      {/* Invoice Items Table */}
      <div className="mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Omschrijving</th>
              <th className="border p-2">Aantal</th>
              <th className="border p-2">Prijs (excl. btw)</th>
              <th className="border p-2">BTW (%)</th>
              <th className="border p-2">BTW-bedrag</th>
              <th className="border p-2">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              // Assume item.price is stored as the net price (excl. VAT)
              const netPrice = item.price;
              const taxPercentage = item.taxPercentage || 0;
              const taxPerUnit = netPrice * (taxPercentage / 100);
              const lineTaxTotal = taxPerUnit * item.quantity;
              const lineTotal = (netPrice + taxPerUnit) * item.quantity;
              return (
                <tr key={index}>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-right">{item.quantity}</td>
                  <td className="border p-2 text-right">
                    {currency.symbol}{netPrice.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">{taxPercentage}%</td>
                  <td className="border p-2 text-right">
                    {currency.symbol}{lineTaxTotal.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">
                    {currency.symbol}{lineTotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-4 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between">
            <span>Subtotaal:</span>
            <span>{currency.symbol}{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Totaal BTW:</span>
            <span>{currency.symbol}{invoice.totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Totaal:</span>
            <span>{currency.symbol}{invoice.total.toFixed(2)}</span>
          </div>
          {taxNote && (
            <div className="mt-2 text-xs italic">
              {taxNote}
            </div>
          )}
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mb-4">
        <p><strong>Betalingscondities:</strong> {paymentTerms}</p>
      </div>

      {/* Optional Footer */}
      {template.footer && (
        <div className="text-center mt-4 text-xs">
          {template.footer}
        </div>
      )}
    </div>
  );
};

export default Invoice;
