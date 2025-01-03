// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CustomerList from "./components/CustomerList";
import NewRepairEntry from "./reparatiekaart/NewRepairEntry";
import InvoiceListEntry from "./invoicing/InvoiceListEntry";
import SettingsForm from "./components/SettingsForm"
import axios from 'axios';


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

    useEffect(() => {
        const fetchProfile = async () => {
           setLoading(true);
             setError(null);
             try {
                 const response = await axios.get('http://localhost:8000/api/profile/1/');
                 if(response.data){
                   setCompanyInfo(response.data);
                 }
               } catch (err) {
                 if (err.response && err.response.status === 404) {
                     try {
                      const createResponse =  await axios.post('http://localhost:8000/api/profile/', {
                            companyName: "Your Company Name",
                            address: "Your Company Address",
                            phoneNumber: "",
                            email: "company@email.com",
                            vatNumber: ""
                            });
                       if(createResponse.data) {
                        setCompanyInfo(createResponse.data)
                       } else{
                         setError(`There was an error creating default profile: ${createResponse.statusText}`);
                       }
                      } catch (createError){
                        setError(`There was an error creating default profile: ${createError.message}`)
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
           fetchProfile();
       }, []);
     const handleSaveCompanyInfo = (settings) => {
            setCompanyInfo(settings);
      };

    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="w-3/4 p-4">
                    {loading ? (
                     <p>Loading...</p>
                    ) : error ? (
                        <p>Error loading profile data: {error}</p>
                      ) : (
                          <Routes>
                                <Route path="/" element={<Navigate to="/invoices" replace />} />
                                <Route
                                   path="/invoices"
                                   element={<InvoiceListEntry companyInfo={companyInfo} />}
                                />
                                <Route
                                    path="/customers"
                                    element={
                                        <CustomerList
                                         />
                                    }
                                />
                                 <Route
                                    path="/new-repair"
                                    element={<NewRepairEntry companyInfo={companyInfo} />}
                                />
                                 <Route
                                    path="/invoices/settings"
                                   element={<SettingsForm initialSettings={companyInfo} onSave={handleSaveCompanyInfo} />}
                                />
                                 <Route path="/inventory" element={<p>Inventory</p>} />
                                 <Route path="/reports" element={<p>Reports</p>} />
                                  <Route path="/pos" element={<p>Point of Sale</p>} />
                            </Routes>
                    )}
                </div>
            </div>
        </Router>
    );
};

export default App;