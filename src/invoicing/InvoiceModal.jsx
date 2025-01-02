// File: POS-GPT-main/src/invoicing/InvoiceModal.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import axios from 'axios';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class InvoiceModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           recipientEmail: this.props.info?.billToEmail || '',
           loading: false,
            error: null,
            pdfInitialized: false
        }
        this.generatePDFForDownload = this.generatePDFForDownload.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
     componentDidMount() {
        try {
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
          this.setState({pdfInitialized: true});
        } catch (e) {
          console.error("Error initializing pdfMake", e);
            this.setState({error: "Error initializing PDF, please check console"});
        }
    }
    handleEmailChange = (e) => {
        this.setState({recipientEmail: e.target.value});
    };
   generatePDFForDownload = async () => {
        const { info, items, companyInfo, currency, subTotal, taxAmmount, discountAmmount, total } = this.props;
        try {

            const docDefinition = {
                content: [
                    { text: `${companyInfo?.companyName || 'John Uberbacher'}`, style: 'header' },
                    { text: `Invoice #: ${info?.invoiceNumber || ''}`, style: 'subheader' },
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
                                { text: info?.billTo || '' },
                                { text: info?.billToAddress || '' },
                                { text: info?.billToEmail || '' }
                            ],
                            [
                                { text: companyInfo?.companyName || '' },
                                { text: companyInfo?.address || '' },
                                { text: companyInfo?.email || '' }
                            ],
                            { text: info?.dateOfIssue || '' },
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
                                ...(items || []).map((item) => [
                                    item.quantity,
                                    `${item.name} - ${item.description}`,
                                    `${currency}${item.price}`,
                                    `${currency}${(item.price * item.quantity).toFixed(2)}`
                                ]),
                                [
                                    {}, {}, { text: 'Subtotal', style: "totalTitle" }, { text: `${currency}${subTotal || 0}`, style: 'totalAmount' }
                                ],
                                [
                                    {}, {}, { text: 'Tax', style: "totalTitle" }, { text: `${currency}${taxAmmount || 0}`, style: 'totalAmount' }
                                ],
                                [
                                    {}, {}, { text: 'Discount', style: "totalTitle" }, { text: `${currency}${discountAmmount || 0}`, style: 'totalAmount' }
                                ],
                                [
                                    {}, {}, { text: 'Total', style: "totalTitle" }, { text: `${currency}${total || 0}`, style: 'totalAmount' }
                                ]
                            ]
                        },
                        layout: 'noBorders',
                    },
                    {
                        text: info?.notes || '',
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

            pdfDocGenerator.getBlob((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `invoice-${info.invoiceNumber}.pdf`;
                link.click();
                URL.revokeObjectURL(blobUrl); // Clean up the URL object
           });
        } catch (e) {
          console.error('Error creating PDF:', e);
          alert('There was an error creating the PDF, please check console')
        }
    };
    generatePDF = async () => {
        const { info, items, companyInfo, currency, subTotal, taxAmmount, discountAmmount, total } = this.props;
           if (!this.state.pdfInitialized) {
               this.setState({error: "Error initializing PDF, please check console"});
               return null;
           }
        try {

            const docDefinition = {
                content: [
                    { text: `${companyInfo?.companyName || 'John Uberbacher'}`, style: 'header' },
                    { text: `Invoice #: ${info?.invoiceNumber || ''}`, style: 'subheader' },
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
                                { text: info?.billTo || '' },
                                { text: info?.billToAddress || '' },
                                { text: info?.billToEmail || '' }
                            ],
                            [
                                { text: companyInfo?.companyName || '' },
                                { text: companyInfo?.address || '' },
                                { text: companyInfo?.email || '' }
                            ],
                            { text: info?.dateOfIssue || '' },
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
                                ...(items || []).map((item) => [
                                    item.quantity,
                                    `${item.name} - ${item.description}`,
                                    `${currency}${item.price}`,
                                    `${currency}${(item.price * item.quantity).toFixed(2)}`
                                ]),
                                [
                                    {}, {}, { text: 'Subtotal', style: "totalTitle" }, { text: `${currency}${subTotal || 0}`, style: 'totalAmount' }
                                ],
                                [
                                    {}, {}, { text: 'Tax', style: "totalTitle" }, { text: `${currency}${taxAmmount || 0}`, style: 'totalAmount' }
                                ],
                                [
                                    {}, {}, { text: 'Discount', style: "totalTitle" }, { text: `${currency}${discountAmmount || 0}`, style: 'totalAmount' }
                                ],
                                [
                                    {}, {}, { text: 'Total', style: "totalTitle" }, { text: `${currency}${total || 0}`, style: 'totalAmount' }
                                ]
                            ]
                        },
                        layout: 'noBorders',
                    },
                    {
                        text: info?.notes || '',
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
          this.setState({error: 'There was an error creating the PDF, please check console'});
          return null
        }
    };
   handleSend = async () => {
       this.setState({ loading: true, error: null });
        try {
            const { info } = this.props;
            const pdfBlob = await this.generatePDF();
            if (!pdfBlob) {
                this.setState({ loading: false });
                return;
            }
            const pdfFile = new File([pdfBlob], `invoice-${info.invoiceNumber}.pdf`, { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('pdf_file', pdfFile);
             formData.append('recipientEmail', this.state.recipientEmail);
           console.log("Form data: ", formData);


            const response = await axios.post(
                 `http://localhost:8000/api/invoices/${info.invoiceNumber}/send_invoice/`,
                 formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
             );
            if (response.data.message) {
                alert(response.data.message);
            } else {
                alert("Email sent successfully");
            }
             this.setState({ loading: false });
             this.props.onSaveInvoice(info);
            this.props.closeModal();
         } catch (err) {
            console.error('Error sending invoice:', err);
             this.setState({ error: `Error sending email. Please check the console for more details. ${err.message}` });
              this.setState({ loading: false });
        }
    };
    handleSave = () => {
       this.props.onSaveInvoice(this.props.info);
       this.props.closeModal();
   };
  render() {
    const { showModal, closeModal, currency, subTotal, taxAmmount, discountAmmount, total, items, info, companyInfo} = this.props;
      const { loading, error, recipientEmail} = this.state;
      if (!info || !companyInfo) {
        return null;
      }
    return(
      <div>
        <Modal show={showModal} onHide={closeModal} size="lg" centered>
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">{companyInfo.companyName ||'John Uberbacher'}</h4>
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice #: {info.invoiceNumber||''}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
                <h5 className="fw-bold text-secondary"> {currency} {total}</h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{info.billTo||''}</div>
                  <div>{info.billToAddress||''}</div>
                  <div>{info.billToEmail||''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{companyInfo.companyName ||''}</div>
                  <div>{companyInfo.address||''}</div>
                  <div>{companyInfo.email||''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{info.dateOfIssue||''}</div>
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
                  {items?.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{width: '70px'}}>
                          {item.quantity}
                        </td>
                        <td>
                          {item.name} - {item.description}
                        </td>
                        <td className="text-end" style={{width: '100px'}}>{currency} {item.price}</td>
                        <td className="text-end" style={{width: '100px'}}>{currency} {item.price * item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{width: '100px'}}>SUBTOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{currency} {subTotal}</td>
                  </tr>
                  {taxAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>TAX</td>
                      <td className="text-end" style={{width: '100px'}}>{currency} {taxAmmount}</td>
                    </tr>
                  }
                  {discountAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>DISCOUNT</td>
                      <td className="text-end" style={{width: '100px'}}>{currency} {discountAmmount}</td>
                    </tr>
                  }
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{width: '100px'}}>TOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{currency} {total}</td>
                  </tr>
                </tbody>
              </Table>
              {info.notes &&
                <div className="bg-light py-3 px-4 rounded">
                  {info.notes}
                </div>}
            </div>
          </div>
          <div className="pb-4 px-4">
             {error && <p className="text-danger mb-3">{error}</p>}
              <Form.Group className="mb-3">
                 <Form.Label>Recipient Email:</Form.Label>
                 <Form.Control
                    type="email"
                    value={recipientEmail}
                    onChange={this.handleEmailChange}
                    placeholder="Enter recipient email"
                    required
                 />
               </Form.Group>
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100"  onClick={this.handleSend} disabled={loading}>
                     {loading ? 'Sending...' : ( <><BiPaperPlane style={{width: '15px', height: '15px', marginTop: '-3px'}} className="me-2"/>Send Invoice</>)}
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={ () => { this.generatePDFForDownload() }}>
                  <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                  Download Copy
                </Button>
              </Col>
               <Col md={12} className="mt-3">
                    <Button variant="secondary" className="d-block w-100" onClick={this.handleSave}>
                        Save Invoice
                    </Button>
                </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3"/>
      </div>
    )
  }
}

export default InvoiceModal;