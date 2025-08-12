import React from 'react';
import { MdClose, MdEdit, MdDelete } from 'react-icons/md';

const ViewModal = ({ isOpen, onClose, data, title, onEdit, onDelete, fields }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(data)}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition duration-200"
                >
                  <MdEdit className="text-xl" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(data._id || data.id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition duration-200"
                >
                  <MdDelete className="text-xl" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <div className="text-gray-900 font-medium">
                  {field.render ? field.render(data[field.key]) : data[field.key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
