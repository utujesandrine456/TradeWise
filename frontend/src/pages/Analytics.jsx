import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { STOCK_ANALYSIS } from '../graphql/queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  // Start/End are optional for total analysis
  const { data } = useQuery(STOCK_ANALYSIS, {
    variables: { start: null, end: null },
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000 // Poll every 10 seconds for real-time updates
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

  const BRAND_COLORS = ['#FC9E4F', '#f97316', '#fbbf24', '#000000'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-afacad">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Business Analytics</h1>
          <p className="text-gray-600 font-medium">Real-time performance overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Totals Bar Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold text-black mb-6">Revenue & Profit Overview</h3>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.salesVsPurchases}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#fef3c7' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {charts.salesVsPurchases.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.label === 'Net Profit' ? '#10b981' : '#FC9E4F'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Pie Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold text-black mb-6">Inventory Distribution</h3>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.productsPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {charts.productsPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-brand-500 rounded-3xl p-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Sales</p>
            <h4 className="text-3xl font-bold mt-2">{(data?.stockAnalysis?.totalSales || 0).toLocaleString()} Frw</h4>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-brand-100 shadow-lg">
            <p className="text-sm font-bold text-black uppercase tracking-wider">Total Purchases</p>
            <h4 className="text-3xl font-bold mt-2 text-black">{(data?.stockAnalysis?.totalPurchases || 0).toLocaleString()} Frw</h4>
          </div>
          <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Net Profit</p>
            <h4 className="text-3xl font-bold mt-2">{(data?.stockAnalysis?.profit || 0).toLocaleString()} Frw</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
