import { useState, useEffect, useCallback } from 'react';
import Loader from './Loader';
import { MdTrendingUp, MdInventory, MdShoppingCart, MdBusiness, MdDateRange, MdHistory } from 'react-icons/md';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';
import { backendGqlApi } from '../utils/axiosInstance';
import { getAnalytics } from '../utils/gqlQuery';
import { toast } from '../utils/toast';



const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 90);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await backendGqlApi.post('/graphql', {
        query: getAnalytics,
        variables: {
          start: new Date(startDate + 'T00:00:00').toISOString(),
          end: new Date(endDate + 'T23:59:59').toISOString()
        }
      });

      if (response.data.errors) {
        const errorMessage = response.data.errors[0].message;
        setError('Failed To Load Workspace Analytics: ' + errorMessage);
        toast.error('Failed To Fetch Records');
        return;
      }

      if (response.data.data?.stockAnalysis) {
        setAnalyticsData(response.data.data.stockAnalysis);
      } else {
        setError('No Analytics Records Retrieved');
      }
    } catch {
      setError('Connection To Records Server Failed');
      toast.error('Failed To Sync Records');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate, fetchAnalyticsData]);

  if (loading) {
    return <Loader />;
  }

  if (error || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center font-Urbanist max-w-2xl mx-auto">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gray-50 blur-3xl rounded-full translate-y-4" />
          <div className="relative cursor-pointer p-8 bg-gray-50 rounded-full border border-gray-100 shadow-sm group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#09111E]/5 to-transparent" />
            <MdBusiness className="text-7xl text-[#09111E]/50 relative z-10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-[#09111E] mb-4">Registry Paradox Detected</h2>
        <p className="text-md font-semibold text-[#09111E]/80 italic opacity-60 leading-relaxed mb-12">
          {error || 'The operational ledger currently contains zero synchronized records for this temporal coordinate.'}
        </p>
      </div>
    );
  }


  const hasAnyData = () => {
    return (analyticsData.totalSales || 0) > 0 ||
      (analyticsData.totalPurchases || 0) > 0 ||
      (analyticsData.transactions?.length || 0) > 0;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Search & Audit Filter */}
      <div className="bg-white rounded-md p-12 border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className="p-3 bg-gray-50 rounded-full text-[#09111E] border border-gray-100 shadow-sm transition-transform duration-500 group-hover:rotate-6">
              <MdDateRange className="text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#09111E] leading-none mb-3">Reporting Filter</h3>
              <p className="text-[#09111E]/80 text-sm font-medium opacity-60">Define the analysis period for your dashboard</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#09111E]/60 px-2 opacity-60">Start Date</label>
              <div className="bg-gray-50 border border-gray-100 p-3 px-8 rounded-md focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-gray-100 transition-all flex items-center gap-4 shadow-inner">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-[#09111E] text-sm font-bold focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#09111E]/60 px-2 opacity-60">End Date</label>
              <div className="bg-gray-50 border border-gray-100 p-3 px-8 rounded-md focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-gray-100 transition-all flex items-center gap-4 shadow-inner">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-[#09111E] text-sm font-bold focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: analyticsData.totalSales, unit: 'FRW', icon: MdTrendingUp, detail: `${analyticsData.products?.sold?.length || 0} product sales recorded`, color: 'brand-400' },
          { label: 'Total Expenses', value: analyticsData.totalPurchases, unit: 'FRW', icon: MdShoppingCart, detail: `${analyticsData.products?.bought?.length || 0} purchase orders completed`, color: 'brand-200' },
          { label: 'Net Profit', value: analyticsData.profit, unit: 'FRW', icon: MdInventory, detail: analyticsData.profit >= 0 ? 'Profit margin healthy' : 'Loss detected for period', color: analyticsData.profit >= 0 ? 'emerald-500' : 'red-500' },
          { label: 'Total Transaction', value: analyticsData.transactions?.length || 0, unit: 'Orders', icon: MdBusiness, detail: 'Cumulative system records', color: 'brand-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#09111E] border border-white/5 rounded-md p-6 shadow-2xl hover:shadow-brand-500/10 transition-all cursor-pointer group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000 blur-2xl opacity-60`} />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-md font-semibold text-white/40 mb-6">{stat.label}</p>
                <h4 className="text-4xl font-bold text-white leading-none mb-6">
                  {stat.value?.toLocaleString() || '0'} <span className="text-lg text-white/20 font-bold italic ml-1">{stat.unit}</span>
                </h4>
                <p className="text-sm text-white/20 font-medium">{stat.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Performance Visualization */}
        <div className="bg-white border border-gray-100 rounded-md p-12 shadow-sm flex flex-col h-full group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-100 to-transparent" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-bold text-[#09111E] leading-none mb-3">Financial Overview</h3>
              <p className="text-[#09111E]/80 text-xs font-medium opacity-60">Revenue vs. Expenses Breakdown</p>
            </div>
            <div className="px-5 py-2 rounded-md bg-gray-50 border border-gray-100 text-[#09111E] text-xs font-bold shadow-inner">
              Chart View
            </div>
          </div>
          <div className="flex-1 min-h-[400px] relative z-10">
            {hasAnyData() ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Revenue Flow", value: analyticsData.totalSales || 0 },
                      { name: "Capital Outflow", value: analyticsData.totalPurchases || 0 }
                    ]}
                    cx="50%" cy="50%" innerRadius={100} outerRadius={150} paddingAngle={10} dataKey="value"
                    animationBegin={0} animationDuration={2000}
                  >
                    <Cell fill="#09111E" stroke="rgba(0,0,0,0.05)" strokeWidth={2} />
                    <Cell fill="#f1f5f9" stroke="#09111E" strokeWidth={1} />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '8px', fontSize: '12px', color: '#09111E', padding: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#09111E', fontWeight: '700' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-6 opacity-80">
                <MdBusiness className="text-6xl text-[#09111E]/60" />
                <p className="text-lg font-medium text-[#09111E]">Insufficient Protocol Data</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-12 mt-12 pt-10 border-t border-gray-100 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#09111E]" />
              <span className="text-sm text-[#09111E]/80 font-bold opacity-60">Revenue</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full border border-gray-200 shadow-sm" />
              <span className="text-sm text-[#09111E]/80 font-bold opacity-60">Expenses</span>
            </div>
          </div>
        </div>

        {/* Audit Log (Recent Activity) */}
        <div className="bg-white border border-gray-100 rounded-md p-12 shadow-sm flex flex-col h-full group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-100 to-transparent" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-bold text-[#09111E] leading-none mb-3">Recent Activity</h3>
              <p className="text-[#09111E]/80 text-xs font-medium opacity-60">Latest transactions and system logs</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 px-6 py-2.5 rounded-md text-[#09111E]/80 text-xs font-bold shadow-inner">
              {analyticsData.transactions?.length || 0} Activities
            </div>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar relative z-10">
            {analyticsData.transactions?.length > 0 ? (
              analyticsData.transactions.slice(0, 10).map((transaction, index) => (
                <div key={transaction.id || index} className="group/item flex items-center justify-between p-7 bg-gray-50/50 border border-gray-50 rounded-md hover:bg-gray-50 transition-all hover:translate-x-3 shadow-sm">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`p-4 rounded-md border flex-shrink-0 transition-all duration-500 group-hover/item:bg-[#09111E] group-hover/item:text-white ${transaction.type === 'Sale' ? 'text-[#09111E] bg-white border-gray-100' : 'text-[#09111E]/60 bg-gray-100 border-gray-100'}`}>
                      <MdHistory className="text-2xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#09111E] text-xl leading-tight truncate group-hover/item:text-[#09111E] transition-colors">{transaction.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-bold italic ${transaction.type === 'Sale' ? 'text-[#09111E]' : 'text-[#09111E]/60'}`}>{transaction.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-8 flex-shrink-0">
                    <p className="text-[9px] font-bold text-[#09111E]/60 mb-2 italic opacity-40">Date</p>
                    <p className="text-xs font-bold text-[#09111E]">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-8 py-20 opacity-80">
                <div className="p-10 bg-gray-50 rounded-full border border-gray-100 shadow-inner">
                  <MdHistory className="text-6xl text-[#09111E]/60" />
                </div>
                <p className="text-[#09111E]/80 font-medium text-md italic">No activity recorded for this period</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="bg-white border border-gray-100 rounded-md p-12 shadow-sm relative overflow-hidden group">
        <h3 className="text-4xl font-bold text-[#09111E] leading-none mb-16 text-center">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="cursor-pointer bg-gray-50 p-6 rounded-md border border-gray-100 shadow-sm group/card hover:bg-gray-100 transition-all relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-[#09111E] opacity-70" />
            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-md font-bold text-[#09111E]/60 mb-6 px-1 group-hover/card:translate-x-2 transition-transform opacity-60">Total Income</h4>
              <p className="text-3xl font-bold text-[#09111E] leading-none">
                {analyticsData.finance?.credits?.toLocaleString() || '0'} <span className="text-2xl font-bold ml-2 opacity-20">FRW</span>
              </p>
            </div>
          </div>
          <div className="cursor-pointer bg-gray-50 p-6 rounded-md border border-gray-100 shadow-sm group/card hover:bg-gray-100 transition-all relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-[#09111E] opacity-70" />
            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-md font-bold text-[#09111E]/60 mb-6 px-1 group-hover/card:translate-x-2 transition-transform opacity-60">Total Debt</h4>
              <p className="text-3xl font-bold text-[#09111E] leading-none">
                {analyticsData.finance?.debits?.toLocaleString() || '0'} <span className="text-2xl font-bold ml-2 opacity-20">FRW</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
