import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const SettingsForm = ({ initialSettings, onSave }) => {
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings)
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
            // Append other settings as is
             for (const key in settings) {
                  if(key !== 'logoUrl'){
                        formData.append(key, settings[key]);
                    }
             }

           if(settings.logoUrl){
                 const base64String = settings.logoUrl;
                  const byteString = atob(base64String.split(',')[1]);
                    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0]
                   const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                      ia[i] = byteString.charCodeAt(i);
                    }
                    const blob = new Blob([ab], { type: mimeString });
                    const file = new File([blob], 'logo.png', { type: mimeString });
                    formData.append('logoUrl', file);
              }
           const response = await axios.put('http://localhost:8000/api/profile/1/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            if (response.status === 200) {
                 onSave(response.data);
                console.log('Settings saved:', response.data);
            } else{
               setError(`Error updating settings: ${response.statusText}`);
            }

        } catch (err) {
            console.error('There was an error updating settings:', err);
            setError(`There was an error updating settings: ${err.message}`);
        } finally {
             setLoading(false);
         }
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