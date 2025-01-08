// src/pos/POS.jsx
import React from 'react';
import POSHeader from './POSHeader';
import POSSidebar from './POSSidebar';
import POSProductSelection from './POSProductSelection';

const POS = () => {
    return (
        <div className="h-screen flex flex-col">
             {/* Header */}
            <header className="bg-gray-100 p-4 border-b">
                <div className="container mx-auto">
                    <POSHeader />
                 </div>
           </header>

             {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Left) */}
               <aside className="w-full md:w-1/4 bg-gray-200 border-r p-4 overflow-y-auto">
                   <div className="container mx-auto">
                     <POSSidebar />
                   </div>
               </aside>

                 {/* Product Selection (Right) */}
                <main className="flex-1 p-4 overflow-y-auto">
                   <div className="container mx-auto">
                     <POSProductSelection />
                  </div>
               </main>
            </div>
        </div>
    );
};

export default POS;