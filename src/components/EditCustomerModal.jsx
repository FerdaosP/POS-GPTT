import React, { useState, useEffect } from "react";
import axios from "axios";
import { XCircle } from "lucide-react";

const EditCustomerModal = ({ customer, isOpen, onClose, onSave }) => {
    const [editedCustomer, setEditedCustomer] = useState(customer || {
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

    useEffect(() => {
        if (customer) {
            setEditedCustomer(customer);
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer((prev) => ({ ...prev, [name]: value }));
    };

   const validate = () => {
        const newErrors = {};
          if (!editedCustomer.companyNumber.trim()) newErrors.companyNumber = "Company Number is required.";
         if (!editedCustomer.companyName.trim()) newErrors.companyName = "Company Name is required.";
        if (!editedCustomer.firstName.trim()) newErrors.firstName = "First Name is required.";
        if (!editedCustomer.lastName.trim()) newErrors.lastName = "Last Name is required.";
        if (!editedCustomer.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(editedCustomer.email)) {
            newErrors.email = "Invalid email format.";
        }
        if (!editedCustomer.phone.trim()) newErrors.phone = "Phone is required.";
        if (!editedCustomer.street.trim()) newErrors.street = "Street and Number are required.";
        if (!editedCustomer.postalCode.trim()) newErrors.postalCode = "Postal Code is required.";
        if (!editedCustomer.city.trim()) newErrors.city = "City is required.";
        if (!editedCustomer.country.trim()) newErrors.country = "Country is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

      const handleSubmit = () => {
            if (!validate()) return;
             onSave(editedCustomer);
             onClose();
       };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
                <form onSubmit={handleSubmit}>
                     <div className="mb-4">
                         <label className="block mb-2">Company Number:</label>
                            <input
                                type="text"
                                name="companyNumber"
                                value={editedCustomer.companyNumber}
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
                                  value={editedCustomer.companyName}
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
                                  value={editedCustomer.firstName}
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
                                value={editedCustomer.lastName}
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
                               value={editedCustomer.email}
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
                           value={editedCustomer.phone}
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
                           value={editedCustomer.street}
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
                                 value={editedCustomer.postalCode}
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
                                 value={editedCustomer.city}
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
                               value={editedCustomer.country}
                               onChange={handleChange}
                             className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                       </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                           type="submit"
                           className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Update
                        </button>
                       <button
                           type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                           Cancel
                      </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomerModal;