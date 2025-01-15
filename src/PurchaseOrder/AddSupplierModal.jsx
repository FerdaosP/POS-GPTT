// File: /src/purchaseOrder/AddSupplierModal.jsx

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddSupplierModal = ({ isOpen, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: "",
        address: "",
        contactPerson: "",
        phone: "",
        email: "",
        vatNumber:"",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
      const apiUrl = 'http://localhost:8000/api/suppliers/'; // URL to create new supplier

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(apiUrl, form);
            if(response.status === 201){
                onSave(response.data);
                showNotification("Supplier created successfully!");
            } else {
                setError("Error creating supplier. Please check console.")
            }
        } catch (err) {
            console.error("Error creating supplier:", err);
             setError("Error creating supplier. Please check console.");
        } finally {
            setLoading(false);
        }
    };
        const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
          return <div className="text-red-500">{error}</div>
      }

    return (
        <Modal show={isOpen} onHide={onClose} centered className="modal-premium" style={{ zIndex: 1060 }}>
            <div className="modal-content-premium" style={{ maxWidth: '600px' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                            />
                        </Form.Group>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </div>
        </Modal>
    );
};

export default AddSupplierModal;