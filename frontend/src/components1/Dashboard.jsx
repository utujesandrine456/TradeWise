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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2 md:mb-8">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <MdTrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title">Today's Sales</p>
              <p className="stats-card-value">
                {today?.sales?.total?.toFixed(2) || '0.00'}Frw
              </p>
              <p className="stats-card-subtitle">{today?.sales?.count || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <MdShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title">Today's Purchases</p>
              <p className="stats-card-value">
                {today?.purchases?.total?.toFixed(2) || '0.00'}Frw
              </p>
              <p className="stats-card-subtitle">{today?.purchases?.count || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <MdInventory className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title">Total Products</p>
              <p className="stats-card-value">
                {inventory?.stats?.total_products || 0}Frw
              </p>
              <p className="stats-card-subtitle">
                {inventory?.stats?.in_stock || 0} in stock
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="stats-card-icon bg-[#BE741E]">
              <MdBusiness className="h-6 w-6 text-white" />
            </div>
            <div className="stats-card-content">
              <p className="stats-card-title">This Month</p>
              <p className="stats-card-value">
                {this_month?.sales?.total?.toFixed(2) || '0.00'}Frw
              </p>
              <p className="stats-card-subtitle">Total revenue</p>
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
