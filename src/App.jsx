// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CustomerList from "./components/CustomerList";
import NewRepairEntry from "./reparatiekaart/NewRepairEntry";

const App = () => {
    const [customers, setCustomers] = useState([]);
    const [transactionData, setTransactionData] = useState({
        items: [],
    });

    const handleSaveCustomer = (customer) => {
        if (customer.id) {
            setCustomers((prevCustomers) =>
                prevCustomers.map((c) => (c.id === customer.id ? customer : c))
            );
        } else {
            const newCustomer = { ...customer, id: Date.now() };
            setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
        }
    };

    const handleDeleteCustomer = (customerId) => {
        setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer.id !== customerId)
        );
    };


    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="w-3/4 p-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="/invoices" replace />} />
                        <Route
                            path="/customers"
                            element={
                                <CustomerList
                                    customers={customers}
                                    onSaveCustomer={handleSaveCustomer}
                                    onDeleteCustomer={handleDeleteCustomer}
                                />
                            }
                        />
                        <Route
                            path="/new-repair"
                            element={<NewRepairEntry />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;