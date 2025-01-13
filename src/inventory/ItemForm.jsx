import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'; // Import axios

const ItemForm = ({onClose, onSave, initialItem}) => {
    const [form, setForm] = useState(initialItem || {
        sku: "",
        name: "",
        description: "",
        price: "",
        quantity_on_hand: "",
        category: "",
    });

    const [categories, setCategories] = useState([]); // New state for categories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

      useEffect(() => {
        const fetchCategories = async () => {
             setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8000/api/service-categories/');
                 const categoriesData = response.data.map(item => ({
                id: item.id,
                name: item.name
                 }));
                setCategories(categoriesData);

            } catch (err) {
                console.error("Error fetching Categories", err);
                setError("Error fetching categories. Check the console");
            } finally {
                  setLoading(false);
            }
         };
          fetchCategories();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form)
    }
     if (loading) {
          return <div>Loading categories...</div>
      }

      if(error) {
          return <div className="text-red-500">Error loading categories.</div>
      }

    return (
        <Form onSubmit={handleSubmit}>
              {!form.imei && (
                <Form.Group className="mb-3">
                   <Form.Label>SKU:</Form.Label>
                   <Form.Control type="text" name="sku" value={form.sku} onChange={handleChange} required className="input-premium"/>
               </Form.Group>
              )}
                <Form.Group className="mb-3">
                     <Form.Label>Name:</Form.Label>
                       <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required className="input-premium"/>
                   </Form.Group>
                  <Form.Group className="mb-3">
                      <Form.Label>Description:</Form.Label>
                        <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} rows={3} className="input-premium"/>
                 </Form.Group>
                 <Form.Group className="mb-3">
                    <Form.Label>Price:</Form.Label>
                     <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required className="input-premium"/>
                   </Form.Group>
                 <Form.Group className="mb-3">
                     <Form.Label>Quantity:</Form.Label>
                      <Form.Control type="number" name="quantity_on_hand" value={form.quantity_on_hand} onChange={handleChange} required className="input-premium"/>
                 </Form.Group>
                 <Form.Group className="mb-3">
                     <Form.Label>Category:</Form.Label>
                     <Form.Control
                        as="select"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                         className="select-premium"
                    >
                         <option value="" disabled>Select a category</option>
                            {categories?.map((category) => (
                                <option value={category.name} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </Form.Control>
                 </Form.Group>
                <div className="flex justify-end space-x-2 mt-4">
                     <Button variant="secondary" onClick={onClose}>Cancel</Button>
                      <Button variant="primary" type="submit">OK</Button>
                </div>
           </Form>
    );
};

export default ItemForm;