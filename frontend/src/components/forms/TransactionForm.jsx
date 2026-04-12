import React, { useState } from 'react';
import { MdClose, MdSave, MdAccountBalance } from 'react-icons/md';
import { backendGqlApi } from '../../utils/axiosInstance';
import { createFinancial } from '../../utils/gqlQuery';
import { toast } from '../../utils/toast';

const TransactionForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'credit',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    reference: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const financial = {
        type: formData.type.toUpperCase(),
        amount: parseFloat(formData.amount),
        description: `${formData.category}: ${formData.description}`,
        collateral: formData.notes || null,
        deadline: new Date(formData.date + 'T23:59:59').toISOString()
      };

      const response = await backendGqlApi.post('/graphql', {
        query: createFinancial,
        variables: financial
      });

      if (response.data.errors) {
        toast.error('error creating transaction: ' + response.data.errors[0].message);
        return;
      }

      toast.success(`${formData.type} transaction created successfully!`);

      const transaction = {
        ...formData,
        id: response.data.data.financial.id,
        time: new Date().toLocaleTimeString(),
        status: 'completed',
        serverResponse: response.data.data.financial
      };

      onSave(transaction);

      setFormData({
        type: 'credit',
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        reference: '',
        notes: ''
      });

      onClose();
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('request timed out. please try again.');
      } else {
        toast.error('failed to create transaction. please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-white border border-brand-100 rounded-md shadow-[0_50px_100px_-20px_rgba(9,17,30,0.3)] w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <div className="p-12 border-b border-brand-50 flex items-center justify-between bg-brand-50/30">
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-md border border-brand-100 shadow-xl">
              <MdAccountBalance className="text-brand-900 text-3xl" />
            </div>
            <div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-brand-900 tracking-tight leading-none">New Transaction</h2>
                <p className="text-sm font-semibold text-brand-400 opacity-60">Record a new business transaction</p>
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Transaction Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all appearance-none cursor-pointer shadow-sm font-bold text-sm"
              >
                <option value="credit" className="bg-white">PROTOCOL_CREDIT</option>
                <option value="debit" className="bg-white">PROTOCOL_DEBIT</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all appearance-none cursor-pointer shadow-sm font-bold text-sm"
              >
                <option value="" className="bg-white">SELECT_TAXONOMY</option>
                {formData.type === 'credit' ? (
                  <>
                    <option value="Sales Revenue" className="bg-white">Sales Revenue</option>
                    <option value="Investment Income" className="bg-white">Investment Income</option>
                    <option value="Other Income" className="bg-white">Other Income</option>
                  </>
                ) : (
                  <>
                    <option value="Purchase Expense" className="bg-white">Purchase Expense</option>
                    <option value="Operating Expense" className="bg-white">Operating Expense</option>
                    <option value="Salary Expense" className="bg-white">Salary Expense</option>
                    <option value="Rent Expense" className="bg-white">Rent Expense</option>
                    <option value="Other Expense" className="bg-white">Other Expense</option>
                  </>
                )}
              </select>
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
                placeholder="E.G. OP_TRANS_DELTA_RECOVERY"
              />
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
                step="0.01"
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 placeholder:text-brand-200 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all font-bold text-sm"
                placeholder="0"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all appearance-none shadow-sm font-bold text-sm"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Payment Method *</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all appearance-none cursor-pointer shadow-sm font-bold text-sm"
              >
                <option value="Cash" className="bg-white">CASH_SETTLEMENT</option>
                <option value="Bank Transfer" className="bg-white">BANK_TRANSFER</option>
                <option value="Mobile Money" className="bg-white">MOBILE_SYNCHRONIZATION</option>
                <option value="Credit Card" className="bg-white">CARD_AUTHORIZATION</option>
                <option value="Check" className="bg-white">COMMERCIAL_CHECK</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-brand-400 px-1 capitalize">Reference Identifier</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-8 py-5 bg-white border border-brand-100 rounded-lg text-brand-900 placeholder:text-brand-200 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all font-medium"
                placeholder="e.g., Invoice #882-99"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="block text-xs font-bold text-brand-300 px-1 opacity-60">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-10 py-6 bg-brand-50/30 border border-brand-100 rounded-md text-brand-900 placeholder:text-brand-200 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all font-bold text-sm resize-none shadow-sm"
                placeholder="INTELLIGENCE_REMARKS_FOR_AUDIT"
              />
            </div>
          </div>
        </form>

        <div className="p-12 border-t border-brand-50 bg-brand-50/20 flex items-center justify-end gap-10">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-brand-300 hover:text-brand-900 transition-colors font-bold text-sm"
          >
            Abort
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="group relative px-12 py-5 bg-brand-900 text-white rounded-md font-bold text-sm transition-all active:scale-95 shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <div className="flex items-center gap-4 relative z-10">
              {isSubmitting ? (
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : <MdSave size={20} />}
              <span>{isSubmitting ? 'SYNCHRONIZING...' : 'COMMIT_JOURNAL_RECORD'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
