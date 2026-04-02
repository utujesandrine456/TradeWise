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
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default">
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-chocolate-50 p-4 rounded-lg border border-chocolate-100 shadow-sm">
              <MdAccountBalance className="text-chocolate-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-tight">New Transaction</h2>
              <p className="text-sm text-chocolate-400 font-medium mt-1">Record Operational Income Or Expenses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 text-chocolate-300 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all hover:rotate-90"
          >
            <MdClose className="text-3xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Transaction Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="credit" className="bg-white">Credit (Income)</option>
                <option value="debit" className="bg-white">Debit (Expense)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="" className="bg-white">Choose Category</option>
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

            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Description *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium"
                placeholder="e.g., Quarterly Office Supply Replenishment"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Amount (FRW) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-#FC9E4F"
                placeholder="0"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Settlement Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none shadow-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Payment Source *</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="Cash" className="bg-white">Cash Payment</option>
                <option value="Bank Transfer" className="bg-white">Bank Transfer</option>
                <option value="Mobile Money" className="bg-white">Mobile Money</option>
                <option value="Credit Card" className="bg-white">Credit Card</option>
                <option value="Check" className="bg-white">Commercial Check</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Reference Identifier</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium"
                placeholder="e.g., Invoice #882-99"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 px-1 capitalize">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-8 py-5 bg-white border border-chocolate-100 rounded-lg text-chocolate-900 placeholder:text-chocolate-200 focus:outline-none focus:ring-4 focus:ring-chocolate-50 transition-all font-medium resize-none shadow-sm"
                placeholder="Clarifying Details For Auditing Purposes"
              />
            </div>
          </div>
        </form>

        <div className="p-10 border-t border-chocolate-50 bg-white flex items-center justify-end gap-8">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-chocolate-400 hover:text-chocolate-600 transition-colors font-#FC9E4F tracking-widest"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="group relative px-12 py-5 bg-chocolate-600 text-white rounded-lg font-#FC9E4F transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <div className="flex items-center gap-3 relative z-10">
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : <MdSave className="text-2xl" />}
              <span className="text-lg">{isSubmitting ? 'Recording...' : 'Commit Transaction Record'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
