import React, { useState, useEffect, useMemo } from 'react';
import {
  MdSearch, MdFilterList, MdCalendarToday, MdReceipt,
  MdShoppingCart, MdAttachMoney, MdAccountBalance,
  MdTrendingUp, MdVisibility, MdRefresh, MdDownload,
  MdOutlineSwapHoriz, MdPendingActions, MdInfo, MdLayers
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
        toast.error('audit log retrieval failed');
        setError('system error: failed to load transactions');
        return;
      }

      const transactionsData = response.data.data.transactions?.data || [];
      setTransactions(transactionsData);
    } catch (err) {
      setError('network error: failed to load transactions');
      toast.error('audit log retrieval failed');
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
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-accent-400/10 text-accent-400 border-accent-400/20';
    }
  };

  const getTypeIcon = (type) => {
    return type?.toLowerCase() === 'sale' ? <MdShoppingCart className="text-xl" /> : <MdAttachMoney className="text-xl" />;
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-afacad">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-chocolate-600 rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold text-black">Retrieving Audit Logs...</p>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6 font-afacad">
        <div className="p-8 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <MdInfo className="text-5xl text-black mx-auto mb-4" />
          <p className="text-xl font-bold text-black">{error}</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="px-8 py-4 bg-chocolate-600 hover:bg-chocolate-700 text-white rounded-lg font-bold transition-all active:scale-95 shadow-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-afacad">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white p-10 rounded-lg border border-gray-100 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gray-50/20 opacity-50 pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-100 shadow-sm group-hover:-rotate-12 transition-all duration-500">
            <MdHistory className="text-5xl text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-black leading-none mb-3 tracking-tight">Audit Ledger</h1>
            <p className="text-gray-500 text-lg font-medium">Comprehensive Archive Of Organizational Transactions</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <button
            onClick={fetchTransactions}
            className="p-5 bg-white hover:bg-gray-50 text-gray-400 hover:text-black rounded-lg border border-gray-100 transition-all active:scale-95 shadow-sm group/btn"
            title="Synchronize Ledgers"
          >
            <MdRefresh className="text-2xl group-hover/btn:rotate-180 transition-transform duration-700" />
          </button>
          <button
            className="group/export relative px-10 py-5 bg-chocolate-600 text-white rounded-lg font-bold transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg overflow-hidden text-lg tracking-wide"
          >
            <div className="flex items-center gap-3 relative z-10">
              <MdDownload className="text-2xl" />
              <span>Export Manifesto</span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SummaryCard
          icon={MdOutlineSwapHoriz}
          label="Gross Operations"
          value={stats.total}
          trend="Recorded Actions"
          color="chocolate"
        />
        <SummaryCard
          icon={MdTrendingUp}
          label="Inbound Revenue"
          value={`${stats.sales.toLocaleString()} FRW`}
          trend="Capital Injected"
          color="green"
        />
        <SummaryCard
          icon={MdAttachMoney}
          label="Outbound Capital"
          value={`${stats.purchases.toLocaleString()} FRW`}
          trend="Capital Expedited"
          color="red"
        />
        <SummaryCard
          icon={MdAccountBalance}
          label="Net Standing"
          value={`${stats.net.toLocaleString()} FRW`}
          trend="Fiscal Trajectory"
          color="chocolate-light"
        />
      </div>

      {/* Tactical Console (Filters/Search) */}
      <div className="bg-white p-10 rounded-lg border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none" />
        <div className="flex flex-col xl:flex-row gap-8 relative z-10">
          <div className="flex-1 relative group/search">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within/search:text-black transition-colors duration-300" />
            <input
              type="text"
              placeholder="Query Internal Records By Identity Or Parameter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-chocolate-50 text-black placeholder-chocolate-200 transition-all text-lg italic shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-4 bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm">
            {['all', 'sale', 'purchase'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-10 py-3 rounded-lg font-bold transition-all duration-300 capitalize ${selectedFilter === filter
                  ? 'bg-chocolate-600 text-white shadow-lg tracking-wide'
                  : 'text-gray-400 hover:text-black hover:bg-white'
                  }`}
              >
                {filter === 'all' ? 'Global' : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden group/table relative">
        <div className="p-10 border-b border-chocolate-50 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-50/10 pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <MdLayers className="text-3xl text-black" />
            <h2 className="text-2xl font-bold text-black shadow-sm">Transaction Records</h2>
          </div>
          <div className="px-6 py-2.5 bg-gray-50 border border-gray-100 shadow-sm rounded-full text-xs font-bold text-black uppercase tracking-widest relative z-10">
            Displaying {filteredTransactions.length} Operations
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-chocolate-50">
                <th className="px-10 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] w-32">Classification</th>
                <th className="px-10 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Description / Payload</th>
                <th className="px-10 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Financial Volume</th>
                <th className="px-10 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Temporal Marker</th>
                <th className="px-10 py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Entity Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chocolate-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50/30 transition-colors cursor-pointer group/row relative"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <td className="px-10 py-8 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-chocolate-600 group-hover/row:h-1/2 transition-all duration-300 rounded-r-full" />
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-lg border transition-all duration-300 group-hover/row:scale-110 shadow-md ${transaction.type?.toLowerCase() === 'sale' ? 'bg-green-50 border-green-100 text-green-700'
                          : 'bg-red-50 border-red-100 text-red-700'
                          }`}>
                          {getTypeIcon(transaction.type)}
                        </div>
                        <span className={`text-sm font-bold capitalize ${transaction.type?.toLowerCase() === 'sale' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="max-w-md">
                        <p className="text-base font-bold text-black group-hover/row:text-black transition-colors leading-tight line-clamp-2">
                          {transaction.products?.map(p => p.name).join(' + ') || transaction.description || 'Unidentified Payload'}
                        </p>
                        <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-widest">
                          ID Hash: {transaction.id?.slice(-8)}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-black tracking-tighter">
                          {(transaction.financials?.reduce((acc, f) => acc + (f.amount || 0), 0) || 0).toLocaleString()} <span className="text-[10px] text-gray-400 tracking-widest uppercase ml-1 select-none">FRW</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 opacity-50 group-hover/row:opacity-100 transition-opacity">
                          <MdCalendarToday className="text-gray-400 text-lg group-hover/row:text-black transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">
                            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Chronology Error'}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 capitalize">
                            {transaction.createdAt ? formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true }) : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center justify-center relative">
                        <span className="text-sm font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg shadow-sm group-hover/row:bg-white group-hover/row:text-black transition-all">
                          {transaction.secondParty || 'Internal Protocol'}
                        </span>
                        <div className="absolute -right-12 opacity-0 group-hover/row:opacity-100 group-hover/row:-right-4 transition-all duration-300 bg-chocolate-600 p-2 rounded-lg shadow-lg translate-x-4 group-hover/row:translate-x-0">
                          <MdVisibility className="text-white text-lg" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-10 py-32">
                    <div className="flex flex-col items-center justify-center space-y-6 text-center">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-chocolate-100/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50" />
                        <div className="relative p-8 bg-white rounded-full border border-gray-100 shadow-xl">
                          <MdReceipt className="text-6xl text-chocolate-100 group-hover:text-black transition-colors duration-500" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">Void Repository</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                          {searchTerm || selectedFilter !== 'all'
                            ? 'The specific operational parameters yielded zero recorded matches.'
                            : 'The ledger remains pristine. Initiate protocols to generate initial records.'}
                        </p>
                      </div>
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
    'chocolate': 'text-black bg-gray-50 border-gray-100 shadow-chocolate-100/20 from-chocolate-600',
    'green': 'text-green-700 bg-green-50 border-green-100 shadow-green-100/20 from-green-600',
    'red': 'text-red-700 bg-red-50 border-red-100 shadow-red-100/20 from-red-600',
    'chocolate-light': 'text-gray-400 bg-gray-50/50 border-chocolate-50 shadow-chocolate-50/20 from-chocolate-400',
  };

  const selectedColor = colorMap[color] || colorMap['chocolate'];
  const [textColor, bgStyle, borderStyle, shadowStyle, gradStyle] = selectedColor.split(' ');

  return (
    <div className="group bg-white p-10 rounded-lg border border-gray-100 shadow-xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-10 -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150 ${bgStyle}`} />
      <div className={`absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b ${gradStyle}/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-10">
        <div className="flex items-center justify-between">
          <div className={`p-5 rounded-lg border ${bgStyle} ${borderStyle} ${textColor} shadow-sm group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500`}>
            <Icon className="text-3xl" />
          </div>
          <span className={`text-[10px] font-bold ${textColor} uppercase bg-white px-4 py-2 rounded-full border ${borderStyle} shadow-sm`}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">{label}</p>
          <p className="text-4xl font-bold text-black tracking-tighter leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default History;
