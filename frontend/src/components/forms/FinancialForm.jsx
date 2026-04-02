import React, { useState, useEffect } from 'react';
import { MdClose, MdSave, MdAccountBalance } from 'react-icons/md';
import { backendGqlApi } from '../../utils/axiosInstance';
import { createFinancial } from '../../utils/gqlQuery';
import { toast } from '../../utils/toast';

const FinancialForm = ({ isOpen, onClose, onSave, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    type: 'Credit',
    amount: '',
    description: '',
    collateral: '',
    deadline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      const formattedDeadline = initialData.deadline
        ? new Date(initialData.deadline).toISOString().slice(0, 16)
        : '';

      setFormData({
        type: initialData.type || 'Credit',
        amount: initialData.amount || '',
        description: initialData.description || '',
        collateral: initialData.collateral || '',
        deadline: formattedDeadline
      });
    } else {
      setFormData({
        type: 'Credit',
        amount: '',
        description: '',
        collateral: '',
        deadline: ''
      });
    }
  }, [isEdit, initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      const updatedFinancial = {
        id: initialData?.id,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        collateral: formData.collateral,
        deadline: new Date(formData.deadline).toISOString()
      };
      onSave(updatedFinancial);
      return;
    }

    try {
      setIsSubmitting(true);
      const financial = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        collateral: formData.collateral,
        deadline: new Date(formData.deadline).toISOString()
      };

      const response = await backendGqlApi.post('/graphql', {
        query: createFinancial,
        variables: financial
      });

      if (response.data.errors) {
        toast.error('error creating financial record: ' + response.data.errors[0].message);
        return;
      }

      toast.success(`${formData.type.toLowerCase()} record created successfully!`);
      onSave(response.data.data.financial);
      setFormData({
        type: 'Credit',
        amount: '',
        description: '',
        collateral: '',
        deadline: ''
      });
      onClose();
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('request timed out. please try again.');
      } else {
        toast.error('failed to create financial record. please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default">
      <div className="bg-white border border-gray-100 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
              <MdAccountBalance className="text-black text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-black leading-tight">{isEdit ? 'Edit Financial' : 'New Financial'}</h2>
              <p className="text-sm text-gray-400 font-medium mt-1">Record Manual Monetary Operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-gray-300 hover:text-black hover:bg-gray-50 rounded-lg transition-all hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-400 px-1 capitalize">Transaction Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-lg text-black focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="Credit" className="bg-white">Credit (Income)</option>
                <option value="Debit" className="bg-white">Debit (Expense)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-400 px-1 capitalize">Amount (FRW) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="100"
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-lg text-black placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-bold"
                placeholder="100"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-bold text-gray-400 px-1 capitalize">Description *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-lg text-black placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium"
                placeholder="e.g., Loan to John Doe"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-400 px-1 capitalize">Collateral / Reference *</label>
              <input
                type="text"
                name="collateral"
                value={formData.collateral}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-lg text-black placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium"
                placeholder="e.g., Equipment or ID Number"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-400 px-1 capitalize">Effective Deadline *</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-lg text-black focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-8 pt-10 border-t border-chocolate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-gray-400 hover:text-black transition-colors font-bold tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group relative px-12 py-5 bg-chocolate-600 text-white rounded-lg font-bold transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <div className="flex items-center gap-3 relative z-10">
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : <MdSave className="text-2xl" />}
                <span className="text-lg">{isSubmitting ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Financial' : 'Save Financial')}</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialForm;
