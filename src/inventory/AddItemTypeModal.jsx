import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Package, Tablet } from 'lucide-react';

const AddItemTypeModal = ({ isOpen, onClose, onSelectItem, onSelectDevice }) => {
  if (!isOpen) return null;
    return (
      <Modal show={isOpen} onHide={onClose} centered className="modal-premium" style={{ zIndex: 1060 }}>
        <div className="modal-content-premium">
           <Modal.Header closeButton>
                 <Modal.Title>Select Item Type</Modal.Title>
            </Modal.Header>
             <Modal.Body className="flex flex-col md:flex-row gap-4 justify-center">
                <Button
                      onClick={onSelectItem}
                       className="flex flex-col items-center justify-center p-6 rounded-xl border shadow-md"
                    >
                      <Package size={48}/>
                        Add Item
                    </Button>
                 <Button
                    onClick={onSelectDevice}
                   className="flex flex-col items-center justify-center p-6 rounded-xl border shadow-md"
                    >
                         <Tablet size={48}/>
                            Add Device
                     </Button>
             </Modal.Body>
        </div>
    </Modal>
    );
};

export default AddItemTypeModal;