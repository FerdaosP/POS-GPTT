import React from "react";

const Alert = ({ type = "info", title, description, children }) => {
  const alertStyles = {
    info: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
    error: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded ${alertStyles[type]}`}
      role="alert"
    >
      {title && <h4 className="font-bold mb-1">{title}</h4>}
      {description && <p className="text-sm">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export const AlertDescription = ({ children }) => (
  <span className="text-sm">{children}</span>
);

export default Alert;
