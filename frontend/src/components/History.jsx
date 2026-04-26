import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MdSearch, MdCalendarToday, MdReceipt,
  MdShoppingCart, MdAttachMoney, MdAccountBalance,
  MdTrendingUp, MdVisibility, MdRefresh, MdDownload, MdInfo, MdLayers, MdHistory
} from 'react-icons/md';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { backendGqlApi } from '../utils/axiosInstance';
import { findallTransactionsQuery } from '../utils/gqlQuery';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '../utils/toast';

const History = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await backendGqlApi.post('', {
        query: findallTransactionsQuery,
      });

      if (response.data.errors) {
        toast.error('Audit Log Retrieval Failed');
        setError('System Error: Failed To Load Transactions');
        return;
      }

      const transactionsData = response.data.data.transactions?.data || [];
      setTransactions(transactionsData);
    } catch {
      setError('Network Error: Failed To Load Transactions');
      toast.error('Audit Log Retrieval Failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = selectedFilter === 'all' || t.type?.toLowerCase() === selectedFilter;
      const searchMatch = searchTerm === '' ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.products?.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      return typeMatch && searchMatch;
    });
  }, [transactions, selectedFilter, searchTerm]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalSales = transactions
      .filter(t => t.type?.toLowerCase() === 'sale')
      .reduce((sum, t) => sum + (t.financials?.reduce((acc, f) => acc + (f.amount || 0), 0) || 0), 0);

    const totalPurchases = transactions
      .filter(t => t.type?.toLowerCase() === 'purchase')
      .reduce((sum, t) => sum + (t.financials?.reduce((acc, f) => acc + (f.amount || 0), 0) || 0), 0);

    return {
      total: transactions.length,
      sales: totalSales,
      purchases: totalPurchases,
      net: totalSales - totalPurchases
    };
  }, [transactions]);

  const handleTransactionClick = (transaction) => {
    navigate(`/transaction/${transaction.id}`);
  };


  const getTypeIcon = (type) => {
    return type?.toLowerCase() === 'sale' ? <MdShoppingCart className="text-xl" /> : <MdAttachMoney className="text-xl" />;
  };

  if (loading && transactions.length === 0) {
    return <Loader />;
  }

  if (error && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8 font-Urbanist">
        <div className="p-10 bg-white rounded-md border border-gray-100 shadow-sm text-center">
          <MdInfo className="text-6xl text-red-600 mx-auto mb-6" />
          <p className="text-2xl font-black text-red-600">{error}</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="px-12 py-5 bg-[#09111E] text-white rounded-md font-black text-xs transition-all active:scale-95 shadow-lg hover:bg-[#0a1520]"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white border border-gray-100 p-12 rounded-md shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-3 bg-gray-50 rounded-full border border-gray-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
            <MdHistory className="text-3xl text-[#09111E]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#09111E] leading-none mb-3">Audit Ledger</h1>
            <p className="text-[#09111E]/80 text-lg font-medium opacity-60">Immutable chronology of all recorded system transactions</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button
            onClick={fetchTransactions}
            className="p-3 bg-gray-50 hover:bg-gray-100 text-[#09111E]/80 hover:text-[#09111E] rounded-full border border-gray-100 transition-all active:scale-95 shadow-sm group/btn"
          >
            <MdRefresh className="text-2xl group-hover/btn:rotate-180 transition-transform duration-700" />
          </button>
          <button
            className="group/export relative px-8 py-4 bg-[#09111E] text-white rounded-md font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg overflow-hidden text-sm"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <div className="flex items-center gap-3 relative z-10">
              <MdDownload className="text-2xl" />
              <span>Export Manifesto</span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard label="Records Indexed" value={stats.total} unit="Logs" trend="Live Dataset" color="blue-600" />
        <SummaryCard label="Total Inbound" value={stats.sales} unit="Frw" trend="Frw Acquired" color="green-600" />
        <SummaryCard label="Total Outbound" value={stats.purchases} unit="Frw" trend="Frw Deployed" color="red-500" />
        <SummaryCard label="Net Strategic Value" value={stats.net} unit="Frw" trend="Fiscal Balance" color="blue-500" />
      </div>

      {/* Tactical Console (Filters/Search) */}
      <div className="bg-white border border-gray-100 p-10 rounded-md shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-md blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-center">
          <div className="flex-1 relative group/search w-full">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#09111E]/60 text-2xl group-focus-within/search:text-[#09111E] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Query internal records by identity or parameter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/10 focus:border-gray-100 text-[#09111E] placeholder-[#09111E]/30 transition-all text-md font-medium shadow-inner"
            />
          </div>
          <div className="flex flex-wrap gap-4 bg-gray-50 p-2 rounded-md border border-gray-100 shadow-inner">
            {['all', 'sale', 'purchase'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-8 py-2 rounded-md font-semibold transition-all duration-300 text-sm ${selectedFilter === filter
                  ? 'bg-[#09111E] text-white shadow-md'
                  : 'text-[#09111E]/80 hover:text-[#09111E] hover:bg-gray-100'
                  }`}
              >
                {filter === 'all' ? 'Global' : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden group/table relative">
        <div className="p-12 border-b border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10 text-[#09111E]">
            <div className="p-3 bg-gray-50 rounded-full text-[#09111E] border border-gray-100 shadow-sm">
              <MdHistory className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#09111E]">Action Repository</h3>
          </div>
          <div className="px-6 py-2.5 bg-gray-50 border border-gray-100 shadow-inner rounded-md text-xs font-semibold text-[#09111E] relative z-10">
            Scanning {filteredTransactions.length} Event Logs
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80 w-1/3">Activity Protocol</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Operation Entity</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Classification</th>
                <th className="px-10 py-6 text-left text-sm font-bold text-[#09111E]/80">Chronology Marker</th>
                <th className="px-10 py-6 text-center text-sm font-bold text-[#09111E]/80">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-all cursor-pointer group/row relative text-[#09111E] border-b border-gray-50 last:border-0"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[#09111E] group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-md border transition-all duration-300 group-hover/row:scale-110 shadow-sm ${transaction.type?.toLowerCase() === 'sale' ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                          : 'bg-red-50 border-red-100 text-red-600'
                          }`}>
                          {getTypeIcon(transaction.type)}
                        </div>
                        <span className={`text-xs font-bold ${transaction.type?.toLowerCase() === 'sale' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="max-w-md">
                        <p className="text-base font-bold text-[#09111E] group-hover/row:text-[#09111E] transition-colors leading-tight line-clamp-2">
                          {transaction.products?.map(p => p.name).join(' + ') || transaction.description || 'Unidentified Payload'}
                        </p>
                        <p className="text-[10px] font-bold text-[#09111E]/60 mt-2 italic leading-none opacity-60">
                          Reference Hash: {transaction.id?.slice(-12)}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-[#09111E]">
                          {(transaction.financials?.reduce((acc, f) => acc + (f.amount || 0), 0) || 0).toLocaleString()} <span className="text-[10px] text-[#09111E]/60 ml-2 opacity-60 italic">Frw</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-gray-50 rounded-md border border-gray-100 opacity-80 group-hover/row:opacity-100 group-hover/row:shadow-sm transition-all">
                          <MdCalendarToday className="text-[#09111E]/60 text-xl group-hover/row:text-[#09111E] transition-colors" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#09111E]">
                            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Chronology Error'}
                          </span>
                          <span className="text-[10px] text-[#09111E]/40 mt-1 font-bold italic opacity-60 block">
                            {transaction.createdAt ? formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true }) : ''}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="text-xs font-bold text-[#09111E]/80 italic bg-gray-50 border border-gray-100 px-4 py-2 rounded-md shadow-sm group-hover/row:bg-gray-100 group-hover/row:text-[#09111E] transition-all">
                        {transaction.secondParty || 'Internal Protocol'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-10 py-40">
                    <div className="flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                      <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-gray-50 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative p-8 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                          <MdReceipt className="text-7xl text-[#09111E]/50 group-hover:text-[#09111E] transition-colors duration-500" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-bold text-[#09111E] mb-4">No Historical Data</h3>
                      <p className="text-[#09111E]/80 italic font-medium opacity-80 leading-relaxed text-sm">
                        {searchTerm
                          ? 'The specific operational parameters yielded zero recorded matches within the audit ledger.'
                          : 'The chronology repository is currently empty. Execute a system activity to map your historical profile.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Tactical Summary Component
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

export default History;
