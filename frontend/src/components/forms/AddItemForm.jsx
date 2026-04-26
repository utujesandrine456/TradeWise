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
    <div className="fixed inset-0 bg-[#09111E]/40 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-white border border-gray-100 rounded-md shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gray-50 rounded-md blur-[80px] -mr-[200px] -mt-[200px] pointer-events-none" />

        <div className="p-12 border-b border-gray-100 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 shadow-sm">
              <MdInventory className="text-[#09111E] text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#09111E] leading-none">Register Item</h2>
              <p className="text-xs font-semibold text-[#09111E]/60 mt-3 opacity-60">Add new items to your digital inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-[#09111E]/40 hover:text-[#09111E] hover:bg-gray-50 rounded-md transition-all shadow-sm hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#09111E]/60 px-1 opacity-60">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-white border border-gray-100 rounded-md text-black placeholder:text-[#09111E]/30 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-semibold text-lg shadow-sm"
                placeholder="Product name..."
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#09111E]/60 px-1 opacity-60">Unit of Measure *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-white border border-gray-100 rounded-md text-black focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all appearance-none cursor-pointer shadow-sm font-semibold text-sm"
              >
                <option value="" className="bg-white">Select Unit</option>
                <option value="Piece" className="bg-white">Piece (pc)</option>
                <option value="Kilogram" className="bg-white">Kilogram (kg)</option>
                <option value="Litre" className="bg-white">Litre (L)</option>
                <option value="Sac" className="bg-white">Sac</option>
                <option value="Box" className="bg-white">Box</option>
                <option value="Bottle" className="bg-white">Bottle</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="p-10 bg-gray-50 border border-gray-100 rounded-md relative overflow-hidden group">
                <div className="flex items-start gap-8 relative z-10">
                  <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
                    <MdInfo className="text-blue-600 text-2xl" />
                  </div>
                  <p className="text-xs text-[#09111E]/60 font-semibold leading-relaxed opacity-80">
                    <span className="text-blue-600 font-bold mr-3">Tip:</span>
                    Maintain consistent naming for accurate reporting. Use singular names for better inventory indexing.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="block text-xs font-semibold text-[#09111E]/60 px-1 opacity-60">Shortage Threshold</label>
              <input
                type="number"
                name="low_stock_quantity"
                value={formData.low_stock_quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-10 py-6 bg-white border border-gray-100 rounded-md text-black placeholder:text-[#09111E]/30 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-semibold text-lg shadow-sm"
                placeholder="5"
              />
              <p className="text-xs text-[#09111E]/60 font-semibold px-1 opacity-40">Trigger an alert when stock drops below this level</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-10 pt-12 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-[#09111E]/60 hover:text-black transition-colors font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group relative px-12 py-5 bg-[#09111E] text-white rounded-md font-bold text-xs transition-all active:scale-95 shadow-lg overflow-hidden hover:scale-105"
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
