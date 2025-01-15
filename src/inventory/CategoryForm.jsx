import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from "axios";

const CategoryForm = ({ initialCategory, onSave, onClose }) => {
    const [form, setForm] = useState({
        id: initialCategory?.id || null, // Include the `id` for reference (if needed)
        name: initialCategory?.name || "", // Pre-fill the name if editing
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categoryUrl = 'http://localhost:8000/api/service-categories/'; // Define the category URL

    // Update the form state if `initialCategory` changes
    useEffect(() => {
        if (initialCategory) {
            setForm({
                id: initialCategory.id,
                name: initialCategory.name,
            });
        } else {
            setForm({
                id: null,
                name: "",
            });
        }
    }, [initialCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
       // Simulate saving category
        setTimeout(() => {
           setLoading(false)
            onSave(form)
            alert("Simulated save completed! In a real app, data would be sent to the API.")
        }, 1000);
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