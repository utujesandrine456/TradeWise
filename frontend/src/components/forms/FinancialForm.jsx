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
    <div className="fixed inset-0 bg-brand-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-white border border-brand-100 rounded-md shadow-[0_50px_100px_-20px_rgba(9,17,30,0.3)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="p-12 border-b border-brand-50 flex items-center justify-between bg-brand-50/30">
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-md border border-brand-100 shadow-xl">
              <MdAccountBalance className="text-brand-900 text-3xl" />
            </div>
            <div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-brand-900 tracking-tight leading-none">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
                <p className="text-sm font-semibold text-brand-400 opacity-60">Record or modify financial transaction data</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-brand-200 hover:text-brand-900 hover:bg-white rounded-md transition-all shadow-sm hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Category *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all appearance-none cursor-pointer shadow-sm font-bold text-sm"
              >
                <option value="Credit" className="bg-white">PROTOCOL_CREDIT</option>
                <option value="Debit" className="bg-white">PROTOCOL_DEBIT</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Amount (FRW) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="100"
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 placeholder:text-brand-200 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all font-bold text-sm"
                placeholder="100"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Description *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 placeholder:text-brand-200 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all font-bold text-sm"
                placeholder="E.G. TRANS_REF_ALFA"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Collector Name *</label>
              <input
                type="text"
                name="collateral"
                value={formData.collateral}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 placeholder:text-brand-200 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all font-bold text-sm"
                placeholder="SEC_IDENTIFIER"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Due Date *</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all appearance-none shadow-sm font-bold text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-10 pt-12 border-t border-brand-50">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-brand-300 hover:text-brand-900 transition-colors font-bold text-sm"
            >
              Abort
            </button>
            <button
              type="submit"
              className="group relative px-12 py-5 bg-brand-900 text-white rounded-md font-bold text-sm transition-all active:scale-95 shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : <MdSave size={20} />}
                <span>{isSubmitting ? (isEdit ? 'SYNCHRONIZING...' : 'RECORDING...') : (isEdit ? 'CONFIRM_UPDATE' : 'SYNCHRONIZE_VAULT')}</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialForm;
