import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';

const ItemForm = ({onClose, onSave, initialItem}) => {
    const [form, setForm] = useState(initialItem || {
         sku: "",
        name: "",
        description: "",
        price: "",
        quantity_on_hand: "",
        category: "",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = (e) => {
         e.preventDefault();
        onSave(form)
    }

    return (
        <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                   <Form.Label>SKU:</Form.Label>
                   <Form.Control type="text" name="sku" value={form.sku} onChange={handleChange} required/>
               </Form.Group>
                <Form.Group className="mb-3">
                     <Form.Label>Name:</Form.Label>
                       <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required/>
                   </Form.Group>
                  <Form.Group className="mb-3">
                      <Form.Label>Description:</Form.Label>
                        <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} rows={3}/>
                 </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Price:</Form.Label>
                     <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required/>
                   </Form.Group>
                 <Form.Group className="mb-3">
                     <Form.Label>Quantity:</Form.Label>
                      <Form.Control type="number" name="quantity_on_hand" value={form.quantity_on_hand} onChange={handleChange} required/>
                 </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Category:</Form.Label>
                     <Form.Control type="text" name="category" value={form.category} onChange={handleChange} />
                   </Form.Group>
                <div className="flex justify-end space-x-2 mt-4">
                     <Button variant="secondary" onClick={onClose}>Cancel</Button>
                      <Button variant="primary" type="submit">OK</Button>
                </div>
           </Form>
    );
};

export default ItemForm;