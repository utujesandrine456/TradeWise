import React from 'react';
import { MdClose, MdEdit, MdDelete } from 'react-icons/md';

const ViewModal = ({ isOpen, onClose, data, title, onEdit, onDelete, fields }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-400/5 rounded-md blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />

        <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10">
          <h2 className="text-3xl font-bold text-white tracking-tight leading-none">{title}</h2>
          <div className="flex items-center gap-6">
            {onEdit && data && (
              <button
                onClick={() => onEdit(data)}
                className="p-4 text-brand-300 hover:text-green-500 hover:bg-white/5 rounded-md transition-all shadow-sm"
                title="Edit Item"
              >
                <MdEdit size={24} />
              </button>
            )}
            {onDelete && data && (
              <button
                onClick={() => onDelete(data)}
                className="p-4 text-brand-300 hover:text-red-500 hover:bg-white/5 rounded-md transition-all shadow-sm"
                title="Delete Item"
              >
                <MdDelete size={24} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-4 text-brand-300 hover:text-white hover:bg-white/5 rounded-md transition-all shadow-sm hover:rotate-90"
            >
              <MdClose size={28} />
            </button>
          </div>
        </div>
        <div className="p-12 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-12 relative z-10">
          {!data ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8">
              <div className="w-16 h-16 border-4 border-white/5 border-t-accent-400 rounded-md animate-spin" />
              <p className="text-sm font-semibold text-brand-300 tracking-wide opacity-60">Loading details...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {fields.map((field) => (
                <div key={field.key} className={`${field.fullWidth ? 'md:col-span-2' : ''} space-y-4`}>
                  <label className="block text-xs font-semibold text-brand-300 tracking-wide px-1 opacity-60">
                    {field.label}
                  </label>
                  <div className="px-10 py-8 bg-white/5 border border-white/5 rounded-md text-white font-semibold tracking-wide text-sm leading-relaxed shadow-inner">
                    {field.render ? field.render(data[field.key], data) : data[field.key]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-12 border-t border-white/5 flex items-center justify-end relative z-10">
          <button
            onClick={onClose}
            className="group relative px-12 py-5 bg-accent-400 text-brand-950 rounded-md font-bold tracking-wide text-xs transition-all active:scale-95 shadow-2xl overflow-hidden hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10">Close View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
