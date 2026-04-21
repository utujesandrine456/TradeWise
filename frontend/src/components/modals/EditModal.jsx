import React, { useState, useEffect } from 'react';
import { MdClose, MdSave } from 'react-icons/md';

const EditModal = ({ isOpen, onClose, data, title, onSave, fields }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-md blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />

        <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10">
          <h2 className="text-3xl font-bold text-white tracking-tight leading-none">{title}</h2>
          <button
            onClick={onClose}
            className="p-4 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-all shadow-sm hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {fields.map((field) => (
              <div key={field.key} className={`${field.fullWidth ? 'md:col-span-2' : ''} space-y-4`}>
                <label className="block text-xs font-semibold text-white/60 tracking-wide px-1 opacity-60">
                  {field.label} {field.required && ' — Mandatory'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows="5"
                    className="w-full px-8 py-6 bg-white/5 border border-white/5 rounded-md text-white font-semibold tracking-tight text-lg placeholder:text-white/60/20 focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-white/20 transition-all resize-none shadow-inner leading-relaxed"
                    placeholder={`Define ${field.placeholder || field.label}`}
                  />
                ) : field.type === 'select' ? (
                  <div className="relative group">
                    <select
                      name={field.key}
                      value={formData[field.key] || ''}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-8 py-6 bg-white/5 border border-white/5 rounded-md text-white font-semibold tracking-wide text-sm focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-white/20 transition-all appearance-none cursor-pointer shadow-inner relative z-10"
                    >
                      <option value="" className="bg-[#09111E] text-white/60">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#09111E] text-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none z-20 text-white/60 group-hover:text-white transition-colors opacity-40">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.key}
                    value={formData[field.key] ?? ''}
                    onChange={handleChange}
                    required={field.required}
                    disabled={field.disabled}
                    min={field.min}
                    max={field.max}
                    className={`w-full px-8 py-6 bg-white/5 border border-white/5 rounded-md text-white font-semibold tracking-tight text-lg placeholder:text-white/60/20 focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-white/20 transition-all shadow-inner ${field.disabled ? 'cursor-not-allowed opacity-30 bg-black/20' : ''}`}
                    placeholder={`Enter ${field.placeholder || field.label}`}
                    readOnly={field.disabled}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-10 pt-12 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-white/60 tracking-wide hover:text-white transition-all active:scale-95 opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group relative px-12 py-5 bg-blue-500 text-white rounded-md font-bold tracking-wide text-xs transition-all active:scale-95 shadow-2xl overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <MdSave size={18} />
                <span>Save Changes</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
