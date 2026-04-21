import React, { useState } from 'react';
import { MdClose, MdAccountBalance, MdCalendarToday, MdDescription, MdSecurity, MdPayment, MdEdit, MdCheckCircle } from 'react-icons/md';
import FinancialForm from '../forms/FinancialForm';

const ViewFinancialModal = ({ isOpen, onClose, financial, onMarkAsPaid, onUpdateFinancial }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  if (!isOpen || !financial) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    return type?.toLowerCase() === 'credit' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-700 bg-red-50 border-red-100';
  };

  const getStatusColor = (paid) => {
    return paid ? 'text-green-700 bg-green-50 border-green-100' : 'text-black bg-gray-50 border-gray-100';
  };

  return (
    <div className="fixed inset-0 bg-[#09111E]/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-Urbanist cursor-default animate-in fade-in duration-500">
      <div className="bg-white border border-brand-100 rounded-md shadow-[0_50px_100px_-20px_rgba(9,17,30,0.3)] w-full max-w-2xl overflow-hidden relative flex flex-col">
        <div className="p-12 border-b border-brand-50 flex items-center justify-between bg-brand-50/30">
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-md border border-brand-100 shadow-xl">
              <MdAccountBalance className="text-[#09111E] text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-[#09111E] uppercase tracking-tighter leading-none">Financial Audit</h2>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mt-3 italic">Comprehensive Transaction Log</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {!financial.paid && (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="p-4 text-white/70 hover:text-[#09111E] hover:bg-white rounded-md transition-all shadow-sm"
                  title="Modify Entry"
                >
                  <MdEdit size={24} />
                </button>
                <button
                  onClick={() => {
                    onMarkAsPaid && onMarkAsPaid(financial);
                    onClose();
                  }}
                  className="p-4 text-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all shadow-sm"
                  title="Authorize Settlement"
                >
                  <MdCheckCircle size={24} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-4 text-white/40 hover:text-[#09111E] hover:bg-white rounded-md transition-all shadow-sm hover:rotate-90"
            >
              <MdClose size={28} />
            </button>
          </div>
        </div>

        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-1 italic">Classification</label>
              <div className="px-10 py-8 bg-brand-50/50 border border-brand-100 rounded-md shadow-inner text-center">
                <span className={`inline-flex px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border ${financial.type?.toLowerCase() === 'credit' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                  {financial.type}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-1 italic">Settlement Progress</label>
              <div className="px-10 py-8 bg-brand-50/50 border border-brand-100 rounded-md shadow-inner text-center">
                <span className={`inline-flex px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border ${financial.paid ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                  {financial.paid ? 'Validated' : 'Pending Authorization'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-1 italic flex items-center gap-4">
              <MdPayment className="text-xl text-[#09111E]" />
              Quantum Valuation
            </label>
            <div className="px-12 py-10 bg-[#09111E] rounded-md shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex items-baseline justify-between">
                <span className={`text-6xl font-black tracking-tighter ${financial.type?.toLowerCase() === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {financial.type?.toLowerCase() === 'credit' ? '+' : '-'}{financial.amount.toLocaleString()}
                </span>
                <span className="text-xl text-white/40 font-black uppercase tracking-[0.3em]">FRW_UNIT</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="flex text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-1 items-center gap-4 italic">
                <MdDescription className="text-xl text-[#09111E]" />
                Audit Comments
              </label>
              <div className="px-10 py-8 bg-brand-50/50 border border-brand-100 rounded-md shadow-inner">
                <p className="text-[#09111E] font-black uppercase tracking-widest text-[10px] leading-relaxed">{financial.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-1 items-center gap-4 italic">
                <MdCalendarToday className="text-xl text-[#09111E]" />
                Integrity Deadline
              </label>
              <div className="px-10 py-8 bg-brand-50/50 border border-brand-100 rounded-md shadow-inner text-center">
                <p className="text-[#09111E] font-black uppercase tracking-widest text-[10px]">{formatDate(financial.deadline)}</p>
              </div>
            </div>

            {financial.collateral && (
              <div className="md:col-span-2 space-y-4">
                <label className="flex text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-1 items-center gap-4 italic">
                  <MdSecurity className="text-xl text-[#09111E]" />
                  Security Collateral / Protocol ID
                </label>
                <div className="px-10 py-8 bg-brand-50/50 border border-brand-100 rounded-md shadow-inner text-center">
                  <p className="text-[#09111E] font-black uppercase tracking-widest text-[10px] leading-relaxed">{financial.collateral}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-brand-50/50 border border-brand-100 p-10 rounded-md shadow-inner relative overflow-hidden">
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mb-8 italic">Diagnostic Timestamps</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 relative z-10">
              <div>
                <span className="block text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-3">Kernel Initialization</span>
                <p className="text-[10px] text-[#09111E] font-black uppercase tracking-widest">{formatDate(financial.createdAt || financial.deadline)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 border-t border-brand-50 flex items-center justify-end bg-brand-50/20">
          <button
            onClick={onClose}
            className="px-12 py-5 bg-[#09111E] text-white rounded-md font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-[#09111E] active:scale-95 shadow-2xl relative overflow-hidden group/close"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/close:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10">Terminate Inspection</span>
          </button>
        </div>
      </div>

      <FinancialForm
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        initialData={financial}
        isEdit={true}
        onSave={(updatedFinancial) => {
          if (onUpdateFinancial) {
            onUpdateFinancial(updatedFinancial);
          }
          setIsEditMode(false);
          onClose();
        }}
      />
    </div>
  );
};

export default ViewFinancialModal;
