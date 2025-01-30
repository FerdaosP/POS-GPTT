import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import POSInterface from "./pos/POSInterface";
import ReportsPage from "./pos/ReportsPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const location = useLocation();
  const isPOSRoute = location.pathname.startsWith('/pos');

  return (
    <div className="min-h-screen flex flex-col">
      {!isPOSRoute && <Sidebar />}

      <main className={`flex-1 ${!isPOSRoute ? 'mt-14' : ''}`}>
        <div className="h-full w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos/*" element={<POSInterface />} />
            <Route path="/reports" element={<ReportsPage />} />
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