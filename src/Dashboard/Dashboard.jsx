import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Wrench,
    FilePlus,
    Package,
    FileText,
    FileBarChart,
    ShoppingCart,
    Settings,
    TrendingUp,
    TrendingDown,
    User,
    List,
    Sun,
    Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Mock dashboard data
         const mockMetrics = {
                totalRevenue: "1500.50",
                revenueChange: 2.5,
                outstandingInvoices: "300",
                 outstandingChange: -1.2,
              pendingInvoiceCount: 20,
                activeCustomerCount: 120,
                customerChange: 5,
                 pendingRepairCount: 15,
                 repairChange: -3,
            }
            const mockActivity = [
                {
                    time: new Date().toISOString(),
                    message: "New invoice created",
                    details: "Invoice #1234 for customer John Doe created.",
                },
              {
                    time: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(),
                   message: "Customer updated",
                  details: "Customer Jane Smith updated details."
              },
              {
                  time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
                   message: "New repair ticket",
                   details: "Ticket #REP-2024-123 for iPhone 13"
               }
            ]


        setTimeout(() => {
            setMetrics(mockMetrics);
            setActivity(mockActivity)
           setLoading(false);
       }, 500);
    }, []);


    if (loading) {
        return <div className="flex items-center justify-center h-40">
              <div className="relative w-20 h-5 rounded bg-gray-200 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-gray-300 w-full animate-shimmer">
                  </div>
              </div>
          </div>
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                        <p className="font-medium">Total Revenue</p>
                        <TrendingUp size={20} />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold mb-1">${metrics?.totalRevenue || '0.00'}</p>
                        {metrics?.revenueChange !== undefined && (
                            <p className="text-sm text-gray-500">
                                {metrics.revenueChange > 0 ? "+" : ""}{metrics.revenueChange}% vs. last month
                            </p>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                        <p className="font-medium">Outstanding Invoices</p>
                        <List size={20} />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold mb-1">${metrics?.outstandingInvoices || '0.00'}</p>
                        {metrics?.outstandingChange !== undefined && (
                            <p className="text-sm text-gray-500">
                                {metrics.outstandingChange > 0 ? "+" : ""}{metrics.outstandingChange}% {metrics?.pendingInvoiceCount || 0} invoices pending
                            </p>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                        <p className="font-medium">Active Customers</p>
                        <User size={20} />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold mb-1">{metrics?.activeCustomerCount || '0'}</p>
                        {metrics?.customerChange !== undefined && (
                            <p className="text-sm text-gray-500">
                                {metrics.customerChange > 0 ? "+" : ""}{metrics.customerChange}% Last 30 days
                            </p>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                        <p className="font-medium">Pending Repairs</p>
                        <Sun size={20} />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold mb-1">{metrics?.pendingRepairCount || '0'}</p>
                        {metrics?.repairChange !== undefined && (
                            <p className="text-sm text-gray-500">
                                {metrics.repairChange > 0 ? "+" : ""}{metrics.repairChange}% in progress
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="font-semibold mb-2 flex items-center justify-between">
                        Recent Activity
                        <Bell size={20} />
                    </h2>
                    {activity.length === 0 ? (
                        <p className="text-gray-500">No recent activity.</p>
                    ) : (
                        <ul>
                            {activity.map((item, index) => (
                                <li key={index} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0">
                                    <p className="font-medium">{item.message}</p>
                                    <p className="text-gray-500 text-sm">{new Date(item.time).toLocaleString()}</p>
                                    <p className="text-gray-500 text-sm">{item.details}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="font-semibold mb-2">Status Overview</h2>
                    <div className="flex justify-around mt-4">
                        <div className="text-center">
                            <h3 className="font-medium">Invoice Status</h3>
                            <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-2">
                            </div>
                            <div className="flex flex-wrap justify-center gap-1 text-xs">
                                <span className="bg-red-100 text-red-800 rounded px-2 py-1">Paid</span>
                                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1">Sent</span>
                                <span className="bg-gray-100 text-gray-800 rounded px-2 py-1">Overdue</span>
                                <span className="bg-yellow-100 text-yellow-800 rounded px-2 py-1">Draft</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-medium">Repair Status</h3>
                            <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-2">
                            </div>
                            <div className="flex flex-wrap justify-center gap-1 text-xs">
                                <span className="bg-red-100 text-red-800 rounded px-2 py-1">Received</span>
                                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1">In Progress</span>
                                <span className="bg-gray-100 text-gray-800 rounded px-2 py-1">Completed</span>
                                <span className="bg-yellow-100 text-yellow-800 rounded px-2 py-1">Delivered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex justify-around flex-wrap gap-4">
                <Link to="/invoices" className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center gap-2 hover:shadow-lg transition duration-200" aria-label="Create Invoice">
                    <FileText size={32} />
                    <p>Create Invoice</p>
                    <p className="text-sm text-gray-500">Generate a new invoice</p>
                </Link>
                <Link to="/customers" className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center gap-2 hover:shadow-lg transition duration-200" aria-label="Add Customer">
                    <Users size={32} />
                    <p>Add Customer</p>
                    <p className="text-sm text-gray-500">Register a new customer</p>
                </Link>
                <Link to="/new-repair" className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center gap-2 hover:shadow-lg transition duration-200" aria-label="New Repair Ticket">
                    <Wrench size={32} />
                    <p>New Repair Ticket</p>
                    <p className="text-sm text-gray-500">Create a repair ticket</p>
                </Link>
                <Link to="/invoices" className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center gap-2 hover:shadow-lg transition duration-200" aria-label="View Invoices">
                    <FileText size={32} />
                    <p>View Invoices</p>
                    <p className="text-sm text-gray-500">See all invoices</p>
                </Link>
                <Link to="/repairs" className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center gap-2 hover:shadow-lg transition duration-200" aria-label="View Repairs">
                    <Wrench size={32} />
                    <p>View Repairs</p>
                    <p className="text-sm text-gray-500">See all repair tickets</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;