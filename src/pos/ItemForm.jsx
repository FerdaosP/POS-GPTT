import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';

const ItemForm = ({ onClose, onSave, categories }) => {
    const [form, setForm] = useState({
        itemCode: "",
        itemDescription: "",
        unitValue: "",
        discount: "",
        tax: "",
        quantity: 1,
        category: "", // New field for category
    });

    const taxes = [
        "Default",
        "BTW(21%)",
        "BTW(9%)",
        "BTW(0%)"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <Form onSubmit={handleSubmit} className="max-w-md mx-auto">
            {/* Category Dropdown */}
            <Form.Group className="mb-3">
                <Form.Label>Category:</Form.Label>
                <Form.Control
                    as="select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {categories?.map((category) => (
                        <option value={category.name} key={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            {/* Item Code */}
            <Form.Group className="mb-3">
                <Form.Label>Item Code:</Form.Label>
                <Form.Control
                    type="text"
                    name="itemCode"
                    value={form.itemCode}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            {/* Item Description */}
            <Form.Group className="mb-3">
                <Form.Label>Item Description:</Form.Label>
                <Form.Control
                    as="textarea"
                    name="itemDescription"
                    value={form.itemDescription}
                    onChange={handleChange}
                    rows={3}
                    required
                />
            </Form.Group>

            {/* Unit Value */}
            <Form.Group className="mb-3">
                <Form.Label>Unit Value (price or rate):</Form.Label>
                <Form.Control
                    type="number"
                    name="unitValue"
                    value={form.unitValue}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            {/* Discount */}
            <Form.Group className="mb-3">
                <Form.Label>Discount:</Form.Label>
                <Form.Control
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="0.00%"
                />
            </Form.Group>

            {/* Tax */}
            <Form.Group className="mb-3">
                <Form.Label>Tax:</Form.Label>
                <Form.Control
                    as="select"
                    value={form.tax}
                    name="tax"
                    onChange={handleChange}
                    required
                >
                    {taxes?.map((tax) => (
                        <option value={tax} key={tax}>{tax}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit">OK</Button>
            </div>
        </Form>
    );
};

export default ItemForm;