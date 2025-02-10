import React, { useState } from "react"; // Import useState
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import POSInterface from "./pos/POSInterface";
import ReportsPage from "./pos/ReportsPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import RepairDashboard from "./repairtickets/RepairDashboard";
import RepairDetailPage from "./repairtickets/RepairDetailPage";
import CustomerDashboard from "./customers/CustomerDashboard"; // Import the new CustomerDashboard
import CustomerDetailPage from "./customers/CustomerDetailPage"; // Import the new CustomerDetailPage (if applicable)

const AppContent = () => {
    const location = useLocation();
    const isPOSRoute = location.pathname.startsWith('/pos');
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('posCurrency');
        return saved ? JSON.parse(saved) : { code: 'USD', symbol: '$' };
    });

    return (
        <div className="min-h-screen flex flex-col">
            {!isPOSRoute && <Sidebar />}

            <main className={`flex-1 ${!isPOSRoute ? 'mt-14' : ''}`}>
                <div className="h-full w-full">
                    <Routes>
                        <Route path="/" element={<Dashboard currency={currency} />} />
                        <Route path="/dashboard" element={<Dashboard currency={currency} />} />
                        <Route path="/pos/*" element={<POSInterface currency={currency} />} />
                        <Route path="/reports" element={<ReportsPage currency={currency} />} />
                        <Route path="/repairs" element={<RepairDashboard />} />
                        <Route path="/repairs/:repairId" element={<RepairDetailPage />} />
                        <Route path="/customers" element={<CustomerDashboard />} /> {/* Add CustomerDashboard route */}
                        <Route path="/customers/:customerId" element={<CustomerDetailPage />} /> {/* Add CustomerDetailPage route (if applicable) */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;