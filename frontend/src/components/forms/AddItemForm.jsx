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
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default">
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-chocolate-50 p-4 rounded-lg border border-chocolate-100 shadow-sm">
              <MdInventory className="text-chocolate-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-tight">Add New Item</h2>
              <p className="text-sm text-chocolate-400 font-medium mt-1">Expand Your Commercial Inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-chocolate-300 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium"
                placeholder="e.g., MacBook Air M2"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Measurement Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="" className="bg-white">Choose Unit</option>
                <option value="Piece" className="bg-white">Piece (pc)</option>
                <option value="Kilogram" className="bg-white">Kilogram (kg)</option>
                <option value="Litre" className="bg-white">Litre (l)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="p-8 bg-chocolate-50 border border-chocolate-100 rounded-lg relative overflow-hidden group">
                <div className="flex items-start gap-6 relative z-10">
                  <div className="bg-white p-3 rounded-lg border border-chocolate-100 shadow-sm">
                    <MdInfo className="text-chocolate-600 text-2xl" />
                  </div>
                  <p className="text-sm text-chocolate-600 font-medium leading-relaxed">
                    <span className="text-chocolate-900 font-#FC9E4F italic mr-2 text-base">Professional Tip:</span>
                    Maintain naming consistency for better reporting. Use singular nouns like <span className="text-chocolate-900 font-bold italic">"Office Chair"</span> rather than <span className="text-chocolate-400 line-through">"Chairs"</span>.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-chocolate-100/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Low Stock Alert Threshold</label>
              <input
                type="number"
                name="low_stock_quantity"
                value={formData.low_stock_quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-#FC9E4F"
                placeholder="5"
              />
              <p className="text-[10px] text-chocolate-400 font-bold px-1 ml-1 opacity-70">Automated Notification When Inventory Levels Drop Below This Value</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-8 pt-10 border-t border-chocolate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-chocolate-400 hover:text-chocolate-600 transition-colors font-#FC9E4F tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group relative px-12 py-5 bg-chocolate-600 text-white rounded-lg font-#FC9E4F transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <MdSave className="text-2xl" />
                <span className="text-lg">Register New Item</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
