import React, { useState } from 'react';
import CategoryForm from './CategoryForm';

const ViewCategoriesModal = ({
    isOpen,
    onClose,
    categories,
    showAddCategoryForm,
    onToggleAddCategoryForm,
    onSaveCategory,
    onEditCategory,
    onDeleteCategory,
}) => {
    const [editingCategory, setEditingCategory] = useState(null);

    if (!isOpen) return null;

    const handleEditClick = (category) => {
        setEditingCategory(category);
    };

    const handleSaveEdit = async (updatedCategory) => {
        await onEditCategory(updatedCategory);
        setEditingCategory(null);
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[calc(100%-64px)] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                {!showAddCategoryForm ? (
                    <>
                        {categories?.map((category) => (
                            <div key={category.id} className="p-2 border rounded mb-2 flex justify-between items-center">
                                {editingCategory?.id === category.id ? (
                                    <CategoryForm
                                        initialCategory={editingCategory} // Pass the entire category object, including the `id`
                                        onSave={handleSaveEdit}
                                        onClose={handleCancelEdit}
                                    />
                                ) : (
                                    <>
                                        <span>{category.name}</span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(category)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDeleteCategory(category.id)} // Pass the category ID
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={onToggleAddCategoryForm}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Add Category
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <CategoryForm onSave={onSaveCategory} onClose={onToggleAddCategoryForm} />
                        <button
                            onClick={onToggleAddCategoryForm}
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Back to Categories
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewCategoriesModal;