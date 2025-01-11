import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CustomerList from "./components/CustomerList";
import NewRepairEntry from "./reparatiekaart/NewRepairEntry";
import InvoiceListEntry from "./invoicing/InvoiceListEntry";
import SettingsForm from "./components/SettingsForm";
import axios from 'axios';
import Dashboard from "./Dashboard/Dashboard";
import CustomerDetails from "./components/CustomerDetails";
import CustomerForm from "./components/CustomerForm";
import POS from "./pos/POS";
import Inventory from "./inventory/InventoryEntry"

const App = () => {
    const [companyInfo, setCompanyInfo] = useState({
        companyName: "",
        address: "",
        phoneNumber: "",
        email: "",
        vatNumber: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:8000");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                // Use the dynamic API base URL here
                const response = await axios.get(`${apiBaseUrl}/api/profile/1/`);
                if (response.data) {
                    setCompanyInfo(response.data);
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    try {
                        const createResponse = await axios.post(`${apiBaseUrl}/api/profile/`, {
                            companyName: "Your Company Name",
                            address: "Your Company Address",
                            phoneNumber: "",
                            email: "company@email.com",
                            vatNumber: ""
                        });
                        if (createResponse.data) {
                            setCompanyInfo(createResponse.data);
                        } else {
                            setError(`There was an error creating default profile: ${createResponse.statusText}`);
                        }
                    } catch (createError) {
                        setError(`There was an error creating default profile: ${createError.message}`);
                        console.error('There was an error creating default profile:', createError);
                    }
                    console.warn('No profile found, creating a default one');
                } else {
                    console.error('There was an error getting profile data:', err);
                    setError(`There was an error getting profile data: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        const determineApiUrl = () => {
            // Check if the app is running on localhost or on a local network
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (isLocal) {
                setApiBaseUrl("http://localhost:8000");
            } else {
                // Get the URL and replace the port for local network
                const localNetworkAddress = window.location.origin.replace(':5173', ':8000');
                setApiBaseUrl(localNetworkAddress);
            }
            console.log("API Base URL:", apiBaseUrl); // Debugging: Log the API base URL
        };

        determineApiUrl();
        fetchProfile();
    }, [apiBaseUrl]);

    const handleSaveCompanyInfo = (settings) => {
        setCompanyInfo(settings);
    };

    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="w-3/4 p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="relative w-20 h-5 rounded bg-gray-200 overflow-hidden">
                                <div className="absolute left-0 top-0 h-full bg-gray-300 w-full animate-shimmer">
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <p className="text-red-500">Error loading profile data: {error}</p>
                    ) : (
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route
                                path="/invoices"
                                element={<InvoiceListEntry companyInfo={companyInfo} />}
                            />
                            <Route
                                path="/customers"
                                element={<CustomerList />}
                            />
                            <Route
                                path="/customers/:customerId"
                                element={<CustomerDetails />}
                            />
                            <Route
                                path="/customers/edit/:customerId"
                                element={<CustomerForm />}
                            />
                            <Route
                                path="/customers/add"
                                element={<CustomerForm />}
                            />
                            <Route
                                path="/repair-tickets"
                                element={<NewRepairEntry companyInfo={companyInfo} />}
                            />
                            <Route
                                path="/pos"
                                element={<POS />}
                            />
                            <Route
                                path="/invoices/settings"
                                element={<SettingsForm initialSettings={companyInfo} onSave={handleSaveCompanyInfo} />}
                            />
                            <Route path="/inventory" 
                            element={<Inventory/>} />
                                
                            <Route path="/reports" element={<p>Reports</p>} />
                        </Routes>
                    )}
                </div>
            </div>
        </Router>
    );
};

export default App;