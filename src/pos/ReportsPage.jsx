import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { ArrowLeft } from 'lucide-react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Receipt from './Receipt';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ActionButton = ({ children, ...props }) => (
  <button
    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
    {...props}
  >
    {children}
  </button>
);

const SalesChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Daily Sales',
        data: data.map(d => d.total),
        borderColor: '#047857',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Line data={chartData} options={options} />;
};

const DateFilter = ({ onChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (startDate && endDate) {
      onChange({ start: startDate, end: endDate });
    }
  }, [startDate, endDate, onChange]);

  const handleQuickFilter = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case 'today':
        start = new Date(today);
        end = new Date(today);
        break;
      case 'thisWeek':
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        end = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        start = null;
        end = null;
    }

    setDateRange([start, end]);
    onChange({ start, end });
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleQuickFilter('today')}
          className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          Today
        </button>
        <button
          onClick={() => handleQuickFilter('thisWeek')}
          className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          This Week
        </button>
        <button
          onClick={() => handleQuickFilter('thisMonth')}
          className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          This Month
        </button>
      </div>
      <ReactDatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        isClearable
        placeholderText="Select date range"
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

const ReportsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
    setTransactions(saved);
  }, []);

  const dailySales = useMemo(() => {
    const filtered = transactions.filter(t => {
      const date = new Date(t.date);
      return (
        (!dateRange.start || date >= dateRange.start) &&
        (!dateRange.end || date <= dateRange.end)
      );
    });

    const grouped = filtered.reduce((acc, t) => {
      const dateStr = new Date(t.date).toLocaleDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          total: 0,
          tax: 0,
          transactions: []
        };
      }
      acc[dateStr].total += t.total;
      acc[dateStr].tax += t.tax;
      acc[dateStr].transactions.push(t);
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const handleExport = () => {
    const csvContent = [
      ['Receipt ID', 'Date', 'Total Sales', 'Tax', 'Net', 'Payment Methods', 'Items', 'Warranties'],
      ...transactions.map(t => [
        t.receiptId,
        new Date(t.date).toISOString(),
        t.total.toFixed(2),
        t.tax.toFixed(2),
        (t.total - t.tax).toFixed(2),
        t.paymentMethods.join('; '),
        t.items.map(i => `${i.name} (x${i.qty})`).join('; '),
        t.items.filter(i => i.warranty).map(i => i.warranty).join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-teal-600 hover:text-teal-700 flex items-center">
            <ArrowLeft className="mr-1" size={20} />
            Back to POS
          </Link>
          <h1 className="text-2xl font-bold">Sales Reports</h1>
          <div className="flex-1" />
          <ActionButton onClick={handleExport}>Export CSV</ActionButton>
        </div>

        <DateFilter onChange={setDateRange} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Receipts</div>
            <div className="text-2xl font-bold">
              {transactions.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Sales</div>
            <div className="text-2xl font-bold">
              ${dailySales.reduce((sum, d) => sum + d.total, 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Tax</div>
            <div className="text-2xl font-bold">
              ${dailySales.reduce((sum, d) => sum + d.tax, 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Net Income</div>
            <div className="text-2xl font-bold">
              ${dailySales.reduce((sum, d) => sum + (d.total - d.tax), 0).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-bold mb-4">Sales Trend</h3>
          <SalesChart data={dailySales} />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Date</th>
                <th className="px-4 py-2 text-right text-sm">Total Sales</th>
                <th className="px-4 py-2 text-right text-sm">Tax</th>
                <th className="px-4 py-2 text-right text-sm">Net</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.map(day => (
                <tr
                  key={day.date}
                  className="hover:bg-gray-50 cursor-pointer border-t"
                  onClick={() => setSelectedDay(day)}
                >
                  <td className="px-4 py-2 text-sm">{day.date}</td>
                  <td className="px-4 py-2 text-right text-sm">${day.total.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-sm">${day.tax.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-sm">${(day.total - day.tax).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDay && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  Transactions on {selectedDay.date}
                </h3>
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="divide-y">
                {selectedDay.transactions.map(t => (
                  <div
                    key={t.receiptId}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedReceipt(t)}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">Receipt {t.receiptId}</div>
                      <div className="text-gray-600">
                        ${t.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(t.date).toLocaleTimeString()} · {t.items.length} items
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReceipt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">Receipt Details</h3>
                <button 
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <Receipt receipt={selectedReceipt} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;