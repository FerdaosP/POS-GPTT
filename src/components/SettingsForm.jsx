import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card, Modal } from 'react-bootstrap';
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
       emailTemplate: "<p>Dear {{ invoice.billTo }},</p> <p>I hope this message finds you well.</p> <p>Please find your invoice #{{ invoice.invoiceNumber }} attached to this email. If you have any questions or need further assistance, feel free to reach out to us.</p> <p>Thank you for your business, and we look forward to serving you again!</p> <p>Best regards,</p>   <p> {{ profile.companyName }}</p> <p> {{ profile.address }}</p>  <p> {{ profile.phoneNumber }}</p>  <p> {{ profile.email }}</p>"
      });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [emailTemplate, setEmailTemplate] = useState(initialSettings?.emailTemplate || "<p>Dear {{ invoice.billTo }},</p> <p>I hope this message finds you well.</p> <p>Please find your invoice #{{ invoice.invoiceNumber }} attached to this email. If you have any questions or need further assistance, feel free to reach out to us.</p> <p>Thank you for your business, and we look forward to serving you again!</p> <p>Best regards,</p>   <p> {{ profile.companyName }}</p> <p> {{ profile.address }}</p>  <p> {{ profile.phoneNumber }}</p>  <p> {{ profile.email }}</p>");


    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings)
            if(initialSettings.emailTemplate){
             setEmailTemplate(initialSettings.emailTemplate)
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


    return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <Card className="p-4">
                <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                          <Form.Label>Logo:</Form.Label>
                          <Form.Control
                              type="file"
                            name="logoUrl"
                              onChange={handleChange}
                            accept="image/*"
                          />
                      </Form.Group>
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
                    <Form.Group className="mb-3">
                         <Form.Label>Email Host Password:</Form.Label>
                           <Form.Control
                            type="password"
                              name="email_host_password"
                             value={settings.email_host_password}
                             onChange={handleChange}
                            />
                   </Form.Group>
                     <Button variant="outline-secondary" onClick={handleOpenTemplateModal} className="mb-3">Edit Email Template</Button>

                        <Modal show={showTemplateModal} onHide={handleCloseTemplateModal} size="lg" centered>
                             <Modal.Body>
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
            </Card>
        </div>
    );
};

export default SettingsForm;