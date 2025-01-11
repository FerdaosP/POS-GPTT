import React, { useState, useEffect } from "react";
import { AlertCircle, Download, FileText, File, Trash2, List } from "lucide-react";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

import Alert, { AlertDescription } from "@/reparatiekaart/alert";
import Loading from "../reparatiekaart/Loading";
import DeleteConfirmationModal from "../reparatiekaart/DeleteConfirmationModal";
import ViewAttachmentsModal from "../reparatiekaart/ViewAttachmentsModal";
import RepairHistoryModal from "../reparatiekaart/RepairHistoryModal";
import { generateRepairID } from "../reparatiekaart/utils";
import RepairTicketPrint from "../reparatiekaart/RepairTicketPrint";
import ItemForm from "./ItemForm";
import InventoryList from "./InventoryList";
import ViewCategoriesModal from "./ViewCategoriesModal";

const InventoryEntry = () => {
    const [inventory, setInventory] = useState([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [isLoadingAddItem, setIsLoadingAddItem] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [editItem, setEditItem] = useState(null);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [categories, setCategories] = useState([]);

    const apiUrl = 'http://localhost:8000/api/products/';
    const categoryUrl = 'http://localhost:8000/api/service-categories/';

    useEffect(() => {
        fetchInventory();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(categoryUrl);
            const categoriesData = response.data.map(item => ({
                id: item.id,
                name: item.name
            }));
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories", error);
            showNotification("Error fetching categories! Check the console.", "error");
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await axios.get(apiUrl);
            setInventory(JSON.parse(JSON.stringify(response.data)));
        } catch (error) {
            console.error("Error fetching inventory:", error);
            showNotification("Error fetching inventory! Check the console.", "error");
        }
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddItem = async (newItemData) => {
        setIsLoadingAddItem(true);
        try {
            await axios.post(apiUrl, newItemData);
            fetchInventory();
            showNotification("Item added successfully!");
            setShowAddItemModal(false);
        } catch (error) {
            console.error("Error adding item:", error);
            showNotification("Error adding item!", "error");
        } finally {
            setIsLoadingAddItem(false);
        }
    };

    const handleEdit = (item) => {
        setEditItem({ ...item });
    };

    const handleUpdateItem = async (updatedItem) => {
        setIsLoadingUpdate(true);
        try {
            await axios.put(`${apiUrl}${updatedItem.sku}/`, updatedItem);
            fetchInventory();
            showNotification("Item updated successfully!");
            setEditItem(null);
        } catch (error) {
            console.error("Error updating item:", error);
            showNotification("Error updating item!", "error");
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const confirmDeleteItem = (itemId) => {
        setDeleteItemId(itemId);
    };

    const handleDeleteItem = async (itemId) => {
        setIsLoadingDelete(true);
        try {
            await axios.delete(`${apiUrl}${itemId}/`);
            fetchInventory();
            showNotification("Item deleted successfully!");
            setDeleteItemId(null);
        } catch (error) {
            console.error("Error deleting item:", error);
            showNotification("Error deleting item!", "error");
        } finally {
            setIsLoadingDelete(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterCategory = (e) => {
        setFilterCategory(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleExport = async (format) => {
        setIsLoadingExport(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const itemsToExport = inventory.filter(item => selectedItems.includes(item.sku));

            if (itemsToExport.length === 0) {
                showNotification("No items selected for export!", "error");
                return;
            }
            switch (format) {
                case 'csv':
                    exportToCSV(itemsToExport);
                    break;
                case 'pdf':
                    exportToPDF(itemsToExport);
                    break;
                default:
                    showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
            }
            showNotification(`Export to ${format.toUpperCase()} completed!`);
        } catch (error) {
            showNotification(`Error exporting to ${format.toUpperCase()}!`, "error");
        } finally {
            setIsLoadingExport(false);
        }
    };

    const exportToCSV = (itemsToExport) => {
        const csvContent = [
            [
                "SKU",
                "Name",
                "Description",
                "Price",
                "Quantity On Hand",
                "Category"
            ].join(","),
            ...itemsToExport.map((item) =>
                [
                    item.sku,
                    item.name,
                    item.description,
                    item.price,
                    item.quantity_on_hand,
                    item.category,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "inventory.csv";
        link.click();
        showNotification('CSV export completed');
    };

    const exportToPDF = (itemsToExport) => {
        const doc = new jsPDF();
        const tableColumn = [
            "SKU",
            "Name",
            "Description",
            "Price",
            "Quantity On Hand",
            "Category"
        ];

        const tableRows = itemsToExport.map(item => [
            item.sku,
            item.name,
            item.description,
            item.price,
            item.quantity_on_hand,
            item.category,
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('inventory.pdf');
        showNotification('PDF export completed');
    };

    const handleSelectRepair = (itemId, isSelected) => {
        if (isSelected) {
            setSelectedItems(prev => [...prev, itemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
    };

    const handleOpenAddItemModal = () => {
        setEditItem(null);
        setShowAddItemModal(true);
    };

    const handleCloseAddItemModal = () => {
        setShowAddItemModal(false);
    };

    const handleSaveCategory = async (category) => {
        try {
            await fetchCategories();
            showNotification("Category saved successfully!");
            setShowAddCategoryForm(false);
        } catch (err) {
            console.error("Error saving category", err);
            showNotification("Error saving category! Check the console", "error");
        }
    };

    const handleEditCategory = async (updatedCategory) => {
        try {
            if (!updatedCategory.id) {
                throw new Error("Category ID is missing.");
            }
            await axios.put(`${categoryUrl}${updatedCategory.id}/`, updatedCategory);
            fetchCategories();
            showNotification("Category updated successfully!");
        } catch (err) {
            console.error("Error updating category", err);
            showNotification("Error updating category! Check the console", "error");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`${categoryUrl}${categoryId}/`);
            fetchCategories();
            showNotification("Category deleted successfully!");
        } catch (err) {
            console.error("Error deleting category", err);
            showNotification("Error deleting category! Check the console", "error");
        }
    };

    const handleOpenCategoryList = () => {
        setShowCategoryList(true);
        setShowAddCategoryForm(false);
    };

    const handleCancelCategoryList = () => {
        setShowCategoryList(false);
        setShowAddCategoryForm(false);
    };

    const handleToggleAddCategoryForm = () => {
        setShowAddCategoryForm((prev) => !prev);
    };

    const filteredItems = inventory.filter((item) => {
        return (
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchTerm.toLowerCase())
            ) &&
            (filterCategory === "" || item.category === filterCategory)
        );
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });

    const paginatedItems = sortedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 relative">
            {(isLoadingAddItem || isLoadingDelete || isLoadingUpdate || isLoadingExport) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
                        <Loading className="animate-spin" isLoading={true} />
                        <span>Processing...</span>
                    </div>
                </div>
            )}

            {notification && (
                <Alert className={`mb-4 ${notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
                    <AlertCircle className={notification.type === 'error' ? 'text-red-500' : 'text-green-500'} />
                    <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
            )}

            <h1 className="text-2xl font-bold mb-4">Inventory</h1>

            {/* Search and Filter */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by Item Name or SKU"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border p-2 mr-2 rounded w-full"
                    aria-label="Search items"
                />
                <select
                    value={filterCategory}
                    onChange={handleFilterCategory}
                    className="border p-2 rounded"
                    aria-label="Filter by category"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                </select>
            </div>

            {/* Pagination Info */}
            <div className="mb-4">
                <span className="text-sm text-gray-600">
                    Showing page {currentPage} of {Math.ceil(sortedItems.length / itemsPerPage)}
                    ({sortedItems.length} total records)
                </span>
            </div>

            {/* Repair List */}
            <InventoryList
                inventory={paginatedItems}
                onPageChange={setCurrentPage}
                onDelete={confirmDeleteItem}
                onEditItem={handleEdit}
                onSort={handleSort}
            />

            {/* Export Buttons */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleExport("csv")}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                        aria-label="Export to CSV"
                    >
                        <Download size={16} />
                        <span>CSV</span>
                    </button>
                    <button
                        onClick={() => handleExport("pdf")}
                        className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                        aria-label="Export to PDF"
                    >
                        <File size={16} />
                        <span>PDF</span>
                    </button>
                </div>
                {/* Pagination Controls */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        aria-label="Previous Page"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(
                                    prev + 1,
                                    Math.ceil(sortedItems.length / itemsPerPage)
                                )
                            )
                        }
                        disabled={currentPage >= Math.ceil(sortedItems.length / itemsPerPage)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        aria-label="Next Page"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Add Repair Button */}
            <div className="flex items-center mb-4 space-x-2">
                <button
                    onClick={handleOpenAddItemModal}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    aria-label="Add New Item"
                >
                    Add Item
                </button>
                <button
                    onClick={handleOpenCategoryList}
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                    aria-label="View Categories"
                >
                    View Categories
                </button>
            </div>

            {/* Modals */}
            {showAddItemModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[calc(100%-64px)] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {editItem ? "Edit Item" : "Add Item"}
                        </h2>
                        <ItemForm
                            onSave={handleAddItem}
                            onClose={handleCloseAddItemModal}
                            initialItem={editItem}
                        />
                        <button onClick={handleCloseAddItemModal} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
                    </div>
                </div>
            )}
            <DeleteConfirmationModal
                isOpen={!!deleteItemId}
                onClose={() => setDeleteItemId(null)}
                onConfirm={() => handleDeleteItem(deleteItemId)}
                repairId={deleteItemId}
            />
            <ViewCategoriesModal
                isOpen={showCategoryList}
                onClose={handleCancelCategoryList}
                categories={categories}
                showAddCategoryForm={showAddCategoryForm}
                onToggleAddCategoryForm={handleToggleAddCategoryForm}
                onSaveCategory={handleSaveCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
            />
        </div>
    );
};

export default InventoryEntry;