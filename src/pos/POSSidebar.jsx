// src/pos/POSSidebar.jsx
import React from 'react';
import POSItemInput from './POSItemInput';

const POSSidebar = () => {
    return (
         <div className="flex flex-col h-full">
           <div className="mb-4">
             <div className="flex items-center justify-between mb-2">
                 <span className="text-lg font-semibold">Walk-in Customer</span>
                 <button className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition duration-200" aria-label="Add new Customer">New</button>
              </div>
                  <POSItemInput/>
             </div>
             <div className="overflow-y-auto flex-1">
                <table className="w-full table-auto">
                    <thead>
                       <tr className="text-left">
                            <th className="px-2 py-1 font-medium">QTY</th>
                            <th className="px-2 py-1 font-medium">ITEM NAME</th>
                         <th className="px-2 py-1 font-medium">PRICE</th>
                         <th className="px-2 py-1 font-medium">TAX</th>
                         <th className="px-2 py-1 font-medium">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                        {/* Add a list of items that are being added to the cart */}
                    </tbody>
                </table>
            </div>
             <div className="mt-4 space-y-2">
                 <div className="flex justify-between text-gray-700">
                     <span className="font-medium">Total Items:</span>
                    <span>0</span>
                   </div>
                    <div className="flex justify-between text-gray-700">
                       <span className="font-medium">Sub Total:</span>
                         <span>$0.00</span>
                   </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Discount:</span>
                         <span>$0.00</span>
                    </div>
                     <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Tax:</span>
                         <span>$0.00</span>
                     </div>
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                        <span>TOTAL:</span>
                       <span>$0.00</span>
                    </div>
                </div>
        </div>
    );
};

export default POSSidebar;