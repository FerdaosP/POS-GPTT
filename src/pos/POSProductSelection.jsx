// src/pos/POSProductSelection.jsx
import React, { useState, useEffect } from 'react';

const POSProductSelection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
           setError(null)
           try{
             // Fetch categories from backend
            const response = await new Promise(resolve => setTimeout(() => resolve({data: [
                    {id: 1, name: 'Mobile', image: '📱'},
                    {id: 2, name: 'Tablet', image: '📱'},
                    {id: 3, name: 'Mac & PC', image: '💻'},
                   {id: 4, name: 'Game Console', image: '🎮'},
                     {id: 5, name: 'Music', image: '🎵'},
                ]}) , 200)
            );
            setCategories(response.data);
         } catch (err) {
           console.error('Error fetching categories:', err);
            setError("Error loading categories. Please check console.")
         } finally{
              setLoading(false);
          }
        };
          fetchCategories();
   },[]);


    if(loading) {
        return  <div className="flex items-center justify-center h-40">
            <div className="relative w-20 h-5 rounded bg-gray-200 overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-gray-300 w-full animate-shimmer">
                </div>
             </div>
        </div>
    }
    if(error) {
        return <div className="text-red-500 p-4">{error}</div>
    }


    return (
      <div>
          <div className="flex justify-between items-center mb-4">
               <span className="font-medium text-lg">PRODUCT BUNDLE</span>
             </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {categories.map(category => (
               <button
                   key={category.id}
                     className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-100 transition duration-200 flex flex-col items-center justify-center"
                     aria-label={`View products in ${category.name}`}
               >
                   <span className="text-4xl mb-2">{category.image}</span>
                    <p className="font-medium">{category.name}</p>
                 </button>
               ))}
           </div>
     </div>
    );
};

export default POSProductSelection;