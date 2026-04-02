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
        setError('failed to load workspace analytics: ' + errorMessage);
        toast.error('failed to fetch records');
        return;
      }

      if (response.data.data?.stockAnalysis) {
        setAnalyticsData(response.data.data.stockAnalysis);
      } else {
        setError('no analytics records retrieved');
      }
    } catch (err) {
      setError('connection to records server failed');
      toast.error('failed to sync records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse font-afacad">
        <div className="w-16 h-16 border-4 border-chocolate-100 border-t-chocolate-600 rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold text-black">Synchronizing Business Records...</p>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center font-afacad">
        <div className="p-8 bg-chocolate-50 rounded-lg border border-chocolate-100 mb-8">
          <MdBusiness className="text-6xl text-chocolate-300" />
        </div>
        <p className="text-2xl font-bold text-black max-w-md leading-tight">
          {error || 'No Operational Data Found For This Period'}
        </p>
        <button
          onClick={fetchAnalyticsData}
          className="mt-10 px-10 py-4 bg-chocolate-600 text-white font-bold rounded-lg hover:bg-chocolate-700 active:scale-95 transition-all shadow-lg"
        >
          Retry Synchronization
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-afacad">
      {/* Search & Audit Filter */}
      <div className="bg-white rounded-lg p-10 border border-chocolate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-chocolate-50/20 opacity-50 pointer-events-none" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-chocolate-50 rounded-lg border border-chocolate-100 shadow-sm transition-transform duration-500">
              <MdDateRange className="text-4xl text-black" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black leading-none mb-2">Operational Audit</h3>
              <p className="text-gray-500 text-lg font-medium">Define Analysis Period For Business Metrics</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 px-4 uppercase tracking-wider">Start Epoch</label>
              <div className="bg-white border border-chocolate-100 p-5 px-8 rounded-lg focus-within:ring-4 focus-within:ring-chocolate-50 transition-all flex items-center gap-4 shadow-sm">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-black text-lg font-bold focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 px-4 uppercase tracking-wider">End Epoch</label>
              <div className="bg-white border border-chocolate-100 p-5 px-8 rounded-lg focus-within:ring-4 focus-within:ring-chocolate-50 transition-all flex items-center gap-4 shadow-sm">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-black text-lg font-bold focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Gross Revenue', value: analyticsData.totalSales, unit: 'FRW', icon: MdTrendingUp, detail: `${analyticsData.products?.sold?.length || 0} Items Liquidated`, trend: 'up' },
          { label: 'Operational Cost', value: analyticsData.totalPurchases, unit: 'FRW', icon: MdShoppingCart, detail: `${analyticsData.products?.bought?.length || 0} Units Acquired`, trend: 'neutral' },
          { label: 'Net Liquidity', value: analyticsData.profit, unit: 'FRW', icon: MdInventory, detail: analyticsData.profit >= 0 ? 'Surplus Confirmed' : 'Deficit Detected', trend: analyticsData.profit >= 0 ? 'up' : 'down' },
          { label: 'Total Activities', value: analyticsData.transactions?.length || 0, unit: 'Records', icon: MdBusiness, detail: 'Cumulated Transactions', trend: 'neutral' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-chocolate-100 rounded-lg p-10 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-chocolate-50 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-lg border shadow-sm ${stat.trend === 'up' ? 'bg-green-50 text-green-700 border-green-100' : stat.trend === 'down' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-chocolate-50 text-black border-chocolate-100'}`}>
                  <stat.icon className="text-3xl" />
                </div>
                <div className="text-[10px] font-bold text-gray-400 bg-chocolate-50/50 px-4 py-1.5 rounded-full border border-chocolate-50 shadow-sm uppercase tracking-widest">
                  Live Feed
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{stat.label}</p>
                <h4 className="text-3xl font-bold text-black tracking-tight leading-none mb-3">
                  {stat.value?.toLocaleString() || '0'} <span className="text-lg opacity-40 font-medium">{stat.unit}</span>
                </h4>
                <p className="text-xs text-gray-500 font-bold opacity-60 px-1">{stat.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Performance Visualization */}
        <div className="bg-white border border-chocolate-100 rounded-lg p-12 shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-bold text-black leading-none mb-2">Financial Distribution</h3>
              <p className="text-sm text-gray-500 font-medium capitalize">Revenue Vs Procurement Analysis</p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-1.5 rounded-lg bg-chocolate-50 border border-chocolate-100 text-[10px] text-black font-bold uppercase tracking-widest">Active Period</div>
            </div>
          </div>
          <div className="flex-1 min-h-[400px]">
            {hasAnyData() ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Revenue", value: analyticsData.totalSales || 0 },
                      { name: "Procurement", value: analyticsData.totalPurchases || 0 }
                    ]}
                    cx="50%" cy="50%" innerRadius={80} outerRadius={130} paddingAngle={8} dataKey="value"
                    animationBegin={0} animationDuration={1500}
                  >
                    <Cell fill="#FC9E4F" stroke="#FC9E4F" strokeWidth={4} />
                    <Cell fill="#FC9E4F" stroke="#FC9E4F" strokeWidth={4} />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FC9E4F', border: '1px solid #FC9E4F', borderRadius: '12px', fontSize: '14px', color: '#FC9E4F', padding: '16px', boxShadow: '0 10px 15px -3px rgba(252,158,79,0.1)' }}
                    itemStyle={{ color: '#FC9E4F', fontWeight: '900' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-chocolate-200 font-bold">Insufficient Financial Data</div>
            )}
          </div>
          <div className="flex items-center justify-center gap-12 mt-8 pt-8 border-t border-tomato-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-tomato-500 shadow-sm" />
              <span className="text-sm text-tomato-500 font-bold uppercase tracking-wider">Liquidity Inflow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-tomato-200 shadow-sm border border-tomato-300" />
              <span className="text-sm text-tomato-500 font-bold uppercase tracking-wider">Capital Outflow</span>
            </div>
          </div>
        </div>

        {/* Audit Log (Recent Activity) */}
        <div className="bg-white border border-chocolate-100 rounded-lg p-12 shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-bold text-black leading-none mb-2">Operational Logs</h3>
              <p className="text-sm text-gray-500 font-medium capitalize">Real-time Record Of Business Events</p>
            </div>
            <div className="bg-chocolate-50 px-5 py-2 rounded-lg border border-chocolate-100 text-xs text-black font-bold">
              {analyticsData.transactions?.length || 0} Entries
            </div>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
            {analyticsData.transactions?.length > 0 ? (
              analyticsData.transactions.slice(0, 10).map((transaction, index) => (
                <div key={transaction.id || index} className="group flex items-center justify-between p-7 bg-chocolate-50/30 border border-chocolate-50 rounded-lg hover:bg-chocolate-50 transition-all hover:translate-x-2">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`p-4 rounded-lg border flex-shrink-0 ${transaction.type === 'Sale' ? 'bg-white text-black border-chocolate-100' : 'bg-white text-gray-400 border-chocolate-100'}`}>
                      <MdHistory className="text-2xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-black text-lg leading-tight group-hover:text-black transition-colors truncate">{transaction.description}</p>
                      <div className="flex items-center gap-3 mt-1 underline underline-offset-4 decoration-chocolate-100">
                        <span className="text-xs text-gray-400 font-bold capitalize">{transaction.type?.toLowerCase()} Recorded</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-6 flex-shrink-0">
                    <p className="text-[10px] font-bold text-chocolate-300 uppercase tracking-wider mb-1">Epoch Timestamp</p>
                    <p className="text-sm font-bold text-black">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-6 opacity-30">
                <MdHistory className="text-6xl text-chocolate-200" />
                <p className="text-gray-400 font-bold text-lg">Audit Log Is Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="bg-white border border-chocolate-100 rounded-lg p-12 shadow-xl">
        <h3 className="text-2xl font-bold text-black leading-none mb-10 text-center">Financial Liabilities & Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-chocolate-50/30 p-10 rounded-lg border border-chocolate-100 shadow-sm group hover:bg-chocolate-50 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-chocolate-100/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-[0.2em] px-1 group-hover:translate-x-1 transition-transform">Accumulated Credits</h4>
              <p className="text-5xl font-bold text-black tracking-tight">
                {analyticsData.finance?.credits?.toLocaleString() || '0'} <span className="text-xl opacity-30 font-medium uppercase tracking-widest">FRW</span>
              </p>
            </div>
          </div>
          <div className="bg-chocolate-50/30 p-10 rounded-lg border border-chocolate-100 shadow-sm group hover:bg-chocolate-50 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-chocolate-100/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-[0.2em] px-1 group-hover:translate-x-1 transition-transform">Outstanding Debits</h4>
              <p className="text-5xl font-bold text-black tracking-tight">
                {analyticsData.finance?.debits?.toLocaleString() || '0'} <span className="text-xl opacity-30 font-medium uppercase tracking-widest">FRW</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
