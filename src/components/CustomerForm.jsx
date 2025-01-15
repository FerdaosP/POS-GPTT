import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

const CustomerForm = ({ onSave, onCancel }) => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        companyNumber: "",
        companyName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        postalCode: "",
        city: "",
        country: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(customerId){
            setLoading(true);
            // Mock customer data
           const mockCustomers = [
            {
                id: 1,
                companyNumber: "123456",
                 companyName: "Test Company",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "555-1234",
                street: "123 Main St",
                postalCode: "12345",
                 city: "Anytown",
                country: "USA",
            },
           {
                id: 2,
                 companyNumber: "987654",
                 companyName: "Another Company",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@example.com",
                 phone: "555-5678",
                street: "456 Oak Ave",
                 postalCode: "67890",
                city: "Otherville",
                country: "Canada",
             },
             {
                id: 3,
                  companyNumber: "555555",
                  companyName: "Some Company",
                firstName: "Peter",
                lastName: "Pan",
                email: "peter.pan@example.com",
                 phone: "555-4444",
                 street: "789 Neverland",
                 postalCode: "33333",
                 city: "Neverland",
                country: "Fantasy",
              },
          ];
             const foundCustomer = mockCustomers.find(
                (customer) => customer.id === parseInt(customerId)
               );
            if (foundCustomer) {
               setForm(foundCustomer);
            } else {
               console.warn(`Customer with id ${customerId} not found`);
             }
               setLoading(false);
        }
    }, [customerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
          if (!form.companyNumber.trim()) newErrors.companyNumber = "Company Number is required.";
         if (!form.companyName.trim()) newErrors.companyName = "Company Name is required.";
        if (!form.firstName.trim()) newErrors.firstName = "First Name is required.";
        if (!form.lastName.trim()) newErrors.lastName = "Last Name is required.";
        if (!form.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(form.email)) {
            newErrors.email = "Invalid email format.";
        }
        if (!form.phone.trim()) newErrors.phone = "Phone is required.";
        if (!form.street.trim()) newErrors.street = "Street and Number are required.";
        if (!form.postalCode.trim()) newErrors.postalCode = "Postal Code is required.";
        if (!form.city.trim()) newErrors.city = "City is required.";
        if (!form.country.trim()) newErrors.country = "Country is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
          onSave(form);
             setLoading(false);
    };

  const handleCancel = () => {
    onCancel(); // Call the onCancel prop instead of navigating
  };


    return (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2"  style={{zIndex: 101}}>
                <h2 className="text-lg font-bold mb-4">
                    {customerId ? "Edit Customer" : "Add Customer"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Company Number:</label>
                        <input
                            type="text"
                            name="companyNumber"
                            value={form.companyNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                            {errors.companyNumber && <p className="text-red-500 text-sm mt-1">{errors.companyNumber}</p>}
                     </div>
                    <div className="mb-4">
                        <label className="block mb-2">Company Name:</label>
                        <input
                            type="text"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                 {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block mb-2">Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Street and Number:</label>
                        <input
                            type="text"
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-2">Postal Code:</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                        </div>
                        <div>
                            <label className="block mb-2">City:</label>
                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                 {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <label className="block mb-2">Country:</label>
                            <input
                                type="text"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="submit"
                             disabled={loading}
                            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
                        >
                             {loading ? 'Saving...' : 'Save'}
                        </button>
                       <button
                           type="button"
                           onClick={handleCancel}
                           className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CustomerForm;