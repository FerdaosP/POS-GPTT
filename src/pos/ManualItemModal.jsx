import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const ManualItemModal = ({ isOpen, onClose, onItemAdd, categories }) => {
  const [form, setForm] = useState({
    itemCode: "",
    itemDescription: "",
    unitValue: "",
    discount: "",
    tax: "",
    quantity: 1,
    addItemToItems: false,
    category: "", // New field for category
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // State to control dropdown visibility

  const taxes = [
    "Default",
    "BTW(21%)",
    "BTW(9%)",
    "BTW(0%)"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    // If the checkbox is toggled, update the dropdown visibility
    if (name === 'addItemToItems') {
      setShowCategoryDropdown(checked);
    }

    setForm({ ...form, [name]: updatedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onItemAdd(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Manual Item Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Item Quantity */}
          <Form.Group className="mb-3">
            <Form.Label>Item Quantity:</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="1"
            />
          </Form.Group>

          {/* Item Code */}
          <Form.Group className="mb-3">
            <Form.Label>Item Code:</Form.Label>
            <Form.Control
              type="text"
              name="itemCode"
              value={form.itemCode}
              onChange={handleChange}
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
            >
              {taxes?.map((tax) => (
                <option value={tax} key={tax}>{tax}</option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Add to Items List Checkbox */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Add this item permanently to Items List"
              name="addItemToItems"
              checked={form.addItemToItems}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Category Dropdown (Conditional Rendering) */}
          {showCategoryDropdown && (
            <Form.Group className="mb-3">
              <Form.Label>Category:</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={form.category}
                onChange={handleChange}
                required={form.addItemToItems} // Required only if checkbox is checked
              >
                <option value="" disabled>Select a category</option>
                {categories?.map((category) => (
                  <option value={category.name} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">Enter Item</Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Footer content (if needed) */}
      </Modal.Footer>
    </Modal>
  );
};

export default ManualItemModal;