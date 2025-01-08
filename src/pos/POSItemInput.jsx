// src/pos/POSItemInput.jsx
import React from "react";
import { Search } from "lucide-react";

const POSItemInput = () => {
    return (
          <div className="relative">
            <input
                type="text"
                 placeholder="Enter item name, SKU or scan barcode"
                 className="border border-gray-300 rounded px-2 py-1 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
                aria-label="Enter item name"
            />
             <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search size={16} className="text-gray-500" />
              </div>
           </div>
     );
};
export default POSItemInput