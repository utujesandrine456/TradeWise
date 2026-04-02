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
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default animate-in fade-in duration-300">
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-4 text-chocolate-300 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {fields.map((field) => (
              <div key={field.key} className={`${field.fullWidth ? 'md:col-span-2' : ''} space-y-3`}>
                <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows="4"
                    className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all resize-none shadow-sm leading-relaxed"
                    placeholder={`Provide ${field.placeholder || field.label}`}
                  />
                ) : field.type === 'select' ? (
                  <div className="relative group">
                    <select
                      name={field.key}
                      value={formData[field.key] || ''}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none cursor-pointer shadow-sm relative z-10"
                    >
                      <option value="" className="bg-white">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value} className="bg-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none z-20 text-chocolate-300 group-hover:text-chocolate-600 transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20 shadow-lg"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
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
                    className={`w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all shadow-sm ${field.disabled ? 'bg-chocolate-50/50 cursor-not-allowed opacity-60' : ''}`}
                    placeholder={`Enter ${field.placeholder || field.label}`}
                    readOnly={field.disabled}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-8 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-5 text-chocolate-400 hover:text-chocolate-600 transition-all font-bold active:scale-95"
            >
              Cancel Operation
            </button>
            <button
              type="submit"
              className="group relative px-12 py-5 bg-chocolate-600 text-white rounded-lg font-#FC9E4F transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10 text-lg">
                <MdSave className="text-2xl" />
                <span>Commit Changes</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
