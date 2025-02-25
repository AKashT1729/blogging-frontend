import React from "react";

const LoadingSpinner = () => {
  return (
    <>
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    </>
  );
};

export default LoadingSpinner;
