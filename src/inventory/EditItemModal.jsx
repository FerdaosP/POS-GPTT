import React from 'react';
import { Modal } from 'react-bootstrap';
import ItemForm from './ItemForm';

const EditItemModal = ({ isOpen, onClose, onSave, initialItem }) => {
    return (
        <Modal show={isOpen} onHide={onClose} centered size="lg" className="modal-premium" style={{ zIndex: 1050 }}>
            <div className="modal-content-premium">
                <Modal.Header closeButton>
                     <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                 <Modal.Body>
                       <ItemForm
                        onSave={onSave}
                        onClose={onClose}
                       initialItem={initialItem}
                     />
                </Modal.Body>
            </div>
      </Modal>
    );
};

export default EditItemModal;