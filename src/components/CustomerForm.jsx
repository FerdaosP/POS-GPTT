import React, { useState } from "react";

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [form, setForm] = useState(
    customer || {
      companyNumber: "", // Ondernemingsnummer
      companyName: "", // Maatschappelijke naam
      firstName: "", // Voornaam bestuurder
      lastName: "", // Achternaam bestuurder
      email: "", // E-mail
      phone: "", // Telefoon
      street: "", // Straatnaam en nummer
      postalCode: "", // Postcode
      city: "", // Stad
      country: "", // Land
    }
  );

  const [errors, setErrors] = useState({});

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

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-lg font-bold mb-4">
          {customer ? "Edit Customer" : "Add Customer"}
        </h2>
        <form>
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
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 mr-2"
          >
            Meow
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
