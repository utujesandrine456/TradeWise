import { useState, useEffect } from 'react';
import { MdTrendingUp, MdInventory, MdShoppingCart, MdBusiness } from 'react-icons/md';
import { mockDashboardData, mockApiResponse} from '../__mock__';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await mockApiResponse(mockDashboardData);
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);



  if (!dashboardData) {
    return <div className="text-center py-8">No dashboard data available</div>;
  }

  const { today, this_month, inventory, recent_activity } = dashboardData;


  return (
    <div className="dashboard-container">
      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MdTrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {today?.sales?.total?.toFixed(2) || '0.00'}Frw
              </p>
              <p className="text-sm text-gray-500">{today?.sales?.count || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Purchases</p>
              <p className="text-2xl font-semibold text-gray-900">
                {today?.purchases?.total?.toFixed(2) || '0.00'}Frw
              </p>
              <p className="text-sm text-gray-500">{today?.purchases?.count || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MdInventory className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">
                {inventory?.stats?.total_products || 0}Frw
              </p>
              <p className="text-sm text-gray-500">
                {inventory?.stats?.in_stock || 0} in stock
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MdBusiness className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {this_month?.sales?.total?.toFixed(2) || '0.00'}Frw
              </p>
              <p className="text-sm text-gray-500">Total revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales vs Purchases (This Month)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={this_month?.daily || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2} />
            <Line type="monotone" dataKey="purchases" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
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
              <Cell fill="#16a34a" />
              <Cell fill="#dc2626" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Alerts */}
      {(inventory?.low_stock_alerts?.length > 0 || inventory?.out_of_stock_alerts?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            {inventory.low_stock_alerts?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-yellow-800 mb-3">Low Stock Items</h3>
                <div className="space-y-2">
                  {inventory.low_stock_alerts.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-yellow-700">{item.name}</span>
                      <span className="text-yellow-600">
                        {item.quantity} left (Min: {item.min_stock_level})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Out of Stock Alerts */}
            {inventory.out_of_stock_alerts?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800 mb-3">Out of Stock Items</h3>
                <div className="space-y-2">
                  {inventory.out_of_stock_alerts.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-red-700">{item.name}</span>
                      <span className="text-red-600">{item.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recent_activity.sales.map((sale, index) => (
                <div key={sale.id || index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sale.product}</p>
                    <p className="text-sm text-gray-500">{sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {sale.total_price?.toFixed(2)} Frw
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Purchases</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recent_activity.purchases.map((purchase, index) => (
                <div key={purchase.id || index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{purchase.product}</p>
                    <p className="text-sm text-gray-500">{purchase.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {purchase.total_price?.toFixed(2)} Frw
                    </p>
                    <p className="text-xs text-gray-500">
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
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Business Profile</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-md font-medium text-[#BE741E]">Business Type</p>
                <p className="text-sm text-gray-900">{dashboardData.business_profile.business_type}</p>
              </div>
              <div>
                <p className="text-md font-medium text-[#BE741E]">Industry</p>
                <p className="text-sm text-gray-900">{dashboardData.business_profile.industry}</p>
              </div>
              <div>
                <p className="text-md font-medium text-[#BE741E]">Employees</p>
                <p className="text-sm text-gray-900">{dashboardData.business_profile.employee_count}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
