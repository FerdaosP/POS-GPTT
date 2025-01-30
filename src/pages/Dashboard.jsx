// File: /src/pages/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Package, DollarSign, Users, Activity, 
  ArrowUpRight, BarChart, CalendarClock, Star, TrendingUp 
} from "lucide-react";
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
  const inventoryItems = JSON.parse(localStorage.getItem('inventory_items') || '[]');
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');

  // Enhanced metrics calculation
  const metrics = useMemo(() => {
    const now = new Date();
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    
    return {
      totalSales: transactions.reduce((sum, t) => sum + t.total, 0),
      avgTransaction: transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + t.total, 0) / transactions.length 
        : 0,
      lowStockItems: inventoryItems.filter(item => item.quantity_on_hand < 5),
      newCustomers: customers.filter(c => 
        new Date(c.createdAt) > lastWeek
      ).length,
      topProducts: transactions
        .flatMap(t => t.items)
        .reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + item.qty;
          return acc;
        }, {}),
    };
  }, [transactions, inventoryItems, customers]);

  // Sales data for chart
  const salesData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    return {
      labels: days,
      datasets: [{
        label: 'Sales',
        data: days.map(day => 
          transactions.filter(t => 
            new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }) === day
          ).reduce((sum, t) => sum + t.total, 0)
        ),
        borderColor: '#059669',
        tension: 0.4,
      }]
    };
  }, [transactions, timeFilter]);

  // Top customers calculation
  const topCustomers = useMemo(() => 
    customers
      .sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0))
      .slice(0, 5),
    [customers]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            icon={DollarSign}
            title="Total Sales"
            value={metrics.totalSales.toFixed(2)}
            change="+2.4%"
            color="from-green-50 to-green-100"
          />
          <MetricCard 
            icon={Package}
            title="Low Stock Items"
            value={metrics.lowStockItems.length}
            change="-1.2%"
            color="from-red-50 to-red-100"
          />
          <MetricCard 
            icon={Users}
            title="New Customers"
            value={metrics.newCustomers}
            change="+5.1%"
            color="from-blue-50 to-blue-100"
          />
          <MetricCard 
            icon={Activity}
            title="Avg. Transaction"
            value={metrics.avgTransaction.toFixed(2)}
            change="+3.8%"
            color="from-purple-50 to-purple-100"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Sales Overview</h2>
              <div className="flex gap-2">
                {['week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      timeFilter === period 
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <Line 
              data={salesData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1F2937',
                    titleColor: '#F9FAFB',
                    bodyColor: '#F9FAFB',
                    borderColor: '#374151',
                    borderWidth: 1,
                  }
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { 
                    grid: { color: '#F3F4F6' },
                    beginAtZero: true 
                  }
                }
              }}
            />
          </div>

          {/* Top Customers */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Top Customers</h2>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-medium">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={16} />
                    <span className="font-medium">{customer.loyaltyPoints?.toFixed(0) || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.slice(-5).reverse().map(transaction => (
                <div key={transaction.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <div className="font-medium">#{transaction.receiptId}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold">
                      ${transaction.total.toFixed(2)}
                    </div>
                    <ArrowUpRight className="text-green-600" size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Inventory Alerts</h2>
            <div className="space-y-3">
              {metrics.lowStockItems.slice(0, 5).map(item => (
                <div key={item.sku} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">SKU: {item.sku}</div>
                  </div>
                  <div className="text-red-700 font-medium">
                    {item.quantity_on_hand} left
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Performance</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Conversion Rate</span>
                  <TrendingUp className="text-green-600" size={16} />
                </div>
                <div className="text-2xl font-bold">8.2%</div>
                <div className="text-sm text-green-600">+1.5% from last month</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Avg. Repair Time</span>
                  <CalendarClock className="text-blue-600" size={16} />
                </div>
                <div className="text-2xl font-bold">2.4h</div>
                <div className="text-sm text-red-600">-0.3h from last week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, title, value, change, color }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-xl transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start">
      <div>
        <div className="text-sm text-gray-600 mb-1">{title}</div>
        <div className="text-2xl font-bold">${value}</div>
      </div>
      <div className="p-3 bg-white rounded-lg shadow-sm">
        <Icon className="w-6 h-6 text-teal-600" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className={`px-2 py-1 rounded-full ${
        change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {change}
      </span>
      <span className="text-gray-600">vs. previous period</span>
    </div>
  </div>
);

export default Dashboard;