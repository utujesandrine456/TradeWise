import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { STOCK_ANALYSIS } from '../graphql/queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { data } = useQuery(STOCK_ANALYSIS, {
    variables: { start: null, end: null },
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000
  });

  const charts = useMemo(() => {
    const a = data?.stockAnalysis;
    if (!a) return { salesVsPurchases: [], productsPie: [] };

    const salesVsPurchases = [
      { label: 'Total Sales', value: a.totalSales },
      { label: 'Total Purchases', value: a.totalPurchases },
      { label: 'Net Profit', value: a.profit },
    ];

    const productsPie = [
      { name: 'Purchased Items', value: a.products?.bought?.length || 0 },
      { name: 'Sold Items', value: a.products?.sold?.length || 0 },
    ];

    return { salesVsPurchases, productsPie };
  }, [data]);

  const BRAND_COLORS = ['#09111E', '#1D2D44', '#3E5C76', '#748CAB'];

  return (
    <div className="min-h-screen bg-brand-50 p-8 font-Urbanist animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="bg-white p-10 rounded-md border border-brand-100 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-50/10 opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-[#09111E] tracking-tight mb-2">Business Analytics</h1>
            <p className="text-brand-400 font-semibold text-sm">Real-time performance and financial insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Totals Bar Chart */}
          <div className="bg-white rounded-md shadow-[0_40px_80px_-20px_rgba(9,17,30,0.1)] p-10 border border-brand-100 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 bg-[#09111E] h-full" />
            <h3 className="text-2xl font-bold text-[#09111E] mb-8 tracking-tight">Revenue & Profit</h3>
            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.salesVsPurchases} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      backgroundColor: '#ffffff',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '30px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {charts.salesVsPurchases.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.label === 'Net Profit' ? '#10b981' : '#09111E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Pie Chart */}
          <div className="bg-white rounded-md shadow-[0_40px_80px_-20px_rgba(9,17,30,0.1)] p-10 border border-brand-100 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 bg-[#09111E] h-full" />
            <h3 className="text-2xl font-bold text-[#09111E] mb-8 tracking-tight">Resource Distribution</h3>
            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.productsPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    stroke="none"
                  >
                    {charts.productsPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      backgroundColor: '#ffffff',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={40}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#09111E] rounded-md p-10 text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-md -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <p className="text-xs font-bold opacity-60 mb-4">Total Sales</p>
            <h4 className="text-4xl font-bold tracking-tight">{(data?.stockAnalysis?.totalSales || 0).toLocaleString()} <span className="text-xs opacity-40 ml-2">Frw</span></h4>
          </div>
          <div className="bg-white border border-brand-100 rounded-md p-10 text-[#09111E] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-md -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
            <p className="text-xs font-bold text-brand-300 mb-4">Total Purchases</p>
            <h4 className="text-4xl font-bold tracking-tight">{(data?.stockAnalysis?.totalPurchases || 0).toLocaleString()} <span className="text-xs text-brand-200 ml-2">Frw</span></h4>
          </div>
          <div className="bg-emerald-600 rounded-md p-10 text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-md -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <p className="text-xs font-bold opacity-60 mb-4">Net Profit</p>
            <h4 className="text-4xl font-bold tracking-tight">{(data?.stockAnalysis?.profit || 0).toLocaleString()} <span className="text-xs opacity-40 ml-2">Frw</span></h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
