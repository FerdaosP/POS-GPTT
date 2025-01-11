import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const PaymentModal = ({ isOpen, onClose, totalAmount}) => {
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [amountTendered, setAmountTendered] = useState('');
   const [paymentRef, setPaymentRef] = useState('');
    const [change, setChange] = useState(0);
      const [payments, setPayments] = useState([]);


     useEffect(() => {
            calculateChange()
    },[amountTendered])

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleAmountTenderedChange = (e) => {
        const value = e.target.value;
        setAmountTendered(value);
    };
    const handlePaymentRefChange = (e) => {
        setPaymentRef(e.target.value);
    };

    const calculateChange = () => {
           const tendered = parseFloat(amountTendered || 0);
           const total = parseFloat(totalAmount || 0);
        setChange((tendered - total).toFixed(2));
    };

   const handleAddPayment = () => {

       setPayments(prev => [...prev, {method: paymentMethod, amount: amountTendered }])
         setAmountTendered("");
        setPaymentRef("");
       setChange(0);
    };
  const handleRecord = () => {
        // Save payment info and close
       onClose()
  };
  const handleRemovePayment = () => {

   };
   const  renderPaymentItems = () => {
           if(payments.length == 0){
                return <p>No payments added yet</p>
            }
         return   payments.map((item, index) => (
              <tr key={index}>
                  <td>{item.method}</td>
                   <td>€{item.amount}</td>
              </tr>
        ))
    }


  if (!isOpen) return null;

    return (
      <Modal show={isOpen} onHide={onClose} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Receive Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
           <p>Total Amount Due: €{totalAmount}</p>
            <Form.Label>Payment Method:</Form.Label>
              <Form.Control as="select" value={paymentMethod} onChange={handlePaymentMethodChange}>
                   <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                <option value="Other">Other</option>
              </Form.Control>
           </div>
          <div className="mb-3">
              <p>Balance Remaining: €{(totalAmount - payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)).toFixed(2)}</p>
            <Form.Label>Amount Tendered:</Form.Label>
           <Form.Control type="number" value={amountTendered} placeholder="Amount Tendered" onChange={handleAmountTenderedChange} />
         </div>
          <div className="mb-3">
             <Form.Label>Payment Ref:</Form.Label>
            <Form.Control type="text" value={paymentRef} placeholder="Payment Ref" onChange={handlePaymentRefChange} />
         </div>
            <div className="mb-3">
             <p>Change: €{change}</p>
            </div>
            <div className="flex justify-between">
                  <Button variant="light" onClick={handleAddPayment} >Add Payment</Button>
               <Button variant="light"  onClick={handleRemovePayment}>Remove Payment</Button>
                 <Button variant="light">Show Keypad</Button>
               </div>
                  <Table className="mt-3" striped bordered hover>
                       <thead>
                           <tr>
                               <th>Payment Method</th>
                               <th>Amount Applied</th>
                            </tr>
                        </thead>
                      <tbody>
                            {renderPaymentItems()}
                         </tbody>
                   </Table>
            </Modal.Body>
             <Modal.Footer>
                <Button variant="primary" onClick={handleRecord}>Record</Button>
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
           </Modal.Footer>
      </Modal>
    );
};

export default PaymentModal;