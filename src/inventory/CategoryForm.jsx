import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryForm = ({ isOpen, onClose, onSave }) => {
    const [form, setForm] = useState({
         name: "",
   });

    const handleChange = (e) => {
      const {name, value} = e.target;
     setForm({...form, [name]: value});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
       onClose();
 };

  return (
          <div  className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name:</Form.Label>
                    <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required/>
                 </Form.Group>
                 <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                      <Button variant="primary" type="submit">OK</Button>
               </div>
             </Form>
          </div>
     );
};

export default CategoryForm;