import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from "axios";

const CategoryForm = ({ isOpen, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: "", // Ensure this matches the backend's expected field
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send the category data to the backend
            const response = await axios.post('http://localhost:8000/api/service-categories/', form, {
                headers: {
                    'Content-Type': 'application/json', // Ensure the correct content type
                },
            });

            if (response.status === 201) {
                onSave(response.data); // Pass the created category data back to the parent
            }
        } catch (err) {
            console.error("Error saving category:", err);
            setError("Error saving category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Category Name:</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter category name"
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

export default CategoryForm;