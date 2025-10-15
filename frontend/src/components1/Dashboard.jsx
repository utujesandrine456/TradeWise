import { useState, useEffect } from 'react';
import { MdTrendingUp, MdInventory, MdShoppingCart, MdBusiness, MdAdd, MdWarning, MdCheckCircle } from 'react-icons/md';
import { useQuery } from '@apollo/client';
import { STOCK_ANALYSIS } from '../graphql/queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, AlertTriangle, Plus, Eye } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data, loading: qLoading, error: qError, startPolling, stopPolling, refetch } = useQuery(STOCK_ANALYSIS, { variables: { start: null, end: null }, fetchPolicy: 'cache-and-network', notifyOnNetworkStatusChange: true, pollInterval: 5000 });

  useEffect(() => {
    setLoading(qLoading);
    if (qError) setError('Failed to load dashboard data');
    if (data?.stockAnalysis) {
      const a = data.stockAnalysis;
      const mapped = {
        today: { sales: { total: a.totalSales, count: a.transactions?.length || 0 }, purchases: { total: a.totalPurchases, count: 0 } },
        this_month: { sales: { total: a.totalSales }, daily: [] },
        inventory: { stats: { total_products: a.products?.bought?.length || 0, in_stock: a.products?.bought?.length || 0, out_of_stock: 0 } },
        recent_activity: { sales: (a.transactions||[]).slice(0,5).map(t=>({ id: t.id, product: t.description, customer: t.type, total_price: 0, created_at: new Date().toISOString() })), purchases: [] },
        business_profile: null,
      };
      setDashboardData(mapped);
    }
  }, [data, qLoading, qError]);



  if (!dashboardData) {
    return <div className="text-center py-8">No dashboard data available</div>;
  }

  const { today, this_month, inventory, recent_activity } = dashboardData;


  return (
    <div className="dashboard-container">
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/stocks" className="group">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#BE741E] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">Manage Stock</h3>
                <p className="text-sm text-gray-600">Add, edit, and track inventory</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/stocks" className="group">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#BE741E] rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Add New Item</h3>
                <p className="text-sm text-gray-600">Quickly add products to inventory</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/stocks" className="group">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#BE741E] rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">View Analytics</h3>
                <p className="text-sm text-gray-600">Detailed business insights</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats-card border border-green-200">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title text-green-700">Today's Sales</p>
              <p className="stats-card-value text-green-800">
                {today?.sales?.total?.toFixed(2) || '0.00'} RWF
              </p>
              <p className="stats-card-subtitle text-green-600">{today?.sales?.count || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="stats-card border border-blue-200">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <MdShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title text-blue-700">Today's Purchases</p>
              <p className="stats-card-value text-blue-800">
                {today?.purchases?.total?.toFixed(2) || '0.00'} RWF
              </p>
              <p className="stats-card-subtitle text-blue-600">{today?.purchases?.count || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="stats-card border border-amber-200">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title text-amber-700">Total Products</p>
              <p className="stats-card-value text-amber-800">
                {inventory?.stats?.total_products || 0}
              </p>
              <p className="stats-card-subtitle text-amber-600">
                {inventory?.stats?.in_stock || 0} in stock
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card border border-purple-200">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <MdBusiness className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title text-purple-700">This Month</p>
              <p className="stats-card-value text-purple-800">
                {this_month?.sales?.total?.toFixed(2) || '0.00'} RWF
              </p>
              <p className="stats-card-subtitle text-purple-600">Total revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#BE741E] rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#BE741E] rounded-full"></div>
                <span className="text-sm font-medium text-red-800">Low Stock Items</span>
              </div>
              <span className="text-sm font-bold text-red-600">{inventory?.stats?.low_stock || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#BE741E] rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800">Out of Stock</span>
              </div>
              <span className="text-sm font-bold text-yellow-600">{inventory?.stats?.out_of_stock || 0}</span>
            </div>
            <Link to="/stocks" className="block w-full text-center py-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              View All Stock Items →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-green-800">Total Inventory Value</span>
              <span className="text-sm font-bold text-green-600">
                {((inventory?.stats?.total_products || 0) * 1000).toLocaleString()} RWF
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-800">Active Products</span>
              <span className="text-sm font-bold text-blue-600">{inventory?.stats?.in_stock || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-sm font-medium text-purple-800">Categories</span>
              <span className="text-sm font-bold text-purple-600">5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales vs Purchases (This Month)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={this_month?.daily || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#BE741E" strokeWidth={2} />
            <Line type="monotone" dataKey="purchases" stroke="#000" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "In Stock", value: inventory?.stats?.in_stock || 0 },
                { name: "Out of Stock", value: inventory?.stats?.out_of_stock || 0 }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label
            >
              <Cell fill="#BE741E" />
              <Cell fill="#000" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Alerts */}
      {(inventory?.low_stock_alerts?.length > 0 || inventory?.out_of_stock_alerts?.length > 0) && (
        <div className="inventory-alerts">
          <h2>Inventory Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            {inventory.low_stock_alerts?.length > 0 && (
              <div className="alert-card low-stock">
                <h3>Low Stock Items</h3>
                <div className="space-y-2">
                  {inventory.low_stock_alerts.map((item, index) => (
                    <div key={index} className="alert-item low-stock">
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} left (Min: {item.min_stock_level})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Out of Stock Alerts */}
            {inventory.out_of_stock_alerts?.length > 0 && (
              <div className="alert-card out-of-stock">
                <h3>Out of Stock Items</h3>
                <div className="space-y-2">
                  {inventory.out_of_stock_alerts.map((item, index) => (
                    <div key={index} className="alert-item out-of-stock">
                      <span>{item.name}</span>
                      <span>{item.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-activity">
        {/* Recent Sales */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3>Recent Sales</h3>
          </div>
          <div className="activity-card-content">
            <div className="space-y-4">
              {recent_activity.sales.map((sale, index) => (
                <div key={sale.id || index} className="activity-item p-2 hover:bg-gray-50 rounded">
                  <div className="activity-item-info">
                    <p>{sale.product}</p>
                    <p>{sale.customer}</p>
                  </div>
                  <div className="activity-item-amount text-right">
                    <p>
                      {sale.total_price?.toFixed(2)} Frw
                    </p>
                    <p className="text-xs">
                      {new Date(sale.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3>Recent Purchases</h3>
          </div>
          <div className="activity-card-content">
            <div className="space-y-4">
              {recent_activity.purchases.map((purchase, index) => (
                <div key={purchase.id || index} className="activity-item p-2 hover:bg-gray-50 rounded">
                  <div className="activity-item-info">
                    <p>{purchase.product}</p>
                    <p>{purchase.supplier}</p>
                  </div>
                  <div className="activity-item-amount text-right">
                    <p>
                      {purchase.total_price?.toFixed(2)} Frw
                    </p>
                    <p className="text-xs">
                      {new Date(purchase.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Business Profile Summary */}
      {dashboardData.business_profile && (
        <div className="business-profile">
          <div className="business-profile-header">
            <h3>Business Profile</h3>
          </div>
          <div className="business-profile-content">
            <div className="business-profile-grid">
              <div className="business-profile-item">
                <p className="text-md font-medium text-[#BE741E]">Business Type</p>
                <p>{dashboardData.business_profile.business_type}</p>
              </div>
              <div className="business-profile-item">
                <p className="text-md font-medium text-[#BE741E]">Industry</p>
                <p>{dashboardData.business_profile.industry}</p>
              </div>
              <div className="business-profile-item">
                <p className="text-md font-medium text-[#BE741E]">Employees</p>
                <p>{dashboardData.business_profile.employee_count}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
