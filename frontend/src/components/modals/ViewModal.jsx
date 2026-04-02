import React from 'react';
import { MdClose, MdEdit, MdDelete } from 'react-icons/md';

const ViewModal = ({ isOpen, onClose, data, title, onEdit, onDelete, fields }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default">
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-tight capitalize">{title}</h2>
          <div className="flex items-center gap-4">
            {onEdit && data && (
              <button
                onClick={() => onEdit(data)}
                className="p-4 text-chocolate-400 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all shadow-sm"
                title="Edit"
              >
                <MdEdit className="text-2xl" />
              </button>
            )}
            {onDelete && data && (
              <button
                onClick={() => onDelete(data)}
                className="p-4 text-chocolate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-sm"
                title="Delete"
              >
                <MdDelete className="text-2xl" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-4 text-chocolate-300 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all hover:rotate-90"
            >
              <MdClose className="text-3xl" />
            </button>
          </div>
        </div>
        <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {!data ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-chocolate-100 border-t-chocolate-600 rounded-full animate-spin mb-6" />
              <p className="text-chocolate-500 font-medium">Gathering Details...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {fields.map((field) => (
                <div key={field.key} className={`${field.fullWidth ? 'md:col-span-2' : ''} space-y-3`}>
                  <label className="block text-[10px] font-#FC9E4F text-chocolate-400 uppercase tracking-[0.2em] px-1">
                    {field.label}
                  </label>
                  <div className="px-8 py-5 bg-chocolate-50 border border-chocolate-100 rounded-lg text-chocolate-900 font-medium leading-relaxed shadow-sm">
                    {field.render ? field.render(data[field.key], data) : data[field.key]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-10 border-t border-chocolate-50 flex items-center justify-end bg-chocolate-50/30">
          <button
            onClick={onClose}
            className="px-12 py-5 bg-chocolate-600 hover:bg-chocolate-700 text-white rounded-lg font-#FC9E4F transition-all active:scale-95 shadow-lg"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
