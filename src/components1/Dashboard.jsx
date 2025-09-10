import React, { useState, useEffect } from 'react';
import { dashboardAPI, notificationAPI } from '../services1/api';
import { MdTrendingUp, MdTrendingDown, MdInventory, MdShoppingCart, MdNotifications, MdBusiness } from 'react-icons/md';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login  to view dashboard');
        setLoading(false);
        return;
      }

      const response = await dashboardAPI.getData();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard data error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };


  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const response = await notificationAPI.getUserNotifications(user.id, 'unread', 10);
        if (response.success) {
          setNotifications(response.data);
        }
      }
    } catch (error) {
      console.error('Notifications error:', error);
    }
  };


  const markNotificationAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
     
      fetchDashboardData();
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BE741E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-[#BE741E] text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-center py-8">No dashboard data available</div>;
  }

  const { user, today, this_month, inventory, recent_activity, notifications: notificationData } = dashboardData;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.company_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your business today
          </p>
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <MdNotifications className="h-6 w-6" />
            {notificationData?.unread_count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationData.unread_count}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border">
              <div className="py-2">
                <div className="px-4 py-2 border-b">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${
                            notification.priority === 'high' ? 'bg-red-400' : 
                            notification.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`}></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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
                ${today?.sales?.total?.toFixed(2) || '0.00'}
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
                ${today?.purchases?.total?.toFixed(2) || '0.00'}
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
                {inventory?.stats?.total_products || 0}
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
                ${this_month?.sales?.total?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-500">Total revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Alerts */}
      {(inventory?.low_stock_alerts?.length > 0 || inventory?.out_of_stock_alerts?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Low Stock Alerts */}
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
            {recent_activity?.sales?.length > 0 ? (
              <div className="space-y-4">
                {recent_activity.sales.map((sale, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sale.product}</p>
                      <p className="text-sm text-gray-500">{sale.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${sale.total_price?.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent sales</p>
            )}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Purchases</h3>
          </div>
          <div className="p-6">
            {recent_activity?.purchases?.length > 0 ? (
              <div className="space-y-4">
                {recent_activity.purchases.map((purchase, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{purchase.product}</p>
                      <p className="text-sm text-gray-500">{purchase.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${purchase.total_price?.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent purchases</p>
            )}
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
                <p className="text-sm font-medium text-gray-500">Business Type</p>
                <p className="text-sm text-gray-900">{dashboardData.business_profile.business_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Industry</p>
                <p className="text-sm text-gray-900">{dashboardData.business_profile.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employees</p>
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
