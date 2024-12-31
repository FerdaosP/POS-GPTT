import React from "react";

const Loading = ({isLoading}) => {
    if(!isLoading) {
       return null;
   }
  return (
      <div className="flex items-center justify-center h-full">
          <div className="relative w-20 h-5 rounded bg-gray-200 overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-gray-300 w-full animate-shimmer">
              </div>
          </div>
        </div>
 );
};
 export default Loading;