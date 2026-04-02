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
      fetchFinancials(); // Refresh the data
    } catch (error) {
      console.error('Error marking financial as paid:', error);
      toast.error('Failed to mark financial as paid');
    }
  };

  // Handle update financial
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
      fetchFinancials(); // Refresh the data
    } catch (error) {
      console.error('Error updating financial:', error);
      toast.error('Failed to update financial');
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
      // Filter by type
      const typeMatch = selectedFilter === 'all' || t.type.toLowerCase() === selectedFilter;
      // Filter by search term (description)
      const searchMatch = searchTerm === '' || t.description.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && searchMatch;
    }), [financials, selectedFilter, searchTerm]
  );

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  // Infinite scroll handler
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-center h-40">
        <span className="text-gray-600 text-lg">Loading financial data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-brand-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-3xl font-#FC9E4F text-white lowercase">financial management</h2>
          <p className="text-gray-400 text-sm lowercase font-medium mt-1">track your credits, debits, and financial transactions with absolute clarity</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFinancialFormOpen(true)}
            className="group relative px-8 py-4 bg-accent-400 text-brand-950 rounded-2xl font-#FC9E4F lowercase transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent-400/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="flex items-center gap-2 relative z-10">
              <MdAdd className="text-xl" />
              <span>new financial record</span>
            </div>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'total credits', value: `${(totalCredits / 1000000).toFixed(1)}M`, icon: <MdTrendingDown />, color: 'red' },
          { label: 'total debits', value: `${(totalDebits / 1000000).toFixed(1)}M`, icon: <MdTrendingUp />, color: 'green' },
          { label: 'net balance', value: `${(netBalance / 1000000).toFixed(1)}M`, icon: <MdAccountBalanceWallet />, color: netBalance >= 0 ? 'accent' : 'red' },
          { label: 'total activities', value: financials.length, icon: <MdReceipt />, color: 'accent' }
        ].map((stat, i) => (
          <div key={i} className="bg-brand-900/50 border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-bold text-gray-400 lowercase italic mb-1">{stat.label}</p>
                <p className={`text-3xl font-#FC9E4F ${stat.color === 'red' && i === 2 ? 'text-red-500' : 'text-white'}`}>{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color === 'red' ? 'bg-red-500/10 text-red-500' : stat.color === 'green' ? 'bg-green-500/10 text-green-500' : 'bg-accent-400/10 text-accent-400'} border border-white/5`}>
                <stat.icon.type className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-accent-400/20 to-transparent w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-brand-900/50 border border-white/5 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-xl font-#FC9E4F text-white lowercase mb-8">quick actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'record credit', sub: 'add incoming payment', icon: <MdTrendingUp />, color: 'green' },
            { label: 'record debit', sub: 'add outgoing payment', icon: <MdTrendingDown />, color: 'red' },
            { label: 'financial reports', sub: 'generate detailed reports', icon: <MdAttachMoney />, color: 'accent' }
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => action.label.includes('report') ? null : setIsFinancialFormOpen(true)}
              className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group text-left"
            >
              <div className={`p-4 rounded-xl ${action.color === 'red' ? 'bg-red-500/10 text-red-500' : action.color === 'green' ? 'bg-green-500/10 text-green-500' : 'bg-accent-400/10 text-accent-400'} group-hover:scale-110 transition-transform`}>
                <action.icon.type className="text-2xl" />
              </div>
              <div>
                <p className="font-#FC9E4F text-white lowercase">{action.label}</p>
                <p className="text-xs text-gray-500 font-medium lowercase italic mt-1">{action.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-brand-900/50 border border-white/5 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="search by description..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400/50 transition-all lowercase"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-accent-400/50 transition-all lowercase appearance-none cursor-pointer font-bold"
          >
            <option value="all" className="bg-brand-900">all transactions</option>
            <option value="credit" className="bg-brand-900">credits only</option>
            <option value="debit" className="bg-brand-900">debits only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-brand-900/50 border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-xl font-#FC9E4F text-white lowercase">recent transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-5 text-left text-xs font-#FC9E4F text-gray-400 lowercase tracking-widest italic">type</th>
                <th className="px-8 py-5 text-left text-xs font-#FC9E4F text-gray-400 lowercase tracking-widest italic">description</th>
                <th className="px-8 py-5 text-left text-xs font-#FC9E4F text-gray-400 lowercase tracking-widest italic">paid status</th>
                <th className="px-8 py-5 text-left text-xs font-#FC9E4F text-gray-400 lowercase tracking-widest italic">deadline</th>
                <th className="px-8 py-5 text-left text-xs font-#FC9E4F text-gray-400 lowercase tracking-widest italic">collateral</th>
                <th className="px-8 py-5 text-left text-xs font-#FC9E4F text-gray-400 lowercase tracking-widest italic">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center text-gray-500 lowercase italic font-medium">
                    no financial records found for this criteria
                  </td>
                </tr>
              ) : (
                visibleTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transaction.type === 'Credit' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {transaction.type === 'Credit' ? <MdTrendingDown /> : <MdTrendingUp />}
                        </div>
                        <span className={`text-sm font-#FC9E4F lowercase ${transaction.type === 'Credit' ? 'text-red-500' : 'text-green-500'
                          }`}>
                          {transaction.type.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-white font-bold lowercase truncate">{transaction.description}</p>
                        <p className={`text-xs font-#FC9E4F mt-1 ${transaction.type === 'Credit' ? 'text-red-400' : 'text-green-400'
                          }`}>
                          {transaction.type === 'Credit' ? '-' : '+'}{transaction.amount.toLocaleString()} frw
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-4 py-1.5 text-[10px] font-#FC9E4F rounded-full lowercase border ${transaction.paid ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                        }`}>
                        {transaction.paid ? 'paid' : 'unpaid'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 lowercase font-medium">
                          {formatDeadline(transaction.deadline)}
                        </span>
                        {!transaction.paid && (isOverdue(transaction.deadline) || isDeadlineApproaching(transaction.deadline)) && (
                          <MdWarning className={`${isOverdue(transaction.deadline) ? 'text-red-500' : 'text-amber-400'} text-lg animate-pulse`} />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-400 lowercase italic">
                      {transaction.collateral || 'none recorded'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewFinancial(transaction)}
                          className="p-2.5 text-gray-400 hover:text-accent-400 bg-white/5 rounded-xl border border-white/5 transition-all hover:scale-110"
                          title="view/edit details"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                        {!transaction.paid && (
                          <button
                            onClick={() => handleMarkAsPaid(transaction)}
                            className="p-2.5 text-gray-400 hover:text-green-500 bg-white/5 rounded-xl border border-white/5 transition-all hover:scale-110"
                            title="mark as paid"
                          >
                            <MdCheckCircle className="text-lg" />
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
        <div className="fixed inset-0 bg-brand-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-brand-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="p-8 border-b border-white/5">
              <h2 className="text-xl font-#FC9E4F text-white lowercase">confirm mark as paid</h2>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-gray-400 text-sm lowercase font-medium leading-relaxed">
                you are about to mark this financial record as <span className="text-accent-400 font-bold italic">paid back</span>.
                this action affects your financial tracking and <span className="text-white font-#FC9E4F">cannot be undone</span>.
              </p>
              <div>
                <p className="text-xs text-gray-500 font-#FC9E4F lowercase mb-3 italic">
                  type <span className="text-accent-400">mark as paid</span> to confirm:
                </p>
                <input
                  type="text"
                  value={confirmPaidText}
                  onChange={(e) => setConfirmPaidText(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-accent-400/50 transition-all lowercase italic"
                  placeholder="type mark as paid"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-8 bg-white/5 border-t border-white/5 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setIsConfirmPaidOpen(false);
                  setFinancialToMarkPaid(null);
                  setConfirmPaidText('');
                }}
                className="px-8 py-3 text-gray-400 hover:text-white transition-colors lowercase font-bold"
              >
                cancel
              </button>
              <button
                onClick={confirmMarkAsPaid}
                disabled={confirmPaidText.toLowerCase().trim() !== 'mark as paid'}
                className={`px-8 py-3 rounded-2xl font-#FC9E4F lowercase transition-all ${confirmPaidText.toLowerCase().trim() === 'mark as paid'
                    ? 'bg-accent-400 text-brand-950 hover:scale-105 shadow-xl shadow-accent-400/20'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                  }`}
              >
                confirm paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsDebit;
