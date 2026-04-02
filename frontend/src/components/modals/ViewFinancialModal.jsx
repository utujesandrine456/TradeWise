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
    return paid ? 'text-green-700 bg-green-50 border-green-100' : 'text-chocolate-600 bg-chocolate-50 border-chocolate-100';
  };

  return (
    <div className="fixed inset-0 bg-chocolate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-afacad cursor-default">
      <div className="bg-white border border-chocolate-100 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex flex-col">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-chocolate-50 p-4 rounded-lg border border-chocolate-100 shadow-sm">
              <MdAccountBalance className="text-chocolate-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-#FC9E4F text-chocolate-900 leading-tight">Financial Details</h2>
              <p className="text-sm text-chocolate-400 font-medium mt-1">Comprehensive Audit Record</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!financial.paid && (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="p-4 text-chocolate-400 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all shadow-sm"
                  title="Edit Financial"
                >
                  <MdEdit className="text-2xl" />
                </button>
                <button
                  onClick={() => {
                    onMarkAsPaid && onMarkAsPaid(financial);
                    onClose();
                  }}
                  className="p-4 text-chocolate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-sm"
                  title="Mark As Paid"
                >
                  <MdCheckCircle className="text-2xl" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-4 text-chocolate-300 hover:text-chocolate-600 hover:bg-chocolate-50 rounded-lg transition-all hover:rotate-90"
            >
              <MdClose className="text-3xl" />
            </button>
          </div>
        </div>

        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 uppercase tracking-wider px-1">Transaction Category</label>
              <div className="px-8 py-5 bg-chocolate-50 border border-chocolate-100 rounded-lg shadow-sm">
                <span className={`inline-flex px-6 py-2 text-sm font-#FC9E4F rounded-full border uppercase ${financial.type?.toLowerCase() === 'credit' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                  {financial.type}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-chocolate-400 uppercase tracking-wider px-1">Payment Status</label>
              <div className="px-8 py-5 bg-chocolate-50 border border-chocolate-100 rounded-lg shadow-sm">
                <span className={`inline-flex px-6 py-2 text-sm font-#FC9E4F rounded-full border uppercase ${financial.paid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                  {financial.paid ? 'Paid' : 'Pending Settlement'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-chocolate-400 uppercase tracking-wider px-1 flex items-center gap-3">
              <MdPayment className="text-xl text-chocolate-600" />
              Transaction Amount
            </label>
            <div className="px-10 py-8 bg-chocolate-50 border border-chocolate-100 rounded-lg shadow-sm relative overflow-hidden group">
              <div className="relative z-10 flex items-baseline gap-4">
                <span className={`text-6xl font-#FC9E4F tracking-tighter ${financial.type?.toLowerCase() === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {financial.type?.toLowerCase() === 'credit' ? '+' : '-'}{financial.amount.toLocaleString()}
                </span>
                <span className="text-xl text-chocolate-400 font-#FC9E4F uppercase">FRW</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="flex text-sm font-bold text-chocolate-400 uppercase tracking-wider px-1 items-center gap-3">
                <MdDescription className="text-xl text-chocolate-600" />
                Description
              </label>
              <div className="px-8 py-5 bg-chocolate-50 border border-chocolate-100 rounded-lg shadow-sm">
                <p className="text-chocolate-900 font-medium leading-relaxed capitalize">{financial.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex text-sm font-bold text-chocolate-400 uppercase tracking-wider px-1 items-center gap-3">
                <MdCalendarToday className="text-xl text-chocolate-600" />
                Deadline
              </label>
              <div className="px-8 py-5 bg-chocolate-50 border border-chocolate-100 rounded-lg shadow-sm">
                <p className="text-chocolate-900 font-medium">{formatDate(financial.deadline)}</p>
              </div>
            </div>

            {financial.collateral && (
              <div className="md:col-span-2 space-y-3">
                <label className="flex text-sm font-bold text-chocolate-400 uppercase tracking-wider px-1 items-center gap-3">
                  <MdSecurity className="text-xl text-chocolate-600" />
                  Collateral / Secondary Reference
                </label>
                <div className="px-8 py-5 bg-chocolate-50 border border-chocolate-100 rounded-lg shadow-sm">
                  <p className="text-chocolate-900 font-#FC9E4F leading-relaxed capitalize">{financial.collateral}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-chocolate-50 border border-chocolate-100 p-8 rounded-lg shadow-sm relative overflow-hidden">
            <h4 className="text-[10px] font-#FC9E4F text-chocolate-400 uppercase tracking-[0.2em] mb-6 px-1">System Audit Data</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
              <div>
                <span className="block text-[10px] font-#FC9E4F text-chocolate-500 uppercase mb-2">Record Creation Timestamp</span>
                <p className="text-sm text-chocolate-600 font-medium">{formatDate(financial.createdAt || financial.deadline)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-chocolate-50 flex items-center justify-end bg-chocolate-50/30">
          <button
            onClick={onClose}
            className="px-12 py-5 bg-chocolate-600 hover:bg-chocolate-700 text-white rounded-lg font-#FC9E4F transition-all active:scale-95 shadow-lg"
          >
            Close Overview
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
