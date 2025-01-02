import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with the vfs_fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const SendInvoiceModal = ({ isOpen, onClose, invoice, companyInfo }) => {
  const [recipientEmail, setRecipientEmail] = useState(invoice?.billToEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const invoiceCaptureRef = useRef(null);
  const pdfInitialized = useRef(false);

  useEffect(() => {
    try {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      pdfInitialized.current = true;
    } catch (e) {
      console.error("Error initializing pdfMake", e);
      setError("Error initializing PDF, please check console");
    }
  }, []);

  const handleEmailChange = (e) => {
    setRecipientEmail(e.target.value);
  };

  const generatePDF = async () => {
    try {
      if (!pdfInitialized.current) {
        setError("Error initializing PDF, please check console");
        return null;
      }
      const docDefinition = {
        content: [
          { text: `${companyInfo?.companyName || 'John Uberbacher'}`, style: 'header' },
          { text: `Invoice #: ${invoice?.invoiceNumber || ''}`, style: 'subheader' },
          {
            columns: [
              { text: 'Billed to:', style: 'sectionHeader' },
              { text: 'Billed From:', style: 'sectionHeader' },
              { text: 'Date Of Issue:', style: 'sectionHeader' }
            ],
          },
          {
            columns: [
              [
                { text: invoice?.billTo || '' },
                { text: invoice?.billToAddress || '' },
                { text: invoice?.billToEmail || '' }
              ],
              [
                { text: companyInfo?.companyName || '' },
                { text: companyInfo?.address || '' },
                { text: companyInfo?.email || '' }
              ],
              { text: invoice?.dateOfIssue || '' },
            ]
          },
          {
            text: 'Items',
            style: 'sectionHeader',
            margin: [0, 10, 0, 5]
          },
          {
            table: {
              body: [
                [
                  { text: "QTY", style: "tableHeader" },
                  { text: "DESCRIPTION", style: "tableHeader" },
                  { text: "PRICE", style: "tableHeader" },
                  { text: "AMOUNT", style: "tableHeader" },
                ],
                ...(invoice?.items || []).map((item) => [
                  item.quantity,
                  `${item.name} - ${item.description}`,
                  `$${item.price}`,
                  `$${(item.price * item.quantity).toFixed(2)}`
                ]),
                [
                  {}, {}, { text: 'Subtotal', style: "totalTitle" }, { text: `$${invoice.subTotal || 0}`, style: 'totalAmount' }
                ],
                [
                  {}, {}, { text: 'Tax', style: "totalTitle" }, { text: `$${invoice.taxAmmount || 0}`, style: 'totalAmount' }
                ],
                [
                  {}, {}, { text: 'Discount', style: "totalTitle" }, { text: `$${invoice.discountAmmount || 0}`, style: 'totalAmount' }
                ],
                [
                  {}, {}, { text: 'Total', style: "totalTitle" }, { text: `$${invoice.total || 0}`, style: 'totalAmount' }
                ]
              ]
            },
            layout: 'noBorders',
          },
          {
            text: invoice?.notes || '',
            style: 'notes',
            margin: [0, 10, 0, 0]
          }
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 0, 0, 5]
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 5, 0, 5],
          },
          tableHeader: {
            bold: true,
            fontSize: 10
          },
          notes: {
            fontSize: 10,
            italics: true
          },
          totalTitle: {
            bold: true,
            alignment: "right",
            margin: [0, 5, 10, 0]
          },
          totalAmount: {
            bold: true,
            alignment: "right",
            margin: [0, 5, 0, 0]
          }
        }
      };
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      const pdfBlob = await new Promise((resolve) => {
        pdfDocGenerator.getBlob((blob) => {
          resolve(blob);
        });
      });
      return pdfBlob;
    } catch (e) {
      console.error('Error creating PDF:', e);
      setError('There was an error creating the PDF, please check console');
      return null;
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    try {
      const pdfBlob = await generatePDF();
      if (!pdfBlob) {
        setLoading(false);
        return;
      }
      const pdfFile = new File([pdfBlob], `invoice-${invoice.invoiceNumber}.pdf`, { type: 'application/pdf' });

      const formData = new FormData();
      formData.append('pdf_file', pdfFile);
      formData.append('recipientEmail', recipientEmail);

      const response = await axios.post(
        `http://localhost:8000/api/invoices/${invoice.invoiceNumber}/send_invoice/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert("Email sent successfully");
      }
      onClose();
    } catch (err) {
      console.error('Error sending invoice:', err);
      setError(`Error sending email. Please check the console for more details. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Send Invoice #{invoice?.invoiceNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger mb-3">{error}</p>}
        <div id="invoiceCapture" ref={invoiceCaptureRef}>
          <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
            <div className="w-100">
              <h4 className="fw-bold my-2">{companyInfo?.companyName || 'John Uberbacher'}</h4>
              <h6 className="fw-bold text-secondary mb-1">
                Invoice #: {invoice?.invoiceNumber || ''}
              </h6>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
              <h5 className="fw-bold text-secondary"> ${invoice?.total}</h5>
            </div>
          </div>
          <div className="p-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed to:</div>
                <div>{invoice?.billTo || ''}</div>
                <div>{invoice?.billToAddress || ''}</div>
                <div>{invoice?.billToEmail || ''}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{companyInfo?.companyName || ''}</div>
                <div>{companyInfo?.address || ''}</div>
                <div>{companyInfo?.email || ''}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold mt-2">Date Of Issue:</div>
                <div>{invoice?.dateOfIssue || ''}</div>
              </Col>
            </Row>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.items?.map((item, i) => {
                  return (
                    <tr id={i} key={i}>
                      <td style={{ width: '70px' }}>
                        {item.quantity}
                      </td>
                      <td>
                        {item.name} - {item.description}
                      </td>
                      <td className="text-end" style={{ width: '100px' }}>${item.price}</td>
                      <td className="text-end" style={{ width: '100px' }}>${item.price * item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Table>
              <tbody>
                <tr>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: '100px' }}>SUBTOTAL</td>
                  <td className="text-end" style={{ width: '100px' }}>${invoice?.subTotal}</td>
                </tr>
                {invoice?.taxAmmount != 0.00 &&
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>TAX</td>
                    <td className="text-end" style={{ width: '100px' }}>${invoice?.taxAmmount}</td>
                  </tr>
                }
                {invoice?.discountAmmount != 0.00 &&
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>DISCOUNT</td>
                    <td className="text-end" style={{ width: '100px' }}>${invoice?.discountAmmount}</td>
                  </tr>
                }
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: '100px' }}>TOTAL</td>
                  <td className="text-end" style={{ width: '100px' }}>${invoice?.total}</td>
                </tr>
              </tbody>
            </Table>
            {invoice?.notes &&
              <div className="bg-light py-3 px-4 rounded">
                {invoice?.notes}
              </div>}
          </div>
        </div>
        <Form.Group className="mb-3">
          <Form.Label>Recipient Email:</Form.Label>
          <Form.Control
            type="email"
            value={recipientEmail}
            onChange={handleEmailChange}
            placeholder="Enter recipient email"
            required
          />
        </Form.Group>
        <p>
          You are about to send an email with invoice <strong>{invoice?.invoiceNumber}</strong> to <strong>{invoice?.billTo}</strong>, are you sure you want to continue?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSend} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendInvoiceModal;