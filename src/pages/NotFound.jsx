import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-8xl text-yellow-500 mb-6 flex justify-center">
          <AlertTriangle className="w-32 h-32" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for has vanished into the digital void. 
          Maybe it's on a coffee break?
        </p>
        <div className="animate-bounce">
          <span className="text-6xl">☕</span>
        </div>
        <Link 
          to="/" 
          className="mt-8 inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Safety
        </Link>
      </div>
    </div>
  );
};

export default NotFound;