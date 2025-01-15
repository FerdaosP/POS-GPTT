import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CategoryForm = ({ isOpen, onClose, onSave }) => {
    const [form, setForm] = useState({
         name: "",
      });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
         const {name, value} = e.target;
          setForm({...form, [name]: value});
     };

    const handleSubmit = async (e) => {
         e.preventDefault();
         setLoading(true);
         setError(null);

             // Simulate saving category
            setTimeout(() => {
                setLoading(false)
                onSave(form)
                  alert("Category saved! In a real app, data would be sent to the API.")
            }, 1000)

       };

    return (
        <div  className="p-4">
             {error && <p className="text-red-500">{error}</p>}
             <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name:</Form.Label>
                    <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required/>
                </Form.Group>
                   <div className="flex justify-end space-x-2 mt-4">
                         <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                           <Button variant="primary" type="submit" disabled={loading}> {loading ? 'Saving...' : 'OK'}</Button>
                   </div>
              </Form>
          </div>
    );
};

export default CategoryForm;