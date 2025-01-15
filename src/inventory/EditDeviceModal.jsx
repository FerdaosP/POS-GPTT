import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditDeviceModal = ({ isOpen, onClose, onSave, initialItem }) => {
    const [form, setForm] = useState(initialItem || {
        name: "",
        description: "",
        price: "",
        quantity_on_hand: "",
        imei: "",
        storage: "",
        serial_number: "",
    });
      const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
         setLoading(true);
            setError(null);
           //mocked categories
            const categoriesData = [
                 {
                id: 1,
                name: "Category A"
                },
                 {
                  id: 2,
                 name: "Category B"
                },
                {
                    id: 3,
                   name: "Category C"
                }
            ];

           setTimeout(() => {
              setCategories(categoriesData)
              setLoading(false)
         }, 200)
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };
      if (loading) {
          return <div>Loading categories...</div>
      }

      if(error) {
          return <div className="text-red-500">Error loading categories.</div>
      }

  return (
        <Modal show={isOpen} onHide={onClose} centered size="lg" className="modal-premium" style={{zIndex:1600}}>
            <div className="modal-content-premium">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                             <Form.Label>Name:</Form.Label>
                               <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required className="input-premium"/>
                           </Form.Group>
                          <Form.Group className="mb-3">
                              <Form.Label>Description:</Form.Label>
                                <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} rows={3} className="input-premium"/>
                         </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Price:</Form.Label>
                             <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required className="input-premium"/>
                           </Form.Group>
                         <Form.Group className="mb-3">
                             <Form.Label>Quantity:</Form.Label>
                              <Form.Control type="number" name="quantity_on_hand" value={form.quantity_on_hand} onChange={handleChange} required className="input-premium"/>
                         </Form.Group>

                            <Form.Group className="mb-3">
                            <Form.Label>IMEI:</Form.Label>
                             <Form.Control type="text" name="imei" value={form.imei} onChange={handleChange}  className="input-premium"/>
                         </Form.Group>
                        <Form.Group className="mb-3">
                           <Form.Label>Storage:</Form.Label>
                            <Form.Control type="text" name="storage" value={form.storage} onChange={handleChange}  className="input-premium"/>
                       </Form.Group>
                       <Form.Group className="mb-3">
                            <Form.Label>Serial Number:</Form.Label>
                            <Form.Control type="text" name="serial_number" value={form.serial_number} onChange={handleChange} className="input-premium"/>
                        </Form.Group>
                         <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                                <Button variant="primary" type="submit">OK</Button>
                          </div>
                    </Form>
                </Modal.Body>
            </div>
      </Modal>
    );
};

export default EditDeviceModal;