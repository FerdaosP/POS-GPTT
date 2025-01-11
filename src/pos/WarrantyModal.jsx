import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const WarrantyModal = ({ isOpen, onClose, onItemAdd }) => {
  const [warrantyText, setWarrantyText] = useState("");

    const handleChange = (e) => {
       setWarrantyText(e.target.value);
   };

  const handleSubmit = (e) => {
      e.preventDefault();
       onItemAdd(warrantyText);
       onClose();
   };


  if (!isOpen) return null;

    return (
        <Modal show={isOpen} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Enter Warranty</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                           placeholder="Enter warranty details (e.g., 3 months warranty)"
                             value={warrantyText}
                            onChange={handleChange}
                        />
                     </Form.Group>
                    
               </Form>
           </Modal.Body>
             <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>OK</Button>
           </Modal.Footer>
        </Modal>
    );
};

export default WarrantyModal;