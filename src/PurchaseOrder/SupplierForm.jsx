// File: /src/purchaseOrder/SupplierForm.jsx

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const SupplierForm = ({ initialSupplier, onSave, onClose }) => {
     const [form, setForm] = useState({
        id: initialSupplier?.id || null,
        name: initialSupplier?.name || "",
          address: initialSupplier?.address || "",
        contactPerson: initialSupplier?.contactPerson || "",
          phone: initialSupplier?.phone || "",
        email: initialSupplier?.email || "",
         vatNumber: initialSupplier?.vatNumber || "",
    });
      const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
      const apiUrl = 'http://localhost:8000/api/suppliers/'; // URL to create new supplier


    useEffect(() => {
        if (initialSupplier) {
            setForm({
                 id: initialSupplier.id,
                name: initialSupplier.name,
                   address: initialSupplier.address,
                 contactPerson: initialSupplier.contactPerson,
                    phone: initialSupplier.phone,
                   email: initialSupplier.email,
                    vatNumber: initialSupplier.vatNumber,
            });
        } else {
            setForm({
                id: null,
                name: "",
                  address: "",
                 contactPerson: "",
                 phone: "",
                   email: "",
                    vatNumber:"",
            });
        }
    }, [initialSupplier]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
         //Simulate saving category
            setTimeout(() => {
              setLoading(false)
            onSave(form)
            alert("Simulated save completed! In a real app, data would be sent to the API.")
        }, 1000);
    };
     if (loading) {
          return <div>Loading categories...</div>
      }

      if(error) {
          return <div className="text-red-500">Error loading categories.</div>
      }
    return (
      <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
        <Form onSubmit={handleSubmit}>
               <Form.Group className="mb-3">
                    <Form.Label>Supplier Name:</Form.Label>
                     <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                         className="input-premium"
                        placeholder="Enter supplier name"
                    />
                </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Address:</Form.Label>
                     <Form.Control
                        as="textarea"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={2}
                         className="input-premium"
                         placeholder="Enter supplier address"
                    />
                </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Contact Person:</Form.Label>
                     <Form.Control
                        type="text"
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                         className="input-premium"
                        placeholder="Enter contact person"
                    />
                </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Phone:</Form.Label>
                     <Form.Control
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                         className="input-premium"
                        placeholder="Enter phone number"
                    />
                </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email:</Form.Label>
                     <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                         className="input-premium"
                        placeholder="Enter email"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Vat Number:</Form.Label>
                     <Form.Control
                        type="text"
                        name="vatNumber"
                        value={form.vatNumber}
                        onChange={handleChange}
                         className="input-premium"
                        placeholder="Enter VAT Number"
                    />
                </Form.Group>
                 <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </Form>
          </div>
    );
};

export default SupplierForm;