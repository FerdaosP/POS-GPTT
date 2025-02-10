import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, LayoutDashboard, FileText, Settings, Users, Package, Wrench } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { 
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { 
      name: "Reports",
      path: "/reports",
      icon: <FileText size={18} />,
    },
    { 
      name: "Inventory",
      path: "/inventory",
      icon: <Package size={18} />,
    },
    { 
      name: "Customers",
      path: "/customers",
      icon: <Users size={18} />,
    },
    { 
      name: "Repairs",
      path: "/repairs",
      icon: <Wrench size={18} />,
    },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 right-0 h-14 bg-gray-900 border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="bg-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white">R</span>
          <span className="text-lg font-semibold text-white">Repair Point</span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex items-center gap-1 ml-6 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith(item.path)
                  ? "bg-teal-600/20 text-teal-400"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* POS Button */}
        <Link
          to="/pos"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            location.pathname.startsWith("/pos")
              ? "bg-teal-600/20 text-teal-400"
              : "text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
          }`}
          style={{ marginLeft: 'auto', marginRight: '16px', backgroundColor: '#4F46E5', color: 'white' }}
        >
          <ShoppingCart size={18} />
          <span>POS</span>
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
        >
          <Settings size={18} />
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;