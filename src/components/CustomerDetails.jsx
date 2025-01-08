import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail } from "lucide-react";

const CustomerDetails = () => {
     const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [communicationLogs, setCommunicationLogs] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
       const fetchCustomerDetails = async () => {
           setLoading(true);
           setError(null);
            try {
                const response = await axios.get(`http://localhost:8000/api/customers/${customerId}/`);
                 setCustomer(response.data);
                setCommunicationLogs(response.data.communication_logs);
            } catch (err) {
                 console.error("Error fetching customer details:", err);
                 setError("Error loading customer. Please check the console.")
            } finally {
               setLoading(false)
             }
        };
        fetchCustomerDetails();
    }, [customerId]);

     const handleBack = () => {
          navigate('/customers')
     }

    if (loading) {
        return <div className="flex items-center justify-center h-40">
              <div className="relative w-20 h-5 rounded bg-gray-200 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-gray-300 w-full animate-shimmer">
                  </div>
              </div>
          </div>;
    }
    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }
    if(!customer) {
        return <div>Customer not found</div>
    }

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
               <button onClick={handleBack} className="p-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 flex items-center" aria-label="Back to Customers">
                    <ArrowLeft size={20} className="mr-1"/>
                    <span>Back</span>
               </button>
              <h2 className="text-2xl font-bold ml-4">{customer.firstName} {customer.lastName}</h2>
            </div>

            <div className="bg-white shadow rounded p-4 mb-4">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">Customer Details</h3>
                        <div className="flex">
                             <Link to={`/customers/edit/${customer.id}`} className="text-blue-500 hover:text-blue-700 mr-2" aria-label="Edit Customer">
                                <Edit size={16}/>
                            </Link>
                            <button className="text-red-500 hover:text-red-700 mr-2" aria-label="Delete Customer">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium">Company Number: {customer.companyNumber || "N/A"}</p>
                        <p className="font-medium">Company Name: {customer.companyName}</p>
                       <p className="font-medium">Email: {customer.email}</p>
                         <p className="font-medium">Phone: {customer.phone}</p>
                    </div>
                    <div>
                        <p className="font-medium">Street: {customer.street}</p>
                        <p className="font-medium">Postal Code: {customer.postalCode}</p>
                        <p className="font-medium">City: {customer.city}</p>
                        <p className="font-medium">Country: {customer.country}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded p-4">
                 <h3 className="text-xl font-medium flex items-center justify-between mb-4">
                     Communication Logs
                      <button className="text-green-500 hover:text-green-700" aria-label="Send Email">
                               <Mail size={16} />
                          </button>
                 </h3>
                {communicationLogs.length === 0 ? (
                    <p>No communication logs.</p>
                    ) : (
                    <ul>
                       {communicationLogs.map((log) => (
                            <li key={log.id} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0">
                                <div className="text-sm text-gray-600">
                                    {new Date(log.timestamp).toLocaleString()}
                               </div>
                                <div className="font-medium">{log.type}</div>
                                  <div>
                                    {log.content}
                                </div>
                            </li>
                         ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CustomerDetails;