// /src/utils/csvUtils.js

/**
 * Exports the provided inventory data as a CSV file.
 * @param {Array} inventory - Array of inventory item objects.
 */
export const exportInventoryToCSV = (inventory) => {
    const headers = [
      'ID',
      'Name',
      'Price',
      'Quantity',
      'Barcode',
      'Vendor ID',
      'Low Stock Threshold'
    ];
    
    const rows = inventory.map(item => [
      item.id,
      `"${item.name}"`, // Enclose in quotes to handle commas in names
      item.price,
      item.quantity_on_hand,
      item.barcode || '',
      item.vendor_id || '',
      item.low_stock_threshold
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  