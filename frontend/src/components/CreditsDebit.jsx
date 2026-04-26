import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '../utils/toast';
import Loader from './Loader';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdAttachMoney, MdAccountBalance, MdTrendingUp, MdTrendingDown, MdCreditCard, MdAccountBalanceWallet, MdReceipt, MdWarning, MdCheckCircle } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { backendGqlApi } from '../utils/axiosInstance';
import { findAllFinancials, makeFinancialPaid, updateFinancials } from '../utils/gqlQuery';
import { throttle } from '../utils/throttle';
import { debounce } from '../utils/debounce';
import FinancialForm from './forms/FinancialForm';
import ViewFinancialModal from './modals/ViewFinancialModal';

const CreditsDebit = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFinancialFormOpen, setIsFinancialFormOpen] = useState(false);
  const [financials, setFinancials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinancial, setSelectedFinancial] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isConfirmPaidOpen, setIsConfirmPaidOpen] = useState(false);
  const [financialToMarkPaid, setFinancialToMarkPaid] = useState(null);
  const [confirmPaidText, setConfirmPaidText] = useState('');
  const navigate = useNavigate();
  const { financialId } = useParams();

  // Fetch financials from backend
  const fetchFinancials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await backendGqlApi.post('/graphql', {
        query: findAllFinancials
      });

      if (response.data.errors) {
        return toast.error('Error fetching financials: ' + response.data.errors[0].message);
      }

      // Use backend data as-is, convert isPaidBack to boolean
      const financialsWithPaidStatus = response.data.data.financials.map(financial => ({
        ...financial,
        paid: Boolean(financial.isPaidBack) // Convert 0/1 to false/true
      }));

      setFinancials(financialsWithPaidStatus);
    } catch (error) {
      console.error('Error fetching financials:', error);
      toast.error('Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinancials();
  }, [fetchFinancials]);

  // Handle URL params - open modal if financialId is present
  useEffect(() => {
    if (financialId && financials.length > 0) {
      const financial = financials.find(f => f.id === financialId);
      if (financial) {
        setSelectedFinancial(financial);
        setIsViewModalOpen(true);
      }
    }
  }, [financialId, financials]);

  // Helper function to check if deadline is approaching (within 1 day)
  const isDeadlineApproaching = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= 1 && daysDiff > 0;
  };

  // Helper function to check if deadline is overdue
  const isOverdue = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < now;
  };

  // Handle view financial
  const handleViewFinancial = (financial) => {
    setSelectedFinancial(financial);
    setIsViewModalOpen(true);
    navigate(`/financials/${financial.id}`);
  };

  // Handle close view modal
  const handleCloseViewModal = () => {
    setSelectedFinancial(null);
    setIsViewModalOpen(false);
    navigate('/dashboard');
  };

  // Open confirmation modal for marking as paid
  const handleMarkAsPaid = (financial) => {
    if (!financial.paid) {
      setFinancialToMarkPaid(financial);
      setConfirmPaidText('');
      setIsConfirmPaidOpen(true);
    }
  };

  // Actually perform mark-as-paid after confirmation
  const confirmMarkAsPaid = async () => {
    if (!financialToMarkPaid || confirmPaidText.toLowerCase().trim() !== 'mark as paid') return;

    try {
      const response = await backendGqlApi.post('/graphql', {
        query: makeFinancialPaid,
        variables: { financialId: financialToMarkPaid.id }
      });

      if (response.data.errors) {
        toast.error('Error marking financial as paid: ' + response.data.errors[0].message);
        return;
      }

      toast.success('Financial marked as paid successfully!');
      setIsConfirmPaidOpen(false);
      setFinancialToMarkPaid(null);
      setConfirmPaidText('');
      fetchFinancials();
    } catch (error) {
      console.error('Error marking financial as paid:', error);
      toast.error('Failed To Mark Financial As Paid');
    }
  };

  const handleUpdateFinancial = async (updatedFinancial) => {
    try {
      const response = await backendGqlApi.post('/graphql', {
        query: updateFinancials,
        variables: {
          financialId: updatedFinancial.id,
          input: {
            amount: updatedFinancial.amount,
            description: updatedFinancial.description,
            collateral: updatedFinancial.collateral,
            deadline: updatedFinancial.deadline
          }
        }
      });

      if (response.data.errors) {
        toast.error('Error updating financial: ' + response.data.errors[0].message);
        return;
      }

      toast.success('Financial updated successfully!');
      fetchFinancials();
    } catch (error) {
      console.error('Error updating financial:', error);
      toast.error('Failed To Update Financial');
    }
  };

  const formatDeadline = (deadline) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTransactions = useMemo(() =>
    financials.filter(t => {
      const typeMatch = selectedFilter === 'all' || t.type.toLowerCase() === selectedFilter;
      const searchMatch = searchTerm === '' || t.description.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && searchMatch;
    }), [financials, selectedFilter, searchTerm]
  );

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleScroll = useCallback(() => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (bottom && visibleCount < filteredTransactions.length) {
      setVisibleCount((prev) => prev + 10);
    }
  }, [visibleCount, filteredTransactions.length]);

  const throttledScroll = useMemo(() => throttle(handleScroll, 200), [handleScroll]);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  const totalCredits = useMemo(() =>
    financials.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0),
    [financials]
  );
  const totalDebits = useMemo(() =>
    financials.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0),
    [financials]
  );
  const netBalance = totalDebits - totalCredits; // Debits (money owed to user) minus Credits (money user owes)


  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 bg-white border border-gray-100 p-12 rounded-md shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-8">
          <div className="p-3 bg-gray-50 rounded-full border border-gray-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
            <MdAccountBalanceWallet className="text-3xl text-[#09111E]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#09111E] leading-none mb-3">Capital Flows</h1>
            <p className="text-[#09111E]/80 text-lg font-medium opacity-60">Financial audits, credit cycles, and debt reconciliations</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => setIsFinancialFormOpen(true)}
            className="group relative px-8 py-4 bg-[#09111E] text-white font-semibold rounded-md shadow-lg overflow-hidden hover:scale-105 transition-all active:scale-95 text-sm hover:bg-[#0a1520]"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="flex items-center gap-3 relative z-10">
              <MdAdd className="text-2xl" />
              <span>Initialize Fiscal Protocol</span>
            </div>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard label="Total Outbound" value={(totalCredits / 1000000).toFixed(2)} unit="M Frw" trend="Credit Assets" />
        <SummaryCard label="Total Inbound" value={(totalDebits / 1000000).toFixed(2)} unit="M Frw" trend="Debit Assets" />
        <SummaryCard label="Net Strategic Value" value={(netBalance / 1000000).toFixed(2)} unit="M Frw" trend="Fiscal Equilibrium" />
        <SummaryCard label="Active Protocols" value={financials.length} unit="Records" trend="Total Records" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 shadow-sm p-12 rounded-md relative overflow-hidden group/actions">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-50 rounded-md blur-[120px] -mr-[300px] -mt-[300px] pointer-events-none" />
        <h3 className="text-2xl font-bold text-[#09111E] mb-10 relative z-10">Operational Tactical Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { label: 'Record Inbound', sub: 'Authorize Incoming Value', icon: <MdTrendingUp />, color: 'green-600' },
            { label: 'Record Outbound', sub: 'Authorize Outgoing Value', icon: <MdTrendingDown />, color: 'red-500' },
            { label: 'Fiscal Analytics', sub: 'Generate Synthesis Report', icon: <MdAttachMoney />, color: 'blue-600' }
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => action.label.includes('Analytics') ? null : setIsFinancialFormOpen(true)}
              className="group/btn flex items-center gap-6 p-8 bg-gray-50 border border-gray-100 rounded-md hover:bg-gray-100 hover:border-gray-200 transition-all text-left shadow-sm relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 w-1 h-0 bg-[#09111E] group-hover/btn:h-full transition-all duration-300" />
              <div className={`p-4 rounded-full shadow-sm transition-transform group-hover/btn:scale-110 ${action.color === 'red-500' ? 'bg-red-50 text-red-600' : action.color === 'green-600' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                <action.icon.type className="text-2xl" />
              </div>
              <div>
                <p className={`font-bold transition-colors  text-lg leading-none ${action.color === 'blue-600' ? 'text-blue-600' : 'text-[#09111E] group-hover/btn:text-[#09111E]'}`}>{action.label}</p>
                <p className="text-xs text-[#09111E]/80 font-medium mt-2 opacity-60">{action.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-100 shadow-sm p-10 rounded-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-md -mr-48 -mt-48 opacity-30 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row gap-8 relative z-10">
          <div className="flex-1 relative group/search">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#09111E]/60 text-2xl group-focus-within/search:text-[#09111E] transition-colors" />
            <input
              type="text"
              placeholder="Query repository by transaction description..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-md text-[#09111E] font-medium placeholder:text-[#09111E]/60 focus:outline-none focus:ring-1 focus:ring-blue-500/10 focus:border-gray-100 transition-all shadow-inner text-sm"
            />
          </div>
          <div className="relative group/select">
            <MdFilterList className="absolute left-5 top-1/2 -translate-y-1/2 text-[#09111E]/60 text-2xl group-focus-within/select:text-[#09111E] transition-colors pointer-events-none" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-14 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-md text-[#09111E]/80 focus:outline-none focus:ring-1 focus:ring-blue-500/5 focus:border-gray-100 transition-all appearance-none cursor-pointer font-bold text-xs shadow-inner min-w-[200px]"
            >
              <option value="all">Global Catalog</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden transition-all group/table relative">
        <div className="p-12 border-b border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-12 relative z-10 px-2">
            <div>
              <h3 className="text-2xl font-bold text-[#09111E] leading-none mb-3">Transaction Registry</h3>
              <p className="text-[#09111E]/80 text-xs font-medium opacity-60 italic">Displaying local records within specific parameters</p>
            </div>
            <div className="px-6 py-2.5 bg-gray-50 border border-gray-100 shadow-inner rounded-md text-xs font-semibold text-[#09111E]">
              {visibleTransactions.length} Verified Entries
            </div>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Classification</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Ledger Entry</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Volume Allocation</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Chronology Marker</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Verification</th>
                <th className="px-10 py-6 text-center text-sm font-bold text-[#09111E]/80">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-10 py-40">
                    <div className="flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                      <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-gray-50 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative p-10 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                          <MdReceipt className="text-7xl text-[#09111E]/50 group-hover:text-[#09111E] transition-colors duration-500" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-bold text-[#09111E] mb-4">Ledger Vacancy</h3>
                      <p className="text-[#09111E]/80 font-medium opacity-60 leading-relaxed text-sm">
                        {searchTerm
                          ? 'The current search parameters yielded zero recorded matches within the fiscal repository.'
                          : 'The localized fiscal ledger remains pristine. Initialize a new protocol to register financial assets.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setIsFinancialFormOpen(true)}
                          className="mt-12 px-10 py-4 bg-[#09111E] text-white font-bold text-[16px] rounded-md hover:bg-[#0a1520] transition-all active:scale-95 shadow-xl"
                        >
                          Establish First Protocol
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                visibleTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-all group/row relative text-[#09111E] border-b border-gray-50 last:border-0">
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[#09111E] group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-md shadow-sm transition-all group-hover/row:scale-110 ${transaction.type === 'Credit' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          {transaction.type === 'Credit' ? <MdTrendingDown className="text-xl" /> : <MdTrendingUp className="text-xl" />}
                        </div>
                        <span className={`text-[10px] font-bold italic px-4 py-2 rounded-md border bg-gray-50 text-[#09111E] border-gray-100`}>
                          Certified
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-base font-bold text-[#09111E] group-hover/row:text-[#09111E] transition-colors leading-tight">
                        {transaction.description}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <p className={`text-xl font-bold ${transaction.type === 'Credit' ? 'text-red-600' : 'text-[#09111E]'
                        }`}>
                        {transaction.type === 'Credit' ? '-' : '+'}{transaction.amount.toLocaleString()} <span className="text-[10px] text-[#09111E]/60 font-bold italic">Frw</span>
                      </p>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-full border border-gray-100 opacity-80 group-hover/row:opacity-100 transition-all">
                          <MdCalendarToday className={`text-xl ${!transaction.paid && isOverdue(transaction.deadline) ? 'text-red-600 rotate-12 animate-pulse' : 'text-[#09111E]/60'}`} />
                        </div>
                        <div>
                          <p className="text-[11px] text-[#09111E] font-bold italic leading-none mb-1">
                            {formatDeadline(transaction.deadline)}
                          </p>
                          {!transaction.paid && (isOverdue(transaction.deadline) || isDeadlineApproaching(transaction.deadline)) && (
                            <p className={`text-[9px] font-bold ${isOverdue(transaction.deadline) ? 'text-red-600' : 'text-amber-500'}`}>
                              {isOverdue(transaction.deadline) ? 'System Overdue' : 'Due Imminent'}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-[10px] text-[#09111E]/80 font-bold italic group-hover/row:text-[#09111E] transition-colors opacity-80 group-hover/row:opacity-100">
                        {transaction.collateral || 'Unsecured Protocol'}
                      </p>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="flex items-center justify-center gap-5">
                        <button
                          onClick={() => handleViewFinancial(transaction)}
                          className="p-4 text-[#09111E]/60 hover:text-[#09111E] bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-100 transition-all hover:shadow-md active:scale-95"
                          title="View/Edit Details"
                        >
                          <MdEdit className="text-2xl" />
                        </button>
                        {!transaction.paid && (
                          <button
                            onClick={() => handleMarkAsPaid(transaction)}
                            className="p-4 text-[#09111E]/60 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-md border border-gray-100 transition-all hover:shadow-md active:scale-95"
                            title="Mark As Paid"
                          >
                            <MdCheckCircle className="text-2xl" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Form */}
      <FinancialForm
        isOpen={isFinancialFormOpen}
        onClose={() => setIsFinancialFormOpen(false)}
        onSave={() => {
          // Refresh the financials list after adding new one
          fetchFinancials();
          setIsFinancialFormOpen(false);
        }}
      />

      {/* View Financial Modal */}
      <ViewFinancialModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        financial={selectedFinancial}
        onMarkAsPaid={handleMarkAsPaid}
        onUpdateFinancial={handleUpdateFinancial}
      />

      {/* Confirm Mark as Paid Modal */}
      {isConfirmPaidOpen && (
        <div className="fixed inset-0 bg-[#09111E]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
          <div className="bg-white border border-gray-100 rounded-md shadow-2xl w-full max-w-lg overflow-hidden relative p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-md blur-[80px] -mr-32 -mt-32" />
            <h2 className="text-3xl font-bold text-[#09111E] mb-8">Authorization Logic</h2>
            <p className="text-[#09111E]/80 text-sm font-semibold leading-relaxed opacity-80 mb-10">
              You are about to mark this financial record as <span className="text-[#09111E] font-bold decoration-underline decoration-2 underline-offset-4">Completed</span>.
              This action affects your universal balance and <span className="text-[#09111E]/80 font-bold">cannot be undone</span>.
            </p>
            <div className="space-y-4 mb-12">
              <label className="text-xs font-semibold text-[#09111E]/60 px-2">Confirm Protocol Code</label>
              <input
                type="text"
                value={confirmPaidText}
                onChange={(e) => setConfirmPaidText(e.target.value)}
                className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-md text-[#09111E] font-medium text-lg placeholder:text-[#09111E]/60 focus:outline-none focus:ring-1 focus:ring-blue-500/10 transition-all shadow-inner"
                placeholder="Type 'Mark As Paid'"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-10">
              <button
                onClick={() => {
                  setIsConfirmPaidOpen(false);
                  setFinancialToMarkPaid(null);
                  setConfirmPaidText('');
                }}
                className="text-sm font-semibold text-[#09111E]/80 hover:text-[#09111E] transition-colors"
              >
                Abort Action
              </button>
              <button
                onClick={confirmMarkAsPaid}
                disabled={confirmPaidText.toLowerCase().trim() !== 'mark as paid'}
                className={`px-10 py-4 rounded-md font-semibold transition-all text-sm shadow-md   ${confirmPaidText.toLowerCase().trim() === 'mark as paid'
                  ? 'bg-[#09111E] text-white hover:bg-[#0a1520] active:scale-95'
                  : 'bg-gray-100 text-[#09111E]/40 cursor-not-allowed border border-gray-100'
                  }`}
              >
                Confirm Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, unit, trend }) => {
  return (
    <div className="bg-[#09111E] border border-white/5 rounded-md p-6 shadow-2xl hover:shadow-brand-500/10 transition-all cursor-pointer group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000 blur-2xl opacity-60" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <p className="text-md font-semibold text-white/40 mb-6">{label}</p>
          <h4 className="text-4xl font-bold text-white leading-none mb-6">
            {value?.toLocaleString() || '0'} <span className="text-lg text-white/20 font-bold italic ml-1">{unit}</span>
          </h4>
          <p className="text-sm text-white/20 font-medium">{trend}</p>
        </div>
      </div>
    </div>
  );
};

export default CreditsDebit;
