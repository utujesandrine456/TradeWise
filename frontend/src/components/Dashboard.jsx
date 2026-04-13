import { useState, useEffect } from 'react';
import { MdTrendingUp, MdInventory, MdShoppingCart, MdBusiness, MdDateRange, MdHistory } from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';
import { backendGqlApi } from '../utils/axiosInstance';
import { getAnalytics } from '../utils/gqlQuery';
import { useSelector } from 'react-redux';
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
  const { user } = useSelector((state) => state.auth);

  const fetchAnalyticsData = async () => {
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
    } catch (err) {
      setError('Connection To Records Server Failed');
      toast.error('Failed To Sync Records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-Urbanist text-[#09111E]">
        <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-900 rounded-md animate-spin mb-6"></div>
        <p className="text-xl font-bold tracking-tight italic opacity-60">Synchronizing Business Records...</p>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center font-Urbanist">
        <div className="p-10 bg-brand-50 rounded-md border border-brand-100 mb-8 shadow-inner">
          <MdBusiness className="text-6xl text-brand-200" />
        </div>
        <p className="text-2xl font-bold text-[#09111E] max-w-md leading-tight tracking-tight">
          {error || 'No operational data found for this period'}
        </p>
        <button
          onClick={fetchAnalyticsData}
          className="mt-10 px-12 py-5 bg-[#09111E] text-white font-bold rounded-md hover:bg-[#09111E] active:scale-95 transition-all shadow-xl tracking-wide text-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <span className="relative z-10">Retry Sync</span>
        </button>
      </div>
    );
  }

  const chartData = [
    { name: 'Sales Volume', value: analyticsData.totalSales || 0 },
    { name: 'Procurement', value: analyticsData.totalPurchases || 0 }
  ];

  const hasAnyData = () => {
    return (analyticsData.totalSales || 0) > 0 ||
      (analyticsData.totalPurchases || 0) > 0 ||
      (analyticsData.transactions?.length || 0) > 0;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Search & Audit Filter */}
      <div className="bg-[#09111E] rounded-md p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className="p-5 bg-white/5 rounded-md text-accent-400 border border-white/5 shadow-xl transition-transform duration-500 group-hover:rotate-6">
              <MdDateRange className="text-4xl" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white leading-none mb-3 tracking-tight">Reporting Filter</h3>
              <p className="text-brand-300 text-lg font-semibold opacity-60">Define the analysis period for your dashboard</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-300 px-2 opacity-60">Start Date</label>
              <div className="bg-white/5 border border-white/5 p-5 px-8 rounded-md focus-within:ring-4 focus-within:ring-accent-400/10 focus-within:border-accent-400/50 transition-all flex items-center gap-4 shadow-inner">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-white text-lg font-bold focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-300 px-2 opacity-60">End Date</label>
              <div className="bg-white/5 border border-white/5 p-5 px-8 rounded-md focus-within:ring-4 focus-within:ring-accent-400/10 focus-within:border-accent-400/50 transition-all flex items-center gap-4 shadow-inner">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-white text-lg font-bold focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: analyticsData.totalSales, unit: 'FRW', icon: MdTrendingUp, detail: `${analyticsData.products?.sold?.length || 0} product sales recorded`, color: 'accent-400' },
          { label: 'Total Expenses', value: analyticsData.totalPurchases, unit: 'FRW', icon: MdShoppingCart, detail: `${analyticsData.products?.bought?.length || 0} purchase orders completed`, color: 'brand-300' },
          { label: 'Net Profit', value: analyticsData.profit, unit: 'FRW', icon: MdInventory, detail: analyticsData.profit >= 0 ? 'Profit margin healthy' : 'Loss detected for period', color: analyticsData.profit >= 0 ? 'green-500' : 'red-500' },
          { label: 'Total Transactions', value: analyticsData.transactions?.length || 0, unit: 'Orders', icon: MdBusiness, detail: 'Cumulative system records', color: 'accent-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#09111E] border border-white/5 rounded-md p-10 shadow-2xl hover:border-white/10 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-40 h-40 bg-${stat.color}/5 rounded-md -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000 blur-3xl`} />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-10">
                <div className={`p-5 rounded-md border shadow-inner bg-white/5 border-white/5 text-${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="text-3xl" />
                </div>
                <div className="text-[10px] font-bold text-brand-300 bg-white/5 px-4 py-2 rounded-md border border-white/5 shadow-inner tracking-wider opacity-60">
                  Business Status
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest mb-3 px-1 italic opacity-60">{stat.label}</p>
                <h4 className="text-4xl font-black text-white tracking-tighter leading-none mb-4">
                  {stat.value?.toLocaleString() || '0'} <span className="text-lg opacity-40 font-black tracking-widest uppercase italic">{stat.unit}</span>
                </h4>
                <p className="text-[10px] text-brand-300 font-bold uppercase tracking-widest opacity-40 px-1 italic">{stat.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Performance Visualization */}
        <div className="bg-[#09111E] border border-white/5 rounded-md p-12 shadow-2xl flex flex-col h-full group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-400 to-transparent" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-bold text-white leading-none mb-3 tracking-tight">Financial Overview</h3>
              <p className="text-brand-300 text-xs font-semibold opacity-60">Revenue vs. Expenses Breakdown</p>
            </div>
            <div className="px-5 py-2 rounded-md bg-white/5 border border-white/5 text-accent-400 text-xs font-bold shadow-inner">
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
                    <Cell fill="#60A5FA" stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
                    <Cell fill="#09111E" stroke="#60A5FA" strokeWidth={1} />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09111E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#ffffff', padding: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#ffffff', fontWeight: '700' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-6 opacity-20">
                <MdBusiness className="text-6xl text-white" />
                <p className="text-lg font-black text-white uppercase tracking-widest">Insufficient Protocol Data</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-12 mt-12 pt-10 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-accent-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
              <span className="text-xs text-brand-300 font-bold opacity-60">Revenue</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full border border-accent-400 shadow-lg" />
              <span className="text-xs text-brand-300 font-bold opacity-60">Expenses</span>
            </div>
          </div>
        </div>

        {/* Audit Log (Recent Activity) */}
        <div className="bg-[#09111E] border border-white/5 rounded-md p-12 shadow-2xl flex flex-col h-full group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-300 to-transparent opacity-20" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-bold text-white leading-none mb-3 tracking-tight">Recent Activity</h3>
              <p className="text-brand-300 text-xs font-semibold opacity-60">Latest transactions and system logs</p>
            </div>
            <div className="bg-white/5 border border-white/5 px-6 py-2.5 rounded-md text-brand-300 text-xs font-bold shadow-inner">
              {analyticsData.transactions?.length || 0} Activities
            </div>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar relative z-10">
            {analyticsData.transactions?.length > 0 ? (
              analyticsData.transactions.slice(0, 10).map((transaction, index) => (
                <div key={transaction.id || index} className="group/item flex items-center justify-between p-7 bg-white/[0.02] border border-white/5 rounded-md hover:bg-white/[0.05] transition-all hover:translate-x-3 shadow-inner">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`p-4 rounded-md border flex-shrink-0 transition-all duration-500 group-hover/item:bg-accent-400 group-hover/item:text-brand-950 ${transaction.type === 'Sale' ? 'text-accent-400 bg-white/5 border-white/5 shadow-inner' : 'text-brand-300 bg-white/5 border-white/5 shadow-inner opacity-40'}`}>
                      <MdHistory className="text-2xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xl leading-tight tracking-tight truncate group-hover/item:text-accent-400 transition-colors">{transaction.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-bold tracking-wider italic ${transaction.type === 'Sale' ? 'text-accent-400' : 'text-brand-300 opacity-60'}`}>{transaction.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-8 flex-shrink-0">
                    <p className="text-[9px] font-bold text-brand-300 mb-2 italic opacity-40">Date</p>
                    <p className="text-xs font-bold text-white tracking-wide">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-8 py-20 opacity-20">
                <div className="p-10 bg-white/5 rounded-md border border-white/5 shadow-inner">
                  <MdHistory className="text-6xl text-white" />
                </div>
                <p className="text-white font-bold text-sm tracking-wide italic opacity-40">No activity recorded for this period</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="bg-[#09111E] border border-white/5 rounded-md p-14 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-400/5 to-transparent pointer-events-none" />
        <h3 className="text-4xl font-bold text-white leading-none mb-16 text-center tracking-tight">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="bg-white/5 p-12 rounded-md border border-white/5 shadow-inner group/card hover:bg-white/[0.08] transition-all relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-accent-400 opacity-50" />
            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-xs font-bold text-brand-300 mb-6 px-1 group-hover/card:translate-x-2 transition-transform opacity-60">Total Income</h4>
              <p className="text-7xl font-bold text-white tracking-tight leading-none">
                {analyticsData.finance?.credits?.toLocaleString() || '0'} <span className="text-2xl font-bold ml-2 opacity-20">FRW</span>
              </p>
            </div>
          </div>
          <div className="bg-white/5 p-12 rounded-md border border-white/5 shadow-inner group/card hover:bg-white/[0.08] transition-all relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-brand-300 opacity-50" />
            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-xs font-bold text-brand-300 mb-6 px-1 group-hover/card:translate-x-2 transition-transform opacity-60">Total Debt</h4>
              <p className="text-7xl font-bold text-white tracking-tight leading-none">
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
