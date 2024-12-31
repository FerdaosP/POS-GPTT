// Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white h-screen">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Menu</h2>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <LayoutDashboard className="mr-2" size={16} /> Dashboard
                        </Link>
                    </li>
                      <li>
                        <Link
                            to="/invoices"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <FileText className="mr-2" size={16} /> Invoices
                        </Link>
                    </li>
                       <li>
                            <Link
                                to="/invoices/settings"
                                className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                            >
                                 <Settings className="mr-2" size={16} /> Payment Settings
                            </Link>
                        </li>
                    <li>
                        <Link
                            to="/customers"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <Users className="mr-2" size={16} /> Customers
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/repairs"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <Wrench className="mr-2" size={16} /> Repairs
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/new-repair"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <FilePlus className="mr-2" size={16} /> New Repair Entry
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/inventory"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <Package className="mr-2" size={16} /> Inventory
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/reports"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <FileBarChart className="mr-2" size={16} /> Reports
                        </Link>
                    </li>
                     <li>
                        <Link
                            to="/pos"
                            className="flex items-center hover:text-blue-400 px-2 py-1 rounded"
                        >
                            <ShoppingCart className="mr-2" size={16} /> Point of Sale
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;