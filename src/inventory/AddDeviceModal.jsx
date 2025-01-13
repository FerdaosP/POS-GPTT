import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const AddDeviceModal = ({ isOpen, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        quantity_on_hand: "",
        imei: "",
        storage: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


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
          <Modal show={isOpen} onHide={onClose} centered  className="modal-premium" style={{ zIndex: 1060 }}>
            <div className="modal-content-premium"  style={{ maxWidth: '600px' }}>
                <Modal.Header closeButton>
                     <Modal.Title>Add Device</Modal.Title>
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

export default AddDeviceModal;