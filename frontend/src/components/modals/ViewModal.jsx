import React from 'react';
import { MdClose, MdEdit, MdDelete } from 'react-icons/md';

const ViewModal = ({ isOpen, onClose, data, title, onEdit, onDelete, fields }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-md blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />

        <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10 bg-gradient-to-r from-accent-400/5 to-transparent">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{title}</h2>
          <div className="flex items-center gap-6">
            {onEdit && data && (
              <button
                onClick={() => onEdit(data)}
                className="p-4 text-white/60 hover:text-blue-300 hover:bg-white/5 rounded-md transition-all shadow-sm border border-transparent hover:border-white/10"
                title="Modify Protocol"
              >
                <MdEdit size={24} />
              </button>
            )}
            {onDelete && data && (
              <button
                onClick={() => onDelete(data)}
                className="p-4 text-white/60 hover:text-red-500 hover:bg-white/5 rounded-md transition-all shadow-sm border border-transparent hover:border-red-500/20"
                title="Purge Record"
              >
                <MdDelete size={24} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-4 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-all shadow-sm hover:rotate-90 border border-transparent hover:border-white/10"
            >
              <MdClose size={28} />
            </button>
          </div>
        </div>
        <div className="p-12 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-12 relative z-10">
          {!data ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-pulse text-white">
              <div className="w-16 h-16 border-2 border-white/10 border-t-accent-400 rounded-full animate-spin shadow-[0_0_20px_rgba(96,165,250,0.3)]" />
              <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40 italic">Accessing Record Manifest...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {fields.map((field) => (
                <div key={field.key} className={`${field.fullWidth ? 'md:col-span-2' : ''} space-y-3`}>
                  <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-2 italic opacity-60">
                    {field.label}
                  </label>
                  <div className="px-8 py-6 bg-white/5 border border-white/5 rounded-md text-white font-bold tracking-tight text-base leading-relaxed shadow-inner group/field hover:border-white/10 transition-colors">
                    {field.render ? field.render(data[field.key], data) : data[field.key]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-10 border-t border-white/5 flex items-center justify-end relative z-10 bg-white/[0.02]">
          <button
            onClick={onClose}
            className="group relative px-12 py-5 bg-blue-500 text-white rounded-md font-black tracking-widest text-[10px] uppercase transition-all active:scale-95 shadow-2xl shadow-white/10 overflow-hidden hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">Close Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
