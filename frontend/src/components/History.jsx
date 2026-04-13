import React, { useState, useEffect, useMemo } from 'react';
import {
  MdSearch, MdFilterList, MdCalendarToday, MdReceipt,
  MdShoppingCart, MdAttachMoney, MdAccountBalance,
  MdTrendingUp, MdVisibility, MdRefresh, MdDownload,
  MdOutlineSwapHoriz, MdPendingActions, MdInfo, MdLayers, MdHistory
} from 'react-icons/md';
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

  const fetchTransactions = async () => {
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
    } catch (err) {
      setError('Network Error: Failed To Load Transactions');
      toast.error('Audit Log Retrieval Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20 rounded-md px-2 py-0.5 text-xs font-bold';
      case 'pending': return 'bg-amber-400/10 text-amber-400 border-amber-400/20 rounded-md px-2 py-0.5 text-xs font-bold';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20 rounded-md px-2 py-0.5 text-xs font-bold';
      default: return 'bg-brand-400/10 text-brand-400 border-brand-400/20 rounded-md px-2 py-0.5 text-xs font-bold';
    }
  };

  const getTypeIcon = (type) => {
    return type?.toLowerCase() === 'sale' ? <MdShoppingCart className="text-xl" /> : <MdAttachMoney className="text-xl" />;
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-Urbanist">
        <div className="w-16 h-16 border-4 border-brand-50 border-t-brand-900 rounded-md animate-spin mb-6"></div>
        <p className="text-xl font-black text-[#09111E] uppercase tracking-widest italic">Retrieving Audit Logs...</p>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8 font-Urbanist">
        <div className="p-10 bg-white rounded-md border border-brand-100 shadow-2xl text-center">
          <MdInfo className="text-6xl text-brand-200 mx-auto mb-6" />
          <p className="text-2xl font-black text-[#09111E] uppercase tracking-tight">{error}</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="px-12 py-5 bg-[#09111E] text-white rounded-md font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl hover:bg-[#09111E]"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-[#09111E] border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-white/5 rounded-md border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-500">
            <MdHistory className="text-5xl text-accent-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white leading-none mb-3 tracking-tight uppercase">Audit Ledger</h1>
            <p className="text-brand-300 text-lg font-bold uppercase tracking-widest italic opacity-60">Comprehensive Archive Of Organizational Transactions</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button
            onClick={fetchTransactions}
            className="p-5 bg-white/5 hover:bg-white/10 text-brand-300 hover:text-white rounded-md border border-white/5 transition-all active:scale-95 shadow-sm group/btn"
          >
            <MdRefresh className="text-2xl group-hover/btn:rotate-180 transition-transform duration-700" />
          </button>
          <button
            className="group/export relative px-12 py-5 bg-accent-400 text-brand-950 rounded-md font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <div className="flex items-center gap-3 relative z-10 font-black">
              <MdDownload className="text-2xl" />
              <span>Export Manifesto</span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard icon={MdLayers} label="Records Indexed" value={stats.total} trend="Live Dataset" color="accent-400" />
        <SummaryCard icon={MdTrendingUp} label="Total Inbound" value={`${(stats.sales / 1000000).toFixed(2)}M`} trend="Frw Acquired" color="green-500" />
        <SummaryCard icon={MdAttachMoney} label="Total Outbound" value={`${(stats.purchases / 1000000).toFixed(2)}M`} trend="Frw Deployed" color="red-500" />
        <SummaryCard icon={MdAccountBalance} label="Net Strategic Value" value={`${(stats.net / 1000000).toFixed(2)}M`} trend="Fiscal Balance" color="blue-400" />
      </div>

      {/* Tactical Console (Filters/Search) */}
      <div className="bg-[#09111E] border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-400/5 rounded-md blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-center">
          <div className="flex-1 relative group/search w-full">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-300 text-2xl group-focus-within/search:text-accent-400 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Query internal records by identity or parameter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-md focus:outline-none focus:ring-4 focus:ring-accent-400/10 focus:border-accent-400/50 text-white placeholder-brand-300/40 transition-all text-lg font-black uppercase tracking-tight shadow-inner"
            />
          </div>
          <div className="flex flex-wrap gap-4 bg-white/5 p-2 rounded-md border border-white/5 shadow-inner">
            {['all', 'sale', 'purchase'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-10 py-3 rounded-md font-black transition-all duration-300 uppercase tracking-widest text-[10px] ${selectedFilter === filter
                  ? 'bg-accent-400 text-brand-950 shadow-xl'
                  : 'text-brand-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                {filter === 'all' ? 'Global' : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-[#09111E] border border-white/5 rounded-md shadow-2xl overflow-hidden group/table relative">
        <div className="p-10 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="p-3 bg-white/5 rounded-md text-accent-400 border border-white/5 shadow-lg">
              <MdLayers className="text-2xl" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Transaction Records</h2>
          </div>
          <div className="px-6 py-2.5 bg-white/5 border border-white/5 shadow-inner rounded-md text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] relative z-10">
            Displaying {filteredTransactions.length} Operations
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] w-40">Classification</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Description / Payload</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Financial Volume</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Temporal Marker</th>
                <th className="px-10 py-6 text-center text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Entity Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-white/[0.03] transition-all cursor-pointer group/row relative"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-accent-400 group-hover/row:h-1/2 transition-all duration-300 rounded-md" />
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-md border transition-all duration-300 group-hover/row:scale-110 shadow-lg ${transaction.type?.toLowerCase() === 'sale' ? 'bg-green-500/10 border-green-500/20 text-green-500'
                          : 'bg-red-500/10 border-red-500/20 text-red-500'
                          }`}>
                          {getTypeIcon(transaction.type)}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${transaction.type?.toLowerCase() === 'sale' ? 'text-green-500' : 'text-red-500'
                          }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="max-w-md">
                        <p className="text-lg font-black text-white group-hover/row:text-accent-400 transition-colors leading-tight uppercase tracking-tight line-clamp-2">
                          {transaction.products?.map(p => p.name).join(' + ') || transaction.description || 'Unidentified Payload'}
                        </p>
                        <p className="text-[10px] font-black text-brand-300 mt-2 uppercase tracking-widest italic leading-none opacity-40">
                          Reference Hash: {transaction.id?.slice(-12)}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-white tracking-tighter uppercase">
                          {(transaction.financials?.reduce((acc, f) => acc + (f.amount || 0), 0) || 0).toLocaleString()} <span className="text-[10px] text-brand-300 tracking-[0.2em] uppercase ml-2 opacity-40 italic">Frw</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-white/5 rounded-md border border-white/5 opacity-50 group-hover/row:opacity-100 group-hover/row:shadow-xl transition-all">
                          <MdCalendarToday className="text-brand-300 text-xl group-hover/row:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-widest italic">
                            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Chronology Error'}
                          </p>
                          <p className="text-[10px] font-black text-brand-300 mt-1 uppercase tracking-widest opacity-40">
                            {transaction.createdAt ? formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true }) : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center justify-center relative">
                        <span className="text-[10px] font-black text-brand-300 bg-white/5 border border-white/5 px-6 py-3 rounded-md shadow-inner group-hover/row:bg-accent-400 group-hover/row:text-brand-950 group-hover/row:shadow-xl transition-all uppercase tracking-[0.2em] italic">
                          {transaction.secondParty || 'Internal Protocol'}
                        </span>
                        <div className="absolute -right-16 opacity-0 group-hover/row:opacity-100 group-hover/row:-right-8 transition-all duration-500 bg-accent-400 text-brand-950 p-3 rounded-md shadow-2xl translate-x-10 group-hover/row:translate-x-0">
                          <MdVisibility className="text-xl" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="p-8 bg-white/5 rounded-md border border-white/5 w-fit mx-auto">
                        <MdReceipt className="text-6xl text-brand-300 opacity-20" />
                      </div>
                      <p className="text-2xl font-black text-white uppercase tracking-tighter">Void Repository</p>
                      <p className="text-[10px] text-brand-300 font-black uppercase tracking-widest italic opacity-40">The specific operational parameters yielded zero recorded matches.</p>
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
        <div className="flex items-center justify-between">
          <div className={`p-5 rounded-md border ${bgStyle} ${borderStyle} ${textColor} shadow-inner group-hover:scale-110 duration-500`}>
            <Icon className="text-3xl" />
          </div>
          <span className={`text-[10px] font-black ${textColor} uppercase italic bg-white/5 px-4 py-2 rounded-md border border-white/5 shadow-inner tracking-widest`}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-black text-brand-300 tracking-[0.2em] mb-3 uppercase italic opacity-60">{label}</p>
          <p className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default History;
