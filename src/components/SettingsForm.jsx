import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button,  Modal } from 'react-bootstrap';
import axios from 'axios';
import EmailTemplateEditor from './EmailTemplateEditor';

const SettingsForm = ({ initialSettings, onSave }) => {
    const [settings, setSettings] = useState(initialSettings || {
        companyName: "",
        address: "",
        phoneNumber: "",
        email: "",
        vatNumber: "",
        logoUrl: null,
         email_host: "",
        email_host_user: "",
       email_host_password: "",
       termsAndConditions: "",
       print_layout:"",
       default_font: "",
       emailTemplate: "<p>Dear {{ invoice.billTo }},</p> <p>I hope this message finds you well.</p> <p>Please find your invoice #{{ invoice.invoiceNumber }} attached to this email. If you have any questions or need further assistance, feel free to reach out to us.</p> <p>Thank you for your business, and we look forward to serving you again!</p> <p>Best regards,</p>   <p> {{ profile.companyName }}</p> <p> {{ profile.address }}</p>  <p> {{ profile.phoneNumber }}</p>  <p> {{ profile.email }}</p>"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [emailTemplate, setEmailTemplate] = useState(initialSettings?.emailTemplate || "<p>Dear {{ invoice.billTo }},</p> <p>I hope this message finds you well.</p> <p>Please find your invoice #{{ invoice.invoiceNumber }} attached to this email. If you have any questions or need further assistance, feel free to reach out to us.</p> <p>Thank you for your business, and we look forward to serving you again!</p> <p>Best regards,</p>   <p> {{ profile.companyName }}</p> <p> {{ profile.address }}</p>  <p> {{ profile.phoneNumber }}</p>  <p> {{ profile.email }}</p>");
      const [showPrintLayoutModal, setShowPrintLayoutModal] = useState(false);
      const [printLayout, setPrintLayout] = useState(initialSettings?.print_layout || "<div style=\"font-family: monospace;\">   <h2 style=\"text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 5mm;\">{{ companyName }}</h2> <div style=\"font-family: monospace;\"> <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Ticket #</strong> {{ repairTicketNumber }}</p>   <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Customer:</strong> {{ customerName }}</p> <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Phone:</strong> {{ phoneNumber }}</p>  <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Device:</strong> {{ deviceType }}</p> <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>IMEI:</strong> {{ imei }}</p>  <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Issue:</strong> {{ issueDescription }}</p>  <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Technician:</strong> {{ repairTechnician }}</p>   <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Price:</strong> {{ priceEstimate }}</p>   <p style=\"font-size: 12pt; margin: 2mm 0;\"><strong>Date:</strong> {{ dateReceived }}</p> </div>  <p style=\"text-align: center; font-size: 14pt; margin-top: 5mm;\">*{{ repairTicketNumber }}*</p>  <p style=\"text-align: center; font-size: 12pt; margin-top: 5mm;\">Thank you!</p>  <div style=\"font-size: 10pt; margin-top: 5mm; font-family: monospace;\"> {{ termsAndConditions }}</div> </div>");


    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings)
            if(initialSettings.emailTemplate){
             setEmailTemplate(initialSettings.emailTemplate)
            }
            if(initialSettings.print_layout){
              setPrintLayout(initialSettings.print_layout)
            }
        }
    }, [initialSettings])

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
         let updatedValue = value;
         if (type === 'file' && files && files.length > 0) {
            const file = files[0];
             const reader = new FileReader();
              reader.onloadend = () => {
                 setSettings(prev => ({...prev, [name]: reader.result}));
            };
              reader.readAsDataURL(file);
        } else {
            setSettings({ ...settings, [name]: value });
         }
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
          const formData = new FormData();
          for (const key in settings) {
              if (key !== 'logoUrl') {
                  formData.append(key, settings[key] || "");
              }
          }
  
          // Handle logo only if it exists and is a valid Base64 string
          if (settings.logoUrl && typeof settings.logoUrl === 'string' && settings.logoUrl.startsWith('data:image')) {
              try {
                  const base64String = settings.logoUrl;
                  const byteString = atob(base64String.split(',')[1]);
                  const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
                  const ab = new ArrayBuffer(byteString.length);
                  const ia = new Uint8Array(ab);
                  for (let i = 0; i < byteString.length; i++) {
                      ia[i] = byteString.charCodeAt(i);
                  }
                  const blob = new Blob([ab], { type: mimeString });
                  const file = new File([blob], 'logo.png', { type: mimeString });
                  formData.append('logoUrl', file);
              } catch (atobError) {
                  console.error("Error decoding base64 or creating blob:", atobError);
                  setError(`Error processing logo: ${atobError.message}`);
              }
          } else if (settings.logoUrl === null || settings.logoUrl === "") {
              // If logoUrl is empty or null, skip adding it to the formData
              console.log("No logo provided. Skipping logo upload.");
          } else {
              console.error("Invalid logo format. Please upload a valid image.");
              setError("Invalid logo format. Please upload a valid image.");
          }
  
          const response = await axios.put('http://localhost:8000/api/profile/1/', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
  
          if (response.status === 200) {
              onSave(response.data);
              console.log('Settings saved:', response.data);
          } else {
              setError(`Error updating settings: ${response.statusText}`);
          }
  
      } catch (err) {
          console.error('There was an error updating settings:', err);
          setError(`There was an error updating settings: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };
     const handleOpenTemplateModal = () => {
        setShowTemplateModal(true);
    };

     const handleCloseTemplateModal = () => {
        setShowTemplateModal(false);
    };

  const handleSaveTemplate = (template) => {
       setEmailTemplate(template);
       setSettings(prev => ({...prev, emailTemplate: template}));
      setShowTemplateModal(false);
    };

    const handleOpenPrintLayoutModal = () => {
      setShowPrintLayoutModal(true);
   };

   const handleClosePrintLayoutModal = () => {
     setShowPrintLayoutModal(false);
   };
  const handleSavePrintLayout = (template) => {
      setPrintLayout(template);
      setSettings(prev => ({...prev, print_layout: template}));
      setShowPrintLayoutModal(false);
  };

    return (
         <div className="p-4" style={{ height: '100vh', overflowY: 'auto' }}>
        <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
         <div className="full-width-container p-4">
                <Form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <Form.Label className="block font-medium mb-1">Logo:</Form.Label>
                         {settings.logoUrl ? (
                           <img src={settings.logoUrl} alt="Logo Preview" className="max-w-[150px] max-h-[100px] mb-2 rounded" />
                           ) : (
                                 <div className="w-[150px] h-[100px] border rounded bg-gray-100 mb-2"></div>
                            )}
                          <Form.Control
                            type="file"
                             name="logoUrl"
                              onChange={handleChange}
                             accept="image/*"
                         />
                      </div>
                   <div className="grid grid-cols-2 gap-4">
                        <Form.Group className="mb-3">
                            <Form.Label>Company Name:</Form.Label>
                            <Form.Control
                                type="text"
                              name="companyName"
                                value={settings.companyName}
                                onChange={handleChange}
                                required
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                required
                            />
                           </Form.Group>
                   </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number:</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phoneNumber"
                              value={settings.phoneNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                         <Form.Group className="mb-3">
                           <Form.Label>Email Address:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                              value={settings.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <Form.Group className="mb-3">
                          <Form.Label>VAT Number:</Form.Label>
                           <Form.Control
                                  type="text"
                                name="vatNumber"
                               value={settings.vatNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Default Font:</Form.Label>
                             <Form.Control
                                 type="text"
                                  name="default_font"
                                 value={settings.default_font}
                                 onChange={handleChange}
                           />
                        </Form.Group>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <Form.Group className="mb-3">
                        <Form.Label>Email Host:</Form.Label>
                        <Form.Control
                            type="text"
                             name="email_host"
                            value={settings.email_host}
                            onChange={handleChange}
                        />
                     </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Host User:</Form.Label>
                             <Form.Control
                                type="text"
                                name="email_host_user"
                                 value={settings.email_host_user}
                                onChange={handleChange}
                             />
                       </Form.Group>
                    </div>
                     <Form.Group className="mb-3">
                        <Form.Label>Email Host Password:</Form.Label>
                           <Form.Control
                            type="password"
                              name="email_host_password"
                             value={settings.email_host_password}
                             onChange={handleChange}
                            />
                   </Form.Group>
                     <Form.Group className="mb-3">
                         <Form.Label>Terms and Conditions</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="termsAndConditions"
                                value={settings.termsAndConditions}
                                onChange={handleChange}
                                rows={3}
                            />
                        </Form.Group>

                      <Button variant="outline-secondary" onClick={handleOpenPrintLayoutModal} className="mb-3">Edit Print Layout</Button>
                        <Modal show={showPrintLayoutModal} onHide={handleClosePrintLayoutModal} size="lg" centered>
                             <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                               <EmailTemplateEditor
                                  initialContent={printLayout}
                                  onSave={handleSavePrintLayout}
                                   onCancel={handleClosePrintLayoutModal}
                               />
                                </Modal.Body>
                        </Modal>
                         <Button variant="outline-secondary" onClick={handleOpenTemplateModal} className="mb-3">Edit Email Template</Button>
                            <Modal show={showTemplateModal} onHide={handleCloseTemplateModal} size="lg" centered>
                                  <Modal.Body  style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <EmailTemplateEditor
                                      initialContent={emailTemplate}
                                       onSave={handleSaveTemplate}
                                      onCancel={handleCloseTemplateModal}
                                  />
                                </Modal.Body>
                             </Modal>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                           {error && <p className="text-red-500 mt-2">{error}</p>}
                    </Form>
                </div>
            </div>
    );
};

export default SettingsForm;