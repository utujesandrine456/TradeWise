import React, { useState } from 'react';
import { MdClose, MdSave, MdInventory, MdInfo } from 'react-icons/md';

const AddItemForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    low_stock_quantity: '5'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      name: formData.name.trim(),
      unit: formData.unit,
      low_stock_quantity: parseInt(formData.low_stock_quantity) || 5
    };

    onSave(submitData);

    setFormData({
      name: '',
      unit: '',
      low_stock_quantity: '5'
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-400/5 rounded-md blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />

        <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="bg-white/5 p-4 rounded-md border border-white/5 shadow-xl">
              <MdInventory className="text-accent-400 text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight leading-none">Register Item</h2>
              <p className="text-xs font-semibold text-brand-300 tracking-wide mt-3 opacity-60">Add new items to your digital inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-brand-300 hover:text-white hover:bg-white/5 rounded-md transition-all shadow-sm hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-brand-300 tracking-wide px-1 opacity-60">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-white/5 border border-white/5 rounded-md text-white placeholder:text-brand-300/20 focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 transition-all font-semibold tracking-tight text-lg shadow-inner"
                placeholder="Product name..."
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold text-brand-300 tracking-wide px-1 opacity-60">Unit of Measure *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-white/5 border border-white/5 rounded-md text-white focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 transition-all appearance-none cursor-pointer shadow-inner font-semibold tracking-wide text-sm"
              >
                <option value="" className="bg-[#09111E]">Select Unit</option>
                <option value="Piece" className="bg-[#09111E]">Piece (pc)</option>
                <option value="Kilogram" className="bg-[#09111E]">Kilogram (kg)</option>
                <option value="Litre" className="bg-[#09111E]">Litre (L)</option>
                <option value="Sac" className="bg-[#09111E]">Sac</option>
                <option value="Box" className="bg-[#09111E]">Box</option>
                <option value="Bottle" className="bg-[#09111E]">Bottle</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="p-10 bg-white/5 border border-white/5 rounded-md relative overflow-hidden group">
                <div className="flex items-start gap-8 relative z-10">
                  <div className="bg-white/5 p-4 rounded-md border border-white/5 shadow-xl">
                    <MdInfo className="text-accent-400 text-2xl" />
                  </div>
                  <p className="text-xs text-brand-300 font-semibold tracking-wide leading-relaxed opacity-80">
                    <span className="text-accent-400 font-bold mr-3">Tip:</span>
                    Maintain consistent naming for accurate reporting. Use singular names for better inventory indexing.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="block text-xs font-semibold text-brand-300 tracking-wide px-1 opacity-60">Shortage Threshold</label>
              <input
                type="number"
                name="low_stock_quantity"
                value={formData.low_stock_quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-10 py-6 bg-white/5 border border-white/5 rounded-md text-white placeholder:text-brand-300/20 focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 transition-all font-semibold tracking-tight text-lg shadow-inner"
                placeholder="5"
              />
              <p className="text-xs text-brand-300 font-semibold px-1 opacity-40 tracking-wide">Trigger an alert when stock drops below this level</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-10 pt-12 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-brand-300 hover:text-white transition-colors font-semibold tracking-wide text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group relative px-12 py-5 bg-accent-400 text-brand-950 rounded-md font-bold tracking-wide text-xs transition-all active:scale-95 shadow-2xl overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <MdSave size={20} />
                <span>Register Item</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
