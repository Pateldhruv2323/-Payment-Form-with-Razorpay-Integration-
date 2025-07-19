import React from 'react';

const ThankYouModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 max-w-md text-center shadow-lg">
        <h2 className="text-xl font-semibold text-green-600 mb-4">🎉 Thank You!</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
