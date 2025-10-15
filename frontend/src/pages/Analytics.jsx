import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { STOCK_ANALYSIS } from '../graphql/queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { data } = useQuery(STOCK_ANALYSIS, { variables: { start: null, end: null }, fetchPolicy: 'cache-and-network', pollInterval: 5000 });

  const charts = useMemo(() => {
    const a = data?.stockAnalysis;
    if (!a) return { salesVsPurchases: [], productsPie: [] };
    const salesVsPurchases = [
      { label: 'Total Sales', value: a.totalSales },
      { label: 'Total Purchases', value: a.totalPurchases },
      { label: 'Profit', value: a.profit },
    ];
    const productsPie = [
      { name: 'Bought', value: a.products?.bought?.length || 0 },
      { name: 'Sold', value: a.products?.sold?.length || 0 },
    ];
    return { salesVsPurchases, productsPie };
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Totals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.salesVsPurchases}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#BE741E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={charts.productsPie} cx="50%" cy="50%" outerRadius={120} dataKey="value" label>
                <Cell fill="#BE741E" />
                <Cell fill="#000000" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


