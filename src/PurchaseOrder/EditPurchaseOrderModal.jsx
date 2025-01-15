// File: /src/purchaseOrder/EditPurchaseOrderModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import SupplierDropdown from './SupplierDropdown';

const EditPurchaseOrderModal = ({ isOpen, onClose, onSave, purchaseOrder }) => {
     const [form, setForm] = useState(purchaseOrder || {
          poNumber: "",
          supplier: "",
        poDate: "",
        expectedDeliveryDate: "",
        items: [{ itemDescription: "", itemSKU: "", quantity: 1, unitPrice: 0, taxRate: 0 }],
         notes: "",
        status: "Draft",
    });
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

    useEffect(() => {
        if(purchaseOrder) {
         setForm(purchaseOrder);
        } else {
           setForm({
                poNumber: "",
                supplier: "",
                poDate: "",
                expectedDeliveryDate: "",
                items: [{ itemDescription: "", itemSKU: "", quantity: 1, unitPrice: 0, taxRate: 0 }],
                notes: "",
                status: "Draft",
            })
        }
    }, [purchaseOrder]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

   const handleSupplierChange = (e) => {
        setForm({ ...form, supplier: e.target.value });
    };
     const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const newItems = [...form.items];
        newItems[index][name] = value;
        setForm({ ...form, items: newItems });
    };

     const handleAddItem = () => {
        setForm({ ...form, items: [...form.items, { itemDescription: "", itemSKU: "", quantity: 1, unitPrice: 0, taxRate: 0 }] });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...form.items];
        newItems.splice(index, 1);
        setForm({ ...form, items: newItems });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
         // Calculate totals
        let subtotal = 0;
        form.items.forEach(item => {
            subtotal += item.quantity * item.unitPrice;
        });

        // Apply tax to the subtotal
        let taxAmount = 0
         form.items.forEach(item => {
            taxAmount += (item.quantity * item.unitPrice) * item.taxRate/100;
        });
        const totalAmount = subtotal + taxAmount;


        const finalForm = { ...form, totalAmount:totalAmount }
       onSave(finalForm);
         onClose();
    };
      if (loading) {
          return <div>Loading categories...</div>
      }

      if(error) {
          return <div className="text-red-500">Error loading categories.</div>
      }


    return (
        <Modal show={isOpen} onHide={onClose} centered className="modal-premium" style={{zIndex:1600}} dialogClassName="modal-xl">
            <div className="modal-content-premium" >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Purchase Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                        <Row>
                              <Col md={6}>
                                 <Form.Group className="mb-3">
                                    <Form.Label>PO Number:</Form.Label>
                                    <Form.Control type="text" name="poNumber" value={form.poNumber} onChange={handleChange} required className="input-premium" disabled/>
                                  </Form.Group>
                              </Col>
                              <Col md={6}>
                                 <Form.Group className="mb-3">
                                    <Form.Label>Supplier:</Form.Label>
                                    <SupplierDropdown
                                        onChange={handleSupplierChange}
                                        value={form.supplier}
                                    />
                                  </Form.Group>
                             </Col>
                         </Row>
                         <Row>
                            <Col md={6}>
                               <Form.Group className="mb-3">
                                 <Form.Label>PO Date:</Form.Label>
                                 <Form.Control type="date" name="poDate" value={form.poDate} onChange={handleChange} required className="input-premium" />
                             </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>Expected Delivery Date:</Form.Label>
                                 <Form.Control type="date" name="expectedDeliveryDate" value={form.expectedDeliveryDate} onChange={handleChange}  className="input-premium" />
                            </Form.Group>
                           </Col>
                         </Row>

                        <Form.Group className="mb-3">
                             <Form.Label>Items:</Form.Label>
                               {form.items.map((item, index) => (
                                    <div key={index} className="mb-2 border p-2 rounded">
                                         <Row>
                                           <Col md={4}>
                                              <Form.Group className="flex-1">
                                                    <Form.Label>Item Description</Form.Label>
                                                    <Form.Control type="text" name="itemDescription" value={item.itemDescription} onChange={(e) => handleItemChange(e, index)} className="input-premium"  />
                                                </Form.Group>
                                             </Col>
                                               <Col md={3}>
                                                <Form.Group className="flex-1">
                                                    <Form.Label>Item SKU</Form.Label>
                                                    <Form.Control type="text" name="itemSKU" value={item.itemSKU} onChange={(e) => handleItemChange(e, index)}  className="input-premium"  />
                                                </Form.Group>
                                             </Col>
                                             <Col md={1}>
                                                <Form.Group className="flex-1">
                                                    <Form.Label>Quantity</Form.Label>
                                                    <Form.Control type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(e, index)}   className="input-premium"/>
                                                </Form.Group>
                                             </Col>
                                                <Col md={2}>
                                                <Form.Group className="flex-1">
                                                    <Form.Label>Unit Price</Form.Label>
                                                    <Form.Control type="number" name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(e, index)}  className="input-premium" />
                                                </Form.Group>
                                             </Col>
                                               <Col md={1}>
                                                <Form.Group className="flex-1">
                                                 <Form.Label>Tax Rate (%)</Form.Label>
                                                    <Form.Control type="number" name="taxRate" value={item.taxRate} onChange={(e) => handleItemChange(e, index)}  className="input-premium"/>
                                                 </Form.Group>
                                                </Col>
                                                  <Col md={1}>
                                                     <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)}>Remove</Button>
                                                 </Col>
                                        </Row>
                                    </div>
                                ))}
                            <Button variant="secondary" onClick={handleAddItem}>Add Item</Button>
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Notes:</Form.Label>
                            <Form.Control as="textarea" name="notes" value={form.notes} onChange={handleChange} rows={3}  className="input-premium" />
                        </Form.Group>
                         <Form.Group className="mb-3">
                          <Form.Label>Status:</Form.Label>
                            <Form.Control as="select" name="status" value={form.status} onChange={handleChange}  className="select-premium">
                                <option value="Draft">Draft</option>
                                <option value="Sent">Sent</option>
                                <option value="Received">Received</option>
                                 <option value="Cancelled">Cancelled</option>
                            </Form.Control>
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

export default EditPurchaseOrderModal;