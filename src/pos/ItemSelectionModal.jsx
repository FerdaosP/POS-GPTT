import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './POS.css';
import { FilePlus, List } from "lucide-react";
import ItemForm from "./ItemForm";
import axios from 'axios';
import CategoryForm from "./CategoryForm";

const ItemSelectionModal = ({ isOpen, onClose, onItemSelect, items = [] }) => {
    const [showItemForm, setShowItemForm] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCategoryForm, setShowCategoryForm] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8000/api/services/category/');
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching Categories", err);
                setError("Error fetching categories. Check the console");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleItemClick = (item) => {
        onItemSelect(item);
        onClose();
    };

    const handleOpenNewItemForm = () => {
        setShowItemForm(true);
    };

    const handleCloseNewItemForm = () => {
        setShowItemForm(false);
    };

    const handleSaveItem = (item) => {
        onItemSelect(item);
        onClose();
        setShowItemForm(false);
    };

    const handleSelectCategory = (value) => {
        setSelectedCategory(value);
    };

    const renderFilteredItems = () => {
        if (selectedCategory === "" || selectedCategory === "all") {
            return items.map((item) => (
                <li key={item.id} className="pos-item" onClick={() => handleItemClick(item)}>
                    <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-stock">Item stock: {item.stock}</div>
                    </div>
                    <div className="item-price">€{item.price}</div>
                </li>
            ));
        }
        return items.filter(item => item.category === selectedCategory).map((item) => (
            <li key={item.id} className="pos-item" onClick={() => handleItemClick(item)}>
                <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-stock">Item stock: {item.stock}</div>
                </div>
                <div className="item-price">€{item.price}</div>
            </li>
        ));
    };

    const handleOpenCategoryForm = () => {
        setShowCategoryForm(true);
    };

    const handleCancelCategoryForm = () => {
        setShowCategoryForm(false);
    };

    const handleSaveCategory = (category) => {
        setCategories(prev => [...prev, category]);
        setSelectedCategory(category.name);
        setShowCategoryForm(false);
    };

    const handleShowAllItems = () => {
        setSelectedCategory(""); // Reset selected category to show all items
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Main Item Selection Modal */}
            <Modal show={isOpen} onHide={onClose} centered size="lg" style={{ zIndex: 1050 }} backdrop={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-3">
                        {/* Add Item, Add Category, and All Items Buttons */}
                        <div className="flex items-center space-x-3 mb-3">
                            <Button onClick={handleOpenNewItemForm} variant="light">
                                <FilePlus size={16} className="inline-block mr-1" />
                                Add Item
                            </Button>

                            <Button onClick={handleOpenCategoryForm} variant="light">
                                <List size={16} className="inline-block mr-1" />
                                Add Category
                            </Button>

                            <Button onClick={handleShowAllItems} variant="light">
                                All Items
                            </Button>
                        </div>

                        {/* Category Buttons Grid */}
                        <div className="category-grid">
                            {categories?.map((category) => (
                                <Button
                                    variant="light"
                                    onClick={() => handleSelectCategory(category.name)}
                                    key={category.id}
                                    className="category-button"
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>

                        {/* Item List */}
                        <div className="space-y-2">
                            <ul className="space-y-2">
                                {renderFilteredItems()}
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Item Form Modal */}
            {showItemForm && (
                <Modal show={showItemForm} onHide={handleCloseNewItemForm} centered backdrop="static" style={{ zIndex: 1060 }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ItemForm
                            onSave={handleSaveItem}
                            onClose={handleCloseNewItemForm}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseNewItemForm}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Category Form Modal */}
            {showCategoryForm && (
                <Modal show={showCategoryForm} onHide={handleCancelCategoryForm} centered backdrop="static" style={{ zIndex: 1060 }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CategoryForm
                            onSave={handleSaveCategory}
                            onClose={handleCancelCategoryForm}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancelCategoryForm}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default ItemSelectionModal;