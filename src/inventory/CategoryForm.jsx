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
    
        try {
            let response;
            if (form.id) { // Check if the category ID exists (editing an existing category)
                // Update existing category using the category ID
                response = await axios.put(`${categoryUrl}${form.id}/`, form, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                // Create new category
                response = await axios.post(categoryUrl, form, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
    
            if (response.status === 200 || response.status === 201) {
                onSave(response.data); // Pass the saved/updated category data back to the parent
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