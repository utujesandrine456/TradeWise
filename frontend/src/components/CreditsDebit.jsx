import React, { useState, useEffect, useMemo } from 'react';
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
  const fetchFinancials = async () => {
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
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

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

  const handleScroll = throttle(() => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (bottom && visibleCount < filteredTransactions.length) {
      setVisibleCount((prev) => prev + 10);
    }
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredTransactions.length]);

  const totalCredits = useMemo(() =>
    financials.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0),
    [financials]
  );
  const totalDebits = useMemo(() =>
    financials.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0),
    [financials]
  );
  const netBalance = totalDebits - totalCredits; // Debits (money owed to user) minus Credits (money user owes)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 rounded-md';
      case 'pending': return 'bg-yellow-100 text-yellow-800 rounded-md';
      case 'cancelled': return 'bg-red-100 text-red-800 rounded-md';
      default: return 'bg-brand-50 text-[#09111E] rounded-md';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'Credit' ? (
      <MdTrendingDown className="text-red-500 text-lg" />
    ) : (
      <MdTrendingUp className="text-green-500 text-lg" />
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-Urbanist text-white">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-accent-400/20 border-t-accent-400 rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(96,165,250,0.3)]"></div>
          <MdAccountBalanceWallet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-accent-400" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-2xl font-bold opacity-80">Synchronizing Ledger</p>
          <p className="text-sm font-semibold text-brand-300 opacity-60">Accessing Fiscal Manifests and Credit Assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 bg-[#09111E] border border-white/5 p-12 rounded-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-8">
          <div className="p-3 bg-white/5 rounded-full border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-500">
            <MdAccountBalanceWallet className="text-3xl text-accent-400" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight leading-none mb-3">Financial Management</h2>
            <p className="text-brand-300 text-lg font-medium opacity-60">Strategic oversight of credits, debits, and fiscal assets</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => setIsFinancialFormOpen(true)}
            className="group relative px-8 py-4 bg-white text-brand-950 font-semibold rounded-md shadow-2xl overflow-hidden hover:scale-105 transition-all active:scale-95 text-sm"
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
        <SummaryCard icon={MdTrendingDown} label="Total Outbound" value={`${(totalCredits / 1000000).toFixed(2)}M`} trend="Credit Assets" color="red-500" />
        <SummaryCard icon={MdTrendingUp} label="Total Inbound" value={`${(totalDebits / 1000000).toFixed(2)}M`} trend="Debit Assets" color="green-500" />
        <SummaryCard icon={MdAccountBalanceWallet} label="Net Strategic Value" value={`${(netBalance / 1000000).toFixed(2)}M`} trend="Fiscal Equilibrium" color={netBalance >= 0 ? 'green-500' : 'red-500'} />
        <SummaryCard icon={MdReceipt} label="Active Protocols" value={financials.length} trend="Total Records" color="accent-400" />
      </div>

      {/* Quick Actions */}
      <div className="bg-[#09111E] border border-white/5 shadow-2xl p-12 rounded-md relative overflow-hidden group/actions">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-400/5 rounded-md blur-[120px] -mr-[300px] -mt-[300px] pointer-events-none" />
        <h3 className="text-2xl font-bold text-white mb-10 tracking-tighter relative z-10">Operational Tactical Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { label: 'Record Inbound', sub: 'Authorize Incoming Value', icon: <MdTrendingUp />, color: 'green-500' },
            { label: 'Record Outbound', sub: 'Authorize Outgoing Value', icon: <MdTrendingDown />, color: 'red-500' },
            { label: 'Fiscal Analytics', sub: 'Generate Synthesis Report', icon: <MdAttachMoney />, color: 'accent-400' }
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => action.label.includes('Analytics') ? null : setIsFinancialFormOpen(true)}
              className="group/btn flex items-center gap-6 p-8 bg-white/5 border border-white/5 rounded-md hover:bg-white/10 hover:border-white/10 transition-all text-left shadow-inner relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 w-1 h-0 bg-accent-400 group-hover/btn:h-full transition-all duration-300" />
              <div className={`p-4 rounded-full shadow-lg transition-transform group-hover/btn:scale-110 ${action.color === 'red-500' ? 'bg-red-500/10 text-red-500' : action.color === 'green-500' ? 'bg-green-500/10 text-green-500' : 'bg-accent-400/10 text-accent-400'
                }`}>
                <action.icon.type className="text-2xl" />
              </div>
              <div>
                <p className="font-bold text-white transition-colors tracking-tight text-lg leading-none">{action.label}</p>
                <p className="text-xs text-brand-300 font-medium mt-2 opacity-60">{action.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#09111E] border border-white/5 shadow-2xl p-10 rounded-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-400/5 rounded-md -mr-48 -mt-48 opacity-30 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row gap-8 relative z-10">
          <div className="flex-1 relative group/search">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-300 text-2xl group-focus-within/search:text-accent-400 transition-colors" />
            <input
              type="text"
              placeholder="Query repository by transaction description..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-white/5 border border-white/5 rounded-md text-white font-medium placeholder:text-brand-300/40 focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 transition-all shadow-inner text-sm"
            />
          </div>
          <div className="relative group/select">
            <MdFilterList className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300 text-2xl group-focus-within/select:text-accent-400 transition-colors pointer-events-none" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-14 pr-10 py-5 bg-white/5 border border-white/5 rounded-md text-white focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 transition-all appearance-none cursor-pointer font-bold text-xs shadow-inner min-w-[200px]"
            >
              <option value="all" className="bg-[#09111E]">Global Catalog</option>
              <option value="credit" className="bg-[#09111E]">Credits Only</option>
              <option value="debit" className="bg-[#09111E]">Debits Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-2xl overflow-hidden transition-all group/table relative">
        <div className="p-12 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-3 bg-white/5 rounded-full text-accent-400 border border-white/5 shadow-xl">
              <MdReceipt className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Recent Ledger Entries</h3>
          </div>
          <div className="px-6 py-2.5 bg-white/5 border border-white/5 shadow-inner rounded-md text-xs font-semibold text-brand-300 relative z-10">
            {filteredTransactions.length} Matches Found
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-10 py-6 text-left text-sm font-bold text-brand-300 w-32">Classification</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-brand-300">Description / Value</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-brand-300">Paid Registry</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-brand-300">Due Date</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-brand-300">Collateral</th>
                <th className="px-10 py-6 text-right text-sm font-bold text-brand-300 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-10 py-40">
                    <div className="flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                      <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-accent-400/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative p-10 bg-[#09111E] rounded-full border border-white/20 shadow-2xl">
                          <MdReceipt className="text-7xl text-brand-300/20 group-hover:text-accent-400 transition-colors duration-500" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-bold text-white tracking-tighter mb-4">Ledger Vacancy</h3>
                      <p className="text-brand-300 font-medium opacity-60 leading-relaxed text-sm">
                        {searchTerm
                          ? 'The current search parameters yielded zero recorded matches within the fiscal repository.'
                          : 'The localized fiscal ledger remains pristine. Initialize a new protocol to register financial assets.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setIsFinancialFormOpen(true)}
                          className="mt-12 px-10 py-4 bg-white/5 border border-white/10 text-white font-bold text-[16px] rounded-md hover:bg-white/10 transition-all active:scale-95 shadow-xl"
                        >
                          Establish First Protocol
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                visibleTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-white/[0.03] transition-all group/row relative">
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-accent-400 group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-md shadow-md transition-all group-hover/row:scale-110 ${transaction.type === 'Credit' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                          {transaction.type === 'Credit' ? <MdTrendingDown className="text-xl" /> : <MdTrendingUp className="text-xl" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${transaction.type === 'Credit' ? 'text-red-500' : 'text-green-500'
                          }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="max-w-xs">
                        <p className="text-base font-black text-white group-hover/row:text-accent-400 transition-colors uppercase tracking-tight truncate mb-2">{transaction.description}</p>
                        <p className={`text-xl font-black tracking-tighter ${transaction.type === 'Credit' ? 'text-red-500' : 'text-green-500'
                          }`}>
                          {transaction.type === 'Credit' ? '-' : '+'}{transaction.amount.toLocaleString()} <span className="text-[10px] text-brand-300 opacity-40 uppercase tracking-widest ml-1 font-Urbanist italic font-bold">Frw</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex px-6 py-2.5 text-[9px] font-black rounded-md border uppercase tracking-widest shadow-sm ${transaction.paid ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                        }`}>
                        {transaction.paid ? 'Completed' : 'Awaiting Payment'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-md border border-white/5 opacity-60 group-hover/row:opacity-100 transition-all">
                          <MdCalendarToday className={`text-xl ${!transaction.paid && isOverdue(transaction.deadline) ? 'text-red-500 rotate-12 animate-pulse' : 'text-brand-300'}`} />
                        </div>
                        <div>
                          <p className="text-[11px] text-white font-black uppercase tracking-widest italic leading-none mb-1">
                            {formatDeadline(transaction.deadline)}
                          </p>
                          {!transaction.paid && (isOverdue(transaction.deadline) || isDeadlineApproaching(transaction.deadline)) && (
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isOverdue(transaction.deadline) ? 'text-red-500' : 'text-amber-500'}`}>
                              {isOverdue(transaction.deadline) ? 'System Overdue' : 'Due Imminent'}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-[10px] text-brand-300 font-bold uppercase tracking-widest italic group-hover/row:text-white transition-colors opacity-60 group-hover/row:opacity-100">
                        {transaction.collateral || 'Unsecured Protocol'}
                      </p>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-5">
                        <button
                          onClick={() => handleViewFinancial(transaction)}
                          className="p-4 text-brand-300 hover:text-accent-400 bg-white/5 hover:bg-white/10 rounded-md border border-white/5 transition-all hover:shadow-2xl active:scale-95"
                          title="View/Edit Details"
                        >
                          <MdEdit className="text-2xl" />
                        </button>
                        {!transaction.paid && (
                          <button
                            onClick={() => handleMarkAsPaid(transaction)}
                            className="p-4 text-brand-300 hover:text-green-500 bg-white/5 hover:bg-white/10 rounded-md border border-white/5 transition-all hover:shadow-2xl active:scale-95"
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
        onSave={(newFinancial) => {
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
        <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
          <div className="bg-[#09111E] border border-white/5 rounded-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden relative p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-md blur-3xl -mr-32 -mt-32" />
            <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Authorization Logic</h2>
            <p className="text-brand-300 text-sm font-semibold leading-relaxed opacity-60 mb-10">
              You are about to mark this financial record as <span className="text-green-500 font-bold decoration-underline decoration-2 underline-offset-4 uppercase">Completed</span>.
              This action affects your universal balance and <span className="text-red-500 font-bold">cannot be undone</span>.
            </p>
            <div className="space-y-4 mb-12">
              <label className="text-xs font-semibold text-brand-300 px-2 opacity-60">Confirm Protocol Code</label>
              <input
                type="text"
                value={confirmPaidText}
                onChange={(e) => setConfirmPaidText(e.target.value)}
                className="w-full px-8 py-4 bg-white/5 border border-white/5 rounded-md text-white font-medium text-lg placeholder:text-brand-300/20 focus:outline-none focus:ring-4 focus:ring-accent-400/10 transition-all shadow-inner"
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
                className="text-sm font-semibold text-brand-300 hover:text-white transition-colors"
              >
                Abort Action
              </button>
              <button
                onClick={confirmMarkAsPaid}
                disabled={confirmPaidText.toLowerCase().trim() !== 'mark as paid'}
                className={`px-10 py-4 rounded-md font-semibold transition-all text-sm shadow-2xl ${confirmPaidText.toLowerCase().trim() === 'mark as paid'
                  ? 'bg-white text-brand-950 hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-brand-300 cursor-not-allowed border border-white/5'
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

// Tactical Summary Component
const SummaryCard = ({ icon: Icon, label, value, trend, color }) => {
  const colorMap = {
    'accent-400': 'text-accent-400 bg-accent-400/10 border-accent-400/20 from-accent-400',
    'green-500': 'text-green-500 bg-green-500/10 border-green-500/20 from-green-500',
    'red-500': 'text-red-500 bg-red-500/10 border-red-500/20 from-red-500',
    'blue-400': 'text-blue-400 bg-blue-400/10 border-blue-400/20 from-blue-400',
  };

  const selectedColor = colorMap[color] || colorMap['accent-400'];
  const [textColor, bgStyle, borderStyle, gradStyle] = selectedColor.split(' ');

  return (
    <div className="group bg-[#09111E] p-10 rounded-md border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-white/10">
      <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${gradStyle}/50 to-transparent opacity-50`} />
      <div className="relative z-10 flex flex-col h-full justify-between gap-10">
        <div>
          <p className="text-md font-semibold text-brand-300 mb-3 opacity-60">{label}</p>
          <p className="text-4xl font-bold text-white tracking-tighter leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default CreditsDebit;
