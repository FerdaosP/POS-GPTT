import React from 'react';
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
    import './Dashboard.css';

    const Dashboard = () => {
        return (
            <div className="dashboard-container">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <p>Total Revenue</p>
                            <TrendingUp size={20} />
                        </div>
                        <div className="card-body">
                            <p className="card-value">$24,563.00</p>
                            <p className="card-percentage">+12.5% vs. last month</p>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-header">
                            <p>Outstanding Invoices</p>
                            <List size={20} />
                        </div>
                        <div className="card-body">
                            <p className="card-value">$8,234.00</p>
                            <p className="card-percentage">-2.3% 12 invoices pending</p>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-header">
                            <p>Active Customers</p>
                            <User size={20} />
                        </div>
                        <div className="card-body">
                            <p className="card-value">324</p>
                            <p className="card-percentage">+5.2% Last 30 days</p>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-header">
                            <p>Pending Repairs</p>
                            <Sun size={20} />
                        </div>
                        <div className="card-body">
                            <p className="card-value">42</p>
                            <p className="card-percentage">+8.1% In progress</p>
                        </div>
                    </div>
                </div>
                <div className="dashboard-content">
                    <div className="dashboard-activity">
                        <div className="activity-header">
                            <h2>Recent Activity</h2>
                            <Bell size={20} />
                        </div>
                        <div className="activity-item">
                            <p>New invoice created</p>
                            <p className="activity-details">Invoice #1234 for John Doe</p>
                            <p className="activity-time">5 minutes ago</p>
                            <span className="activity-tag new">New</span>
                        </div>
                        <div className="activity-item">
                            <p>Repair status updated</p>
                            <p className="activity-details">iPhone 12 repair completed</p>
                            <p className="activity-time">10 minutes ago</p>
                            <span className="activity-tag completed">Completed</span>
                        </div>
                        <div className="activity-item">
                            <p>Payment received</p>
                            <p className="activity-details">Invoice #1232 paid by Sarah Smith</p>
                            <p className="activity-time">30 minutes ago</p>
                            <span className="activity-tag success">Success</span>
                        </div>
                    </div>
                    <div className="dashboard-status">
                        <h2>Status Overview</h2>
                        <div className="status-charts">
                            <div className="status-chart">
                                <h3>Invoice Status</h3>
                                <div className="chart-placeholder"></div>
                                <div className="chart-legend">
                                    <span className="legend-item paid">Paid</span>
                                    <span className="legend-item sent">Sent</span>
                                    <span className="legend-item overdue">Overdue</span>
                                    <span className="legend-item draft">Draft</span>
                                </div>
                            </div>
                            <div className="status-chart">
                                <h3>Repair Status</h3>
                                <div className="chart-placeholder"></div>
                                <div className="chart-legend">
                                    <span className="legend-item received">Received</span>
                                    <span className="legend-item in-progress">In Progress</span>
                                    <span className="legend-item completed">Completed</span>
                                    <span className="legend-item delivered">Delivered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-actions">
                    <Link to="/invoices" className="dashboard-action">
                        <FileText size={32} />
                        <p>Create Invoice</p>
                        <p className="action-description">Generate a new invoice</p>
                    </Link>
                    <Link to="/customers" className="dashboard-action">
                        <Users size={32} />
                        <p>Add Customer</p>
                        <p className="action-description">Register a new customer</p>
                    </Link>
                    <Link to="/new-repair" className="dashboard-action">
                        <Wrench size={32} />
                        <p>New Repair Ticket</p>
                        <p className="action-description">Create a repair ticket</p>
                    </Link>
                    <Link to="/invoices" className="dashboard-action">
                        <FileText size={32} />
                        <p>View Invoices</p>
                        <p className="action-description">See all invoices</p>
                    </Link>
                    <Link to="/repairs" className="dashboard-action">
                        <Wrench size={32} />
                        <p>View Repairs</p>
                        <p className="action-description">See all repair tickets</p>
                    </Link>
                </div>
            </div>
        );
    };

    export default Dashboard;
