import React, { useState, useEffect } from 'react';
import { saveCustomer, getCustomers, deleteCustomer } from '../utils/customerUtils';
import CustomerProfileModal from './CustomerProfileModal';
import { User, Briefcase, Eye, Loader2, Edit, Trash2 } from 'lucide-react';

const CustomerManagerModal = ({ onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFilter, setSearchFilter] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [viewProfile, setViewProfile] = useState(null);
    const [customerType, setCustomerType] = useState('person');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState(new Set());
    const [bulkAction, setBulkAction] = useState('');
    const pageSize = 10;

    const [customers, setCustomers] = useState([]);

    // Add VAT lookup state
    const [isVatLoading, setIsVatLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        try {
            const allCustomers = getCustomers();
            setCustomers(allCustomers);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setSelectedCustomerIds(new Set());
    }, [customers]);

    const filteredCustomers = customers.filter(c => {
        if (activeTab === 'individuals' && c.type !== 'person') return false;
        if (activeTab === 'companies' && c.type !== 'company') return false;

        const searchLower = searchTerm.toLowerCase();
        const fields = {
            name: c.type === 'company' ? c.companyName : `${c.firstName} ${c.lastName}`,
            phone: c.phone,
            email: c.email,
            vat: c.vatNumber,
            all: [
                c.companyName,
                `${c.firstName} ${c.lastName}`,
                c.phone,
                c.email,
                c.vatNumber
            ].join(' ')
        }[searchFilter];

        return fields.toLowerCase().includes(searchLower);
    });

    const totalPages = Math.ceil(filteredCustomers.length / pageSize);
    const individualCount = customers.filter(c => c.type === 'person').length;
    const companyCount = customers.filter(c => c.type === 'company').length;

    const handleSaveCustomer = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const customerData = {
            type: customerType,
            companyName: formData.get('companyName'),
            vatNumber: formData.get('vatNumber')?.toUpperCase(),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            primaryAddress: formData.get('address'),
        };
       
          // Add EU VAT validation
        if (customerData.type === 'company') {
            const vatRegex = /^[A-Z]{2}[A-Z0-9]{2,12}$/;
            if (!vatRegex.test(customerData.vatNumber)) {
                alert('Invalid EU VAT format. Use CountryCode + VAT number (e.g. DE123456789)');
                return;
            }
        }

        try {
            const savedCustomer = saveCustomer(
                editingCustomer ? { ...editingCustomer, ...customerData } : customerData
            );

            setCustomers(customers.map(c =>
                c.id === savedCustomer.id ? savedCustomer : c
            ));

            if (!editingCustomer) onSelect(savedCustomer);
            setShowAddForm(false);
            setEditingCustomer(null);
            if (!editingCustomer) onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteCustomer = (customerId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (confirmDelete) {
            try {
                const updatedCustomers = deleteCustomer(customerId);
                setCustomers(updatedCustomers);
            } catch (error) {
                alert("Failed to delete customer: " + error.message);
            }
        }
    };

    const handleBulkDelete = () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${selectedCustomerIds.size} customers?`
        );

        if (confirmDelete) {
            try {
                const updatedCustomers = deleteCustomer([...selectedCustomerIds]);
                setCustomers(updatedCustomers);
                setSelectedCustomerIds(new Set());
            } catch (error) {
                alert("Failed to delete customers: " + error.message);
            }
        }
    };

    const handleSelectCustomer = (customerId) => {
        const newSelection = new Set(selectedCustomerIds);
        if (newSelection.has(customerId)) {
            newSelection.delete(customerId);
        } else {
            newSelection.add(customerId);
        }
        setSelectedCustomerIds(newSelection);
    };

    const handleSelectAll = () => {
        if (selectedCustomerIds.size === filteredCustomers.length) {
            setSelectedCustomerIds(new Set());
        } else {
            setSelectedCustomerIds(new Set(
                filteredCustomers.map(c => c.id)
            ));
        }
    };


    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setShowAddForm(true);
    };


  // Updated VIES lookup function
    const fetchCompanyViaVIES = async (vat) => {
        // Extract country code and VAT number
        const countryCode = vat.substring(0, 2).toUpperCase();
        const vatNumber = vat.substring(2).replace(/\s/g, '');
        
        // Validate country code
        const euCountries = [
            'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES',
            'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
            'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
        ];
        
        if (!euCountries.includes(countryCode)) {
            throw new Error('Invalid EU country code');
        }

        try {
            const response = await fetch(
                `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode}/vat/${vatNumber}`
            );
            
            if (!response.ok) throw new Error('VIES service unavailable');
            
            const data = await response.json();
            
            if (data.isValid) {
                return {
                    companyName: data.name,
                    address: data.address.replace(/\n/g, ', '),
                    vatNumber: `${countryCode}${vatNumber}`
                };
            }
            throw new Error('VAT number not found in VIES system');
        } catch (error) {
            throw new Error(`VIES lookup failed: ${error.message}`);
        }
    };

    // Auto-fill handler
    const handleVatLookup = async () => {
        if (!editingCustomer?.vatNumber) return;
        
        try {
            setIsVatLoading(true);
            const companyData = await fetchCompanyViaVIES(editingCustomer.vatNumber);
            
            setEditingCustomer(prev => ({
                ...prev,
                companyName: companyData.companyName,
                primaryAddress: companyData.address,
                vatNumber: companyData.vatNumber
            }));
            
        } catch (error) {
            alert(error.message);
        } finally {
            setIsVatLoading(false);
        }
    };


    const renderCustomerRow = (customer) => (
        <div key={customer.id} className="flex items-center p-2 hover:bg-gray-50 border-b">
            <input
                type="checkbox"
                checked={selectedCustomerIds.has(customer.id)}
                onChange={() => handleSelectCustomer(customer.id)}
                className="mr-2"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {customer.type === 'company' ? (
                        <Briefcase size={16} className="text-teal-600" />
                    ) : (
                        <User size={16} className="text-blue-600" />
                    )}
                    <div className="truncate font-medium">
                        {customer.type === 'company'
                            ? customer.companyName
                            : `${customer.firstName} ${customer.lastName}`}
                    </div>
                </div>
                <div className="text-sm text-gray-600 truncate">
                    {customer.phone} • {customer.email?.split('@')[0]}
                    {customer.vatNumber && ` • VAT: ${customer.vatNumber}`}
                </div>
            </div>
              <div className="flex items-center gap-2">
                {/* Select Button */}
                <button
                    onClick={() => onSelect(customer)}
                    className="ml-2 p-2 hover:bg-green-100 rounded text-green-600"
                >
                    Select
                </button>
                  <button
                      onClick={() => setViewProfile(customer)}
                      className="ml-2 p-2 hover:bg-gray-200 rounded"
                  >
                      <Eye size={18} />
                  </button>
                   <button
                      onClick={() => handleEditCustomer(customer)}
                      className="ml-2 p-2 hover:bg-blue-100 rounded text-blue-600"
                  >
                      <Edit size={18} />
                  </button>
                  <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="ml-2 p-2 hover:bg-red-100 rounded text-red-600"
                  >
                      <Trash2 size={18} />
                  </button>
               </div>
        </div>
    );

    const BulkActionToolbar = () => (
        <div className="mb-4 p-2 bg-gray-50 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={selectedCustomerIds.size > 0}
                    indeterminate={
                        selectedCustomerIds.size > 0 &&
                        selectedCustomerIds.size < filteredCustomers.length
                    }
                    onChange={handleSelectAll}
                />
                <span>{selectedCustomerIds.size} selected</span>
            </div>
            <div className="flex gap-2">
                <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="border rounded px-2"
                >
                    <option value="">Bulk Actions</option>
                    <option value="delete">Delete</option>
                </select>
                <button
                    onClick={handleBulkDelete}
                    disabled={!bulkAction}
                    className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                >
                    Apply
                </button>
            </div>
        </div>
    );


    // Update your company form section
    const renderCustomerForm = () => {
        const customer = editingCustomer || {};
        return (
            <form onSubmit={handleSaveCustomer} className="space-y-4">
                <div className="flex gap-2 mb-4">
                   <button
                        type="button"
                        onClick={() => setCustomerType('person')}
                        className={`flex-1 py-2 rounded ${customerType === 'person'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-200'}`}
                    >
                        Individual
                    </button>
                    <button
                        type="button"
                        onClick={() => setCustomerType('company')}
                        className={`flex-1 py-2 rounded ${customerType === 'company'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-200'}`}
                    >
                        Company
                    </button>
                </div>

                 {customerType === 'company' && (
                    <div className="relative mb-4">
                        <input
                            name="vatNumber"
                            value={customer.vatNumber || ''}
                            onChange={(e) => {
                                const value = e.target.value
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9]/g, '')
                                    .substring(0, 14);
                                
                                setEditingCustomer(prev => ({
                                    ...prev,
                                    vatNumber: value
                                }));
                            }}
                            placeholder="EU VAT (e.g. DE123456789)"
                            className="w-full p-2 border rounded pr-32"
                            pattern="[A-Z]{2}[A-Z0-9]{2,12}"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleVatLookup}
                            disabled={isVatLoading || !customer.vatNumber?.match(/^[A-Z]{2}/)}
                            className="absolute right-2 top-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                        >
                            {isVatLoading ? (
                                <span className="flex items-center">
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Loading...
                                </span>
                            ) : (
                                'Auto-Fill via VAT'
                            )}
                        </button>
                        <div className="text-sm text-gray-500 mt-1">
                            Supported formats: DE123456789, FRXX123456789, NL123456789B01, etc.
                        </div>
                    </div>
                 )}

                {customerType === 'company' ? (
                    
                        <input
                            name="companyName"
                            value={customer.companyName || ''}
                            onChange={(e) => setEditingCustomer(prev => ({
                                ...prev,
                                companyName: e.target.value
                            }))}
                            placeholder="Company Name"
                            className="w-full p-2 border rounded"
                            required
                        />
                    
                ) : (
                    <>
                        <input
                            name="firstName"
                            defaultValue={customer.firstName}
                            placeholder="First Name"
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            name="lastName"
                            defaultValue={customer.lastName}
                            placeholder="Last Name"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </>
                )}

                {/* Common fields with manual override */}
                <input
                    name="phone"
                    value={customer.phone || ''}
                    onChange={(e) => setEditingCustomer(prev => ({
                        ...prev,
                        phone: e.target.value
                    }))}
                    placeholder="Phone"
                    className="w-full p-2 border rounded"
                    required
                />
                
                <input
                    name="email"
                    type="email"
                    value={customer.email || ''}
                    onChange={(e) => setEditingCustomer(prev => ({
                        ...prev,
                        email: e.target.value
                    }))}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                
                <textarea
                    name="address"
                    value={customer.primaryAddress || ''}
                    onChange={(e) => setEditingCustomer(prev => ({
                        ...prev,
                        primaryAddress: e.target.value
                    }))}
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                    rows="3"
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="flex-1 bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
                    >
                        {editingCustomer ? 'Update' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowAddForm(false);
                            setEditingCustomer(null);
                        }}
                        className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    };


    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto">
                <h2 className="text-xl font-bold mb-4">Manage Customers</h2>

                {!showAddForm ? (
                    <>
                        <div className="flex gap-2 mb-4">
                            <button
                                className={`px-4 py-2 rounded-t ${activeTab === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab('all')}
                            >
                                All ({customers.length})
                            </button>
                            <button
                                className={`px-4 py-2 rounded-t ${activeTab === 'individuals' ? 'bg-teal-600 text-white' : 'bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab('individuals')}
                            >
                                Individuals ({individualCount})
                            </button>
                            <button
                                className={`px-4 py-2 rounded-t ${activeTab === 'companies' ? 'bg-teal-600 text-white' : 'bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab('companies')}
                            >
                                Companies ({companyCount})
                            </button>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <select
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="border rounded px-2"
                            >
                                <option value="all">All Fields</option>
                                <option value="name">Name</option>
                                <option value="phone">Phone</option>
                                <option value="email">Email</option>
                                <option value="vat">VAT Number</option>
                            </select>

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Search ${searchFilter}...`}
                                className="flex-1 p-2 border rounded"
                            />
                        </div>

                        {selectedCustomerIds.size > 0 && <BulkActionToolbar />}

                        {isLoading ? (
                            <div className="py-4 text-center text-gray-500">
                                <Loader2 className="animate-spin inline-block mr-2" />
                                Loading customers...
                            </div>
                        ) : (
                            <>
                                <div className="max-h-96 overflow-y-auto mb-4">
                                    {filteredCustomers
                                        .slice((page - 1) * pageSize, page * pageSize)
                                        .map(renderCustomerRow)}
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span>Page {page} of {totalPages}</span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full mt-4 bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
                        >
                            Add New Customer
                        </button>
                    </>
                ) : (
                    renderCustomerForm()
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-4 bg-gray-200 py-2 rounded hover:bg-gray-300"
                >
                    Close
                </button>
            </div>

            {viewProfile && (
                <CustomerProfileModal
                    customer={viewProfile}
                    onClose={() => setViewProfile(null)}
                />
            )}
        </div>
    );
};

export default CustomerManagerModal;