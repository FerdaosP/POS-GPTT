import React from 'react';

const CustomerProfileCard = ({ customer, onClear, onViewProfile, currencySymbol }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg w-full border border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="col-span-2">
                    <div className="font-semibold text-base">
                        {customer.type === 'company' ? customer.companyName : `${customer.firstName} ${customer.lastName}`}
                    </div>
                    <div className="text-gray-600">{customer.email}</div>
                </div>

                <div>
                    <span className="text-gray-500">Phone:</span>
                    <div>{customer.phone}</div>
                </div>

                <div>
                    <span className="text-gray-500">Loyalty:</span>
                    <div className="text-teal-600 font-medium">
                        {customer.loyaltyPoints?.toFixed(2) || '0.00'} pts
                    </div>
                </div>

                {customer.type === 'company' && (
                    <div className="col-span-2">
                        <span className="text-gray-500">VAT Number:</span>
                        <div>{customer.vatNumber}</div>
                    </div>
                )}

                <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Store Credits:</span>
                        <span className="font-medium">
                            {currencySymbol}{customer.storeCredits?.toFixed(2) || '0.00'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-2 flex justify-between">
                <button
                    onClick={onClear}
                    className="text-sm text-red-600 hover:text-red-700"
                >
                    Clear Customer
                </button>
                <button
                    onClick={onViewProfile}
                    className="text-sm text-teal-600 hover:text-teal-700"
                >
                    Full Profile
                </button>
            </div>
        </div>
    );
};

export default CustomerProfileCard;